import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">常見問題 (FAQ)</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 什麼是二階段付款？</h3>
          <p className="text-gray-700">
            A: 為了公平計算運費，我們不預收高額運費。
            <br />
            <strong>第一階段</strong>您只需支付商品價格，我們就會幫您訂購。
            <br />
            <strong>第二階段</strong>等商品實際抵達台灣倉庫，秤重後再跟您收實際的國際運費和國內運費。
            <Link href="/terms" className="text-pink-500 hover:underline ml-1">詳情請見服務條款</Link>。
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 下單後多久會收到商品？</h3>
          <p className="text-gray-700">
            A: 
            <ul className="list-disc pl-5 mt-1">
              <li><strong>現貨商品：</strong> 下單後約 3-5 個工作天出貨。</li>
              <li><strong>預購商品：</strong> 視官方發售日而定。官方發貨後，約需 7-14 個工作天抵達台灣並完成清關配送。</li>
            </ul>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 運費大約是多少？</h3>
          <p className="text-gray-700">
            A: 國際運費通常以重量計價 (例如 $250/kg)，未滿 1kg 按比例計算或有基本費。
            實際費率會隨物流公司報價調整，我們會盡量爭取最優惠的價格。
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 可以合併訂單省運費嗎？</h3>
          <p className="text-gray-700">
            A: 若多張訂單的商品在相近時間抵達台灣倉庫，我們可以協助合併寄送以節省國內運費。請在收到二補通知時聯繫客服。
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 沒收到二補通知怎麼辦？</h3>
          <p className="text-gray-700">
            A: 二補通知會寄送到您的註冊信箱，也可能跑到垃圾郵件夾，請務必檢查。您也可以隨時登入網站，在「我的訂單」中查看訂單狀態。若狀態顯示為「等待二補 (Pending Payment 2)」，即可直接線上付款。
          </p>
        </div>
      </div>
    </div>
  );
}
