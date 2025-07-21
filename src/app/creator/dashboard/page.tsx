'use client';
import { useState, useEffect, FormEvent } from 'react';

type Game = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  url: string | null;
};

const CreatorDashboardPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  // フォームの入力値を管理するstate
  const [gameName, setGameName] = useState('');
  const [gamePrice, setGamePrice] = useState(0);
  const [gameDesc, setGameDesc] = useState('');
  const [gameUrl, setGameUrl] = useState('');

  const fetchGames = async () => {
    const response = await fetch('/api/games');
    const data = await response.json();
    setGames(data);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: gameName, price: gamePrice, description: gameDesc, url: gameUrl }),
    });
    if (response.ok) {
      // 成功したらゲームリストを再取得して表示を更新
      fetchGames();
      // フォームをリセット
      setGameName('');
      setGamePrice(0);
      setGameDesc('');
      setGameUrl('');
    } else {
      alert('ゲームの登録に失敗しました');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当にこのゲームを削除しますか？')) return;

    const response = await fetch(`/api/games/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchGames(); // 成功したらリストを更新
    } else {
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">クリエイターダッシュボード</h1>
      
      {/* 売上・分析レポート（ダミーUI） */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">売上レポート</h2>
          <div className="bg-gray-700 h-64 rounded-lg flex items-center justify-center text-gray-400">（ここにグラフが表示されます）</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">分析レポート</h2>
          <div className="bg-gray-700 h-64 rounded-lg flex items-center justify-center text-gray-400">（ここに分析データが表示されます）</div>
        </div>
      </div>

      {/* ゲーム登録・管理 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ゲーム登録フォーム */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">新規ゲーム登録</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="game-name" className="block text-sm font-medium text-gray-300">ゲーム名</label>
              <input type="text" id="game-name" value={gameName} onChange={(e) => setGameName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="game-price" className="block text-sm font-medium text-gray-300">価格（円）</label>
              <input type="number" id="game-price" value={gamePrice} onChange={(e) => setGamePrice(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
             <div>
              <label htmlFor="game-url" className="block text-sm font-medium text-gray-300">ゲームプレイURL</label>
              <input type="text" id="game-url" value={gameUrl} onChange={(e) => setGameUrl(e.target.value)} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="game-desc" className="block text-sm font-medium text-gray-300">説明</label>
              <textarea id="game-desc" value={gameDesc} onChange={(e) => setGameDesc(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">登録する</button>
          </form>
        </div>

        {/* 登録済みゲーム一覧 */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">登録済みゲーム一覧</h2>
          <ul className="space-y-3">
            {games.map(game => (
              <li key={game.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                <span className="text-white">{game.name}</span>
                <button onClick={() => handleDelete(game.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md">削除</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboardPage;