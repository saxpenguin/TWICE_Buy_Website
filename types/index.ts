// types/index.ts

// 訂單狀態 (簡化為一次性付款流程)
export type OrderStatus = 
  | 'PENDING_PAYMENT'   // 剛下單，未付款
  | 'PAID'              // 已付款 (包含商品與預設運費)
  | 'SHIPPED'           // 已寄出
  | 'COMPLETED'         // 訂單完成
  | 'CANCELLED';        // 已取消

// 商品資訊
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];       // 圖片 URL 陣列
  price: number;          // 商品價格
  stock: number;
  status: 'PREORDER' | 'INSTOCK' | 'CLOSED';
  releaseDate?: string;   // 預計發售日
  createdAt: number;      // Timestamp
  updatedAt: number;      // Timestamp
}

// 購物車項目 / 訂單內項目
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Shipping Information Interface
export interface ShippingInfo {
  receiverName: string;
  phone: string;
  address: string;      // 或超商門市資訊
  deliveryMethod: 'HOME' | 'CVS';
}

// 訂單
export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  
  // 金額計算
  totalAmount: number;    // 訂單總額
  
  status: OrderStatus;

  isPaid: boolean;        // 是否已付款
  paidAt?: number;        // 付款時間
  
  // 付款詳情 (由後端 webhook 更新)
  paymentInfo?: {
    transactionId?: string; // 綠界交易編號
    paymentMethod?: string; // Credit, ATM, CVS...
  };

  // 收件資訊 (結帳時填寫)
  shippingInfo: ShippingInfo;

  trackingNumber?: string;
  notes?: string;
  
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'USER' | 'ADMIN'; // 區分管理員
  points: number;         // 會員點數 (可折抵運費)
  savedShippingInfo?: ShippingInfo; // 預設收件資訊
  createdAt: number;
}
