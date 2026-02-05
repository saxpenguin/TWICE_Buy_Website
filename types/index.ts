// types/index.ts

// 訂單狀態 (最複雜的部分，定義好就成功一半了)
export type OrderStatus = 
  | 'PENDING_PAYMENT_1'   // 剛下單，未付本體費
  | 'PAID_PAYMENT_1'      // 已付本體，等待官方發貨/運回中
  | 'ARRIVED_TW'          // 抵達台灣，等待二補
  | 'PENDING_PAYMENT_2'   // 通知二補中
  | 'PAID_PAYMENT_2'      // 已付運費，準備出貨
  | 'SHIPPED'             // 已寄出給客人
  | 'COMPLETED'           // 訂單完成
  | 'CANCELLED';          // 已取消

// 商品資訊
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];       // 圖片 URL 陣列
  price_stage1: number;   // 商品本體價格
  price_stage2_est?: number; // 預估二補運費 (選填，供參考)
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
  price_stage1: number;
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
  total_stage1: number;   // 商品總額
  total_stage2: number;   // 國際運費 + 國內運費 (初始為 0)
  
  status: OrderStatus;

  // Track payment status roughly
  stage1_paid: boolean;
  stage2_paid: boolean;
  
  // 新增：付款詳情 (由後端 webhook 更新)
  paymentInfo?: {
    stage1_transactionId?: string; // 綠界交易編號 (第一段)
    stage1_paidAt?: number;        // 付款時間
    stage2_transactionId?: string; // 綠界交易編號 (第二段)
    stage2_paidAt?: number;        // 付款時間
    paymentMethod?: string;        // Credit, ATM, CVS...
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