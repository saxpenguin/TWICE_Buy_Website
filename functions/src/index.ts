import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Example Cloud Function to update order status
 * This demonstrates how to work with the two-stage payment system
 */
export const updateOrderStatus = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, status } = data;

  if (!orderId || !status) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  const orderRef = admin.firestore().collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Order not found');
  }

  // Update the order status
  await orderRef.update({
    status,
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'Order status updated' };
});

/**
 * Example Cloud Function to calculate Stage 2 shipping cost
 * This would be triggered when item arrives at warehouse
 */
export const calculateShippingCost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, weight } = data;

  // Example shipping calculation logic
  // In production, this would integrate with actual shipping APIs
  // and consider destination for international rates
  const baseRate = 10; // Base shipping cost
  const weightRate = 2; // Per kg rate
  const shippingCost = baseRate + (weight * weightRate);

  const orderRef = admin.firestore().collection('orders').doc(orderId);
  
  await orderRef.update({
    price_stage2: shippingCost,
    status: 'Pending_Stage2',
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { 
    success: true, 
    shippingCost,
    message: 'Shipping cost calculated and order updated' 
  };
});
