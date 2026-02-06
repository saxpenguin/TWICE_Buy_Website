import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Email Configuration
// IMPORTANT: Set these environment variables in Firebase:
// firebase functions:secrets:set EMAIL_USER="your-email@gmail.com"
// firebase functions:secrets:set EMAIL_PASS="your-app-password"
const emailUser = process.env.EMAIL_USER || "test@example.com"; 
const emailPass = process.env.EMAIL_PASS || "password";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

async function sendOrderEmail(to: string, subject: string, html: string) {
  if (!to) return;
  
  // Skip sending if we are using the default test values
  if (emailUser === "test@example.com") {
    console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
    return;
  }
  
  const mailOptions = {
    from: `"PingPing Shop" <${emailUser}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// ECPay Configuration
// Uses environment variables if available, otherwise falls back to Test environment
const ECPAY_CONFIG = {
  MerchantID: process.env.ECPAY_MERCHANT_ID || "2000132",
  HashKey: process.env.ECPAY_HASH_KEY || "5294y06JbISpM5x9",
  HashIV: process.env.ECPAY_HASH_IV || "v77hoKGq4kWxNNIS",
  // Automatically switch to Production URL if not using the default Test MerchantID (2000132)
  PaymentUrl: (process.env.ECPAY_MERCHANT_ID && process.env.ECPAY_MERCHANT_ID !== "2000132")
    ? "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
    : "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5",
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
export const createPaymentRequest = functions.https.onCall(async (data, context) => {

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
  // Ensure MerchantTradeNo is unique and under 20 chars.
  // We use the first 6 chars of OrderID, the stage, and the timestamp.
  // This prevents truncation of the timestamp which caused duplicate order errors.
  const merchantTradeNo = `${orderId.substring(0, 6)}${stage}${Date.now()}`;
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
 * Trigger: When an order is created, send a confirmation email.
 */
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const order = snapshot.data();
    const orderId = context.params.orderId;
    const email = order.userEmail;


    if (!email) {
      console.log('No email found for order', orderId);
      return;
    }

    const subject = `Order Confirmation: ${orderId}`;
    const body = `
      <h1>Order Received!</h1>
      <p>Thank you for your order with PingPing Shop.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Status:</strong> Pending Stage 1 Payment</p>
      <p>Please log in to your account to complete the Stage 1 payment so we can secure your items.</p>
      <a href="https://pingping-goods.com/orders/${orderId}">View Order</a>
    `;

    return sendOrderEmail(email, subject, body);
  });

/**
 * Trigger: When order status changes to PENDING_PAYMENT_2 (Shipping Fee Calculated), notify user.
 */
export const onOrderStatusChange = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change: functions.Change<functions.firestore.QueryDocumentSnapshot>, context: functions.EventContext) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const orderId = context.params.orderId;
    const email = newData.userEmail;


    // Check if status changed to PENDING_PAYMENT_2
    if (oldData.status !== 'PENDING_PAYMENT_2' && newData.status === 'PENDING_PAYMENT_2') {
       if (!email) return;

       const subject = `Action Required: Shipping Payment for Order ${orderId}`;
       const body = `
         <h1>Items Arrived at Warehouse</h1>
         <p>Good news! Your items for Order <strong>${orderId}</strong> have arrived at our warehouse.</p>
         <p>The international and domestic shipping fees have been calculated.</p>
         <p><strong>Total Shipping (Stage 2):</strong> $${newData.total_stage2}</p>
         <p>Please log in to pay the shipping fee so we can dispatch your package.</p>
         <a href="https://pingping-goods.com/orders/${orderId}">Pay Shipping Now</a>
       `;
       
       return sendOrderEmail(email, subject, body);
    }
    
    // Check if status changed to SHIPPED
    if (oldData.status !== 'SHIPPED' && newData.status === 'SHIPPED') {
        if (!email) return;
 
        const subject = `Order Shipped: ${orderId}`;
        const body = `
          <h1>Your Order is on the Way!</h1>
          <p>Order <strong>${orderId}</strong> has been shipped.</p>
          ${newData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${newData.trackingNumber}</p>` : ''}
          <p>Thank you for shopping with PingPing Shop!</p>
        `;
        
        return sendOrderEmail(email, subject, body);
     }

    return null;
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

      // Send Email Notification
      try {

        // Actually, let's fetch the fresh order to get the user email stored on the order or the user ID
        const freshOrderDoc = await orderRef.get();
        const freshOrderData = freshOrderDoc.data();
        const email = freshOrderData?.userEmail; 

        if (email) {
           let subject = '';
           let body = '';

           if (stage === '1') {
             subject = `Payment Received: Order ${orderId} (Stage 1)`;
             body = `
               <h1>Payment Received</h1>
               <p>Thank you! We have received your payment for the product cost (Stage 1).</p>
               <p><strong>Order ID:</strong> ${orderId}</p>
               <p>We will now purchase your items. You will be notified when they arrive at our warehouse for the Stage 2 shipping payment.</p>
             `;
           } else if (stage === '2') {
             subject = `Payment Received: Order ${orderId} (Stage 2)`;
             body = `
               <h1>Shipping Payment Received</h1>
               <p>Thank you! We have received your payment for shipping (Stage 2).</p>
               <p><strong>Order ID:</strong> ${orderId}</p>
               <p>Your items will be shipped shortly!</p>
             `;
           }
           
           await sendOrderEmail(email, subject, body);
        }

      } catch (emailErr) {
        console.error('Failed to send payment confirmation email:', emailErr);
        // Do not fail the request just because email failed
      }
      
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

