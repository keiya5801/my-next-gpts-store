'use client';
// ダミーデータ。将来的には状態管理ライブラリなどから取得します。
const dummyCartItems = [
  { id: 1, name: '最高の冒険ゲーム', price: 500, image_url: 'https://placehold.jp/3d405b/ffffff/150x100.png?text=Game' },
  { id: 2, name: '超絶パズルゲーム', price: 300, image_url: 'https://placehold.jp/3d405b/ffffff/150x100.png?text=Game' },
];
const subtotal = dummyCartItems.reduce((sum, item) => sum + item.price, 0);
const tax = subtotal * 0.1;
const total = subtotal + tax;

const CartPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">ショッピングカート</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">カート内商品</h2>
          <div className="space-y-4">
            {dummyCartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-md">
                <div className="flex items-center gap-4">
                  <img src={item.image_url} alt={item.name} className="w-24 h-16 rounded-md object-cover" />
                  <div>
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-gray-400">{item.price.toLocaleString()} 円</p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-400 font-semibold">削除</button>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Order Summary */}
        <div className="bg-gray-800 p-6 rounded-lg h-fit">
          <h2 className="text-2xl font-bold text-white mb-6">注文概要</h2>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>小計</span>
              <span>{subtotal.toLocaleString()} 円</span>
            </div>
            <div className="flex justify-between">
              <span>消費税</span>
              <span>{tax.toLocaleString()} 円</span>
            </div>
            <hr className="border-gray-600 my-2" />
            <div className="flex justify-between text-white font-bold text-xl">
              <span>合計金額</span>
              <span>{total.toLocaleString()} 円</span>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-gray-700 p-4 rounded-lg mb-4 text-center text-gray-400">(ここにカード情報入力フォーム)</div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-4 rounded-lg text-lg">決済を確定する</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;