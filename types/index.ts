/**
 * Order status types for the two-stage payment system
 */
export type OrderStatus = 
  | 'Pre-order'        // Initial order placed, awaiting stage 1 payment
  | 'Pending_Stage2'   // Stage 1 paid, awaiting stage 2 payment (shipping)
  | 'Paid'             // Both stages paid
  | 'Shipped'          // Order has been shipped
  | 'Delivered'        // Order delivered
  | 'Cancelled';       // Order cancelled

/**
 * Product type with two-stage pricing
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  
  // Two-stage payment fields
  price_stage1: number;      // Initial product price
  price_stage2?: number;     // Shipping/handling fee (calculated after item arrives)
  
  category?: string;
  stock_available: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Order type with two-stage payment tracking
 */
export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  
  // Two-stage payment fields
  price_stage1: number;      // Product price paid upfront
  price_stage2?: number;     // Shipping fee (determined later)
  
  // Payment tracking
  stage1_paid: boolean;
  stage1_paid_at?: Date;
  stage2_paid: boolean;
  stage2_paid_at?: Date;
  
  status: OrderStatus;
  
  // Shipping information
  shipping_address?: string;
  tracking_number?: string;
  
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
