import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

admin.initializeApp();

// ECPay Test Environment Credentials
const ECPAY_CONFIG = {
  MerchantID: "2000132",
  HashKey: "5294y06JbISpM5x9",
  HashIV: "v77hoKGq4kWxNNIS",
  PaymentUrl: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5",
};

/**
 * Helper to calculate ECPay CheckMacValue
 * 1. Sort params alphabetically
 * 2. Connect with &
 * 3. Add HashKey at front and HashIV at end
 * 4. URL Encode (special ECPay rules)
 * 5. To Lowercase
 * 6. SHA256
 * 7. To Uppercase
 */
function calculateCheckMacValue(params: any): string {
  const keys = Object.keys(params).sort();
  let raw = `HashKey=${ECPAY_CONFIG.HashKey}`;
  
  keys.forEach(key => {
    if (key !== 'CheckMacValue') {
      raw += `&${key}=${params[key]}`;
    }
  });
  
  raw += `&HashIV=${ECPAY_CONFIG.HashIV}`;
  
  // URL Encode - strict replacement for ECPay .NET compatibility
  const encoded = encodeURIComponent(raw)
    .replace(/%20/g, '+')
    .replace(/%2d/i, '-')
    .replace(/%5f/i, '_')
    .replace(/%2e/i, '.')
    .replace(/%21/i, '!')
    .replace(/%2a/i, '*')
    .replace(/%28/i, '(')
    .replace(/%29/i, ')');

  const lowered = encoded.toLowerCase();
  
  return crypto.createHash('sha256').update(lowered).digest('hex').toUpperCase();
}

/**
 * Creates a payment request for an order.
 * This function integrates with the payment gateway (ECPay placeholder).
 */
export const createPaymentRequest = functions.https.onCall({ cors: true }, async (req: functions.https.CallableRequest<any>) => {
  const data = req.data;
  const context = req;

  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, stage } = data; // stage: '1' or '2'

  if (!orderId || !stage) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing orderId or stage');
  }

  const orderRef = admin.firestore().collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Order not found');
  }

  const order = orderDoc.data();
  
  // Security Check: Ensure user owns the order
  if (order?.userId !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized to pay for this order');
  }

  // 2. Calculate Amount
  let amount = 0;
  let itemName = '';
  
  if (stage === '1') {
    if (order?.stage1_paid) {
      throw new functions.https.HttpsError('failed-precondition', 'Stage 1 already paid');
    }
    amount = order?.total_stage1;
    itemName = `PingPing Shop - Order ${orderId.slice(0, 8)} (Stage 1)`;
  } else if (stage === '2') {
    if (order?.stage2_paid) {
      throw new functions.https.HttpsError('failed-precondition', 'Stage 2 already paid');
    }
    if (!order?.total_stage2 || order.total_stage2 <= 0) {
      throw new functions.https.HttpsError('failed-precondition', 'Stage 2 shipping fee not yet calculated');
    }
    amount = order?.total_stage2;
    itemName = `PingPing Shop - Order ${orderId.slice(0, 8)} (Stage 2 Shipping)`;
  } else {
     throw new functions.https.HttpsError('invalid-argument', 'Invalid stage');
  }

  // 3. Generate Payment Parameters
  const merchantTradeNo = `${orderId}S${stage}T${Date.now()}`.substring(0, 20); // Limit to 20 chars
  const merchantTradeDate = new Date().toLocaleString('zh-TW', { 
    hour12: false, 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'
  }).replace(/\//g, '/');
  
  const paymentParams: any = {
    MerchantID: ECPAY_CONFIG.MerchantID,
    MerchantTradeNo: merchantTradeNo,
    MerchantTradeDate: merchantTradeDate,
    PaymentType: "aio",
    TotalAmount: amount,
    TradeDesc: "Proxy Buying Service",
    ItemName: itemName,
    ReturnURL: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/paymentCallback`,
    OrderResultURL: `https://pingping-goods.com/orders/${orderId}`, // Client-side redirect after payment
    ChoosePayment: "ALL",
    EncryptType: "1",
    CustomField1: orderId,
    CustomField2: stage, 
  };

  // 4. Calculate CheckMacValue
  paymentParams.CheckMacValue = calculateCheckMacValue(paymentParams);

  // 5. Return the params to client to submit the form
  return {
    success: true,
    paymentUrl: ECPAY_CONFIG.PaymentUrl,
    params: paymentParams
  };
});

/**
 * Payment Callback (Webhook)
 * Handles the server-to-server notification from the payment gateway.
 */
export const paymentCallback = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const data = req.body;
  console.log('Payment Callback Data:', JSON.stringify(data));
  
  // 1. Verify CheckMacValue
  const receivedCheckMacValue = data.CheckMacValue;
  const calculatedCheckMacValue = calculateCheckMacValue(data);

  if (receivedCheckMacValue !== calculatedCheckMacValue) {
    console.error('CheckMacValue mismatch!', { received: receivedCheckMacValue, calculated: calculatedCheckMacValue });
    // In production, you might want to reject this. 
    // For now, if local testing is messy, we might log it but proceed if we trust the source.
    // But strictly:
    res.status(400).send('0|CheckMacValue Error');
    return;
  }
  
  const rtnCode = data.RtnCode; // '1' means success
  const orderId = data.CustomField1;
  const stage = data.CustomField2;

  if (rtnCode === '1' && orderId && stage) {
    try {
      const orderRef = admin.firestore().collection('orders').doc(orderId);
      
      const updateData: any = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (stage === '1') {
        updateData.stage1_paid = true;
        updateData.paidAt_stage1 = admin.firestore.FieldValue.serverTimestamp();
        updateData.status = 'PAID_PAYMENT_1'; 
      } else if (stage === '2') {
        updateData.stage2_paid = true;
        updateData.paidAt_stage2 = admin.firestore.FieldValue.serverTimestamp();
        updateData.status = 'PAID_PAYMENT_2'; 
      }

      await orderRef.update(updateData);
      console.log(`Payment successful for Order ${orderId} Stage ${stage}`);
      
      res.status(200).send('1|OK'); 
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).send('0|Error');
    }
  } else {
    console.warn(`Payment failed or invalid data: ${JSON.stringify(data)}`);
    res.status(400).send('0|Fail');
  }
});

