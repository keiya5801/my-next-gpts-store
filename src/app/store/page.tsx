// 'use client' は、このコンポーネントがブラウザ側で動くことを示すおまじない。
// useStateやuseEffectなどを使う場合は必須です。
'use client';

import { useState, useEffect } from 'react';

// ゲームデータの「型」を定義しておくと、TypeScriptが守ってくれます。
type Game = {
  id: number;
  name: string;
  url: string;
  // 必要に応じて他のカラムも追加できます
};

const StorePage = () => {
  // ゲームのリストを保存するstate。型を指定します。
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ゲームデータを取得する非同期関数を定義
    const fetchGames = async () => {
      try {
        // 私たちが作ったAPIエンドポイントにリクエストを送る！
        const response = await fetch('/api/games');
        
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        
        const data: Game[] = await response.json();
        setGames(data);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []); // []が空なので、この処理はページが最初に読み込まれた時に1回だけ実行されます

  if (loading) return <p className="text-center mt-8">読み込み中...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">エラー: {error}</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">ゲームストア</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
            {/* ここに将来的にゲームの画像などを表示 */}
            <div className="h-40 bg-gray-700 rounded mb-4"></div>
            <a 
              href={game.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              プレイする
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;