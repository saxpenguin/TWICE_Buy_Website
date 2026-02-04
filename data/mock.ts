import { Product } from '@/types'; // 假設您的 Type 放在 src/types

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'TWICE 4TH WORLD TOUR [III] ENCORE - CANDYBONG Z 手燈',
    description: '官方應援手燈，內含隨機小卡一款。',
    images: [
      'https://placehold.co/500x500?text=CandyBongZ', // 暫時用假圖
      'https://placehold.co/500x500?text=Detail1'
    ],
    price_stage1: 1580,
    price_stage2_est: 200, // 預估運費
    stock: 50,
    status: 'INSTOCK',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'p2',
    name: 'NAYEON The 2nd Mini Album [NA]',
    description: '娜璉第二張迷你專輯，包含寫真書、CD、明信片。',
    images: [
      'https://placehold.co/500x500?text=NAYEON_Album'
    ],
    price_stage1: 650,
    stock: 100,
    status: 'PREORDER', // 預購中
    releaseDate: '2026-06-14',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];