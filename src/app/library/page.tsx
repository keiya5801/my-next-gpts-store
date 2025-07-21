'use client';
// ダミーデータ。将来的にはログインユーザーが購入したゲームのリストを取得します。
const dummyLibraryGames = [
  { id: 1, name: '最高の冒険ゲーム', image_url: 'https://placehold.jp/3d405b/ffffff/600x400.png?text=Game' },
];

const LibraryPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">ライブラリ</h1>
      <p className="text-gray-400 mb-8">購入済みのゲームをここからプレイできます。</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {dummyLibraryGames.map(game => (
          <div key={game.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={game.image_url} alt={game.name} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-white mb-4">{game.name}</h2>
              <div className="flex-grow"></div>
              <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                プレイ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LibraryPage;