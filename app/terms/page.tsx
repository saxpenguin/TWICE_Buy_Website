import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">服務條款 (Terms of Service)</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">1. 代購服務性質</h2>
          <p>
            PingPing小舖 (以下簡稱本站) 提供代購服務，協助會員購買韓國/日本等地之商品。
            本站僅為中間代理人，非商品製造商或經銷商。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">2. 付款機制 (二階段付款)</h2>
          <p className="mb-2">為確保運費計算精確，本站採用「二階段付款」機制：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>第一階段 (商品費用)：</strong> 下單時支付商品本體價格。本站確認收款後將立即向國外廠商下訂。</li>
            <li><strong>第二階段 (運費與雜費)：</strong> 當商品抵達本站台灣集貨倉後，將依據實際重量/材積計算國際運費與國內運費。會員需於通知後期限內完成補款，本站始進行出貨。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">3. 取消與退款</h2>
          <p>
            代購商品屬客製化給付，<strong>一旦完成第一階段付款並已由本站向國外下單後，恕不接受無故取消訂單。</strong>
            若因官方缺貨或其他不可抗力因素導致無法採購，本站將全額退款。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">4. 運輸風險</h2>
          <p>
            國際運輸過程中，商品外盒難免有擠壓碰撞風險。若非商品本體嚴重損壞，外盒輕微損傷不在賠償範圍內。
            完美主義者請自行評估後再下單。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">5. 關稅說明</h2>
          <p>
            若包裹產生進口關稅，將由本站先行代墊，並於第二階段付款時一併向會員收取，或附上稅單證明。
          </p>
        </section>
      </div>
    </div>
  );
}
