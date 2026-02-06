import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus, CartItem, ShippingInfo } from '@/types';

/**
 * Create a new order (Stage 1)
 */
export async function createOrder(
  userId: string, 
  userEmail: string,
  items: CartItem[], 
  totalAmount: number,
  shippingInfo: ShippingInfo
): Promise<string> {
  
  if (!userId || items.length === 0) {
    throw new Error('Invalid order data');
  }

  // Initial Order Data
  const orderData: Omit<Order, 'id'> = {
    userId,
    userEmail,
    items,
    totalAmount,
    status: 'PENDING_PAYMENT',
    shippingInfo,
    createdAt: Date.now(), // Using timestamp number for client compatibility
    updatedAt: Date.now(),
    isPaid: false
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    
    // We also want to store the ID inside the document for easier reference if needed, 
    // or just rely on the doc ID. It's often good practice to have it in the data too.
    await updateDoc(doc(db, 'orders', docRef.id), {
      id: docRef.id
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}
