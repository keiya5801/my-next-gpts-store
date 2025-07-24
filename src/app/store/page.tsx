'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PromoBanner from '@/components/PromoBanner';
import type { Game } from '@/types'; // ★変更点

const StorePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) throw new Error('データの取得に失敗しました');
        const data: Game[] = await response.json();
        setGames(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <div className="text-center p-10">読み込み中...</div>;
  if (error) return <div className="text-center p-10 text-red-500">エラー: {error}</div>;

  return (
    <div className="container mx-auto p-8">
      <PromoBanner />
      <h1 className="text-4xl font-bold mb-8">注目作品</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            {/* ★変更点: media_urlsの最初の画像を表示 */}
            <img 
              src={game.media_urls?.[0] || 'https://placehold.jp/3d405b/ffffff/600x400.png?text=No+Image'} 
              alt={game.name} 
              className="w-full h-48 object-cover" 
            />
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-white mb-2">{game.name}</h2>
              <p className="text-lg font-semibold text-cyan-400 mb-4">{game.price.toLocaleString()} 円</p>
              <div className="flex-grow"></div>
              <Link 
                href={`/game/${game.id}`}
                className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
              >
                詳細を見る
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;