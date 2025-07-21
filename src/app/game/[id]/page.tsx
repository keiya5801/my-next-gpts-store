'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Game = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

const GameDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'ゲーム情報の取得に失敗しました');
        }
        const data: Game = await response.json();
        setGame(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading) return <p className="text-center mt-8">読み込み中...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">エラー: {error}</p>;
  if (!game) return <p className="text-center mt-8">ゲームが見つかりません。</p>;

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Image */}
        <div className="lg:col-span-2">
          <img src={game.image_url || 'https://placehold.jp/3d405b/ffffff/1200x800.png?text=Game+Image'} alt={game.name} className="w-full rounded-lg shadow-lg" />
        </div>
        
        {/* Right Column: Details & Actions */}
        <div className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-4xl font-extrabold text-white mb-4">{game.name}</h1>
          <p className="text-3xl font-bold text-cyan-400 mb-6">{game.price.toLocaleString()} 円</p>
          <div className="space-y-4 mb-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg">今すぐ購入</button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-lg">カートに追加</button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Description & Reviews */}
      <div className="mt-12 bg-gray-800 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-4">詳細説明</h2>
        <p className="text-gray-300 leading-relaxed">
          {game.description || 'このゲームにはまだ詳細な説明がありません。'}
        </p>
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-white mb-4">レビュー</h3>
          <div className="bg-gray-700 p-6 rounded-lg text-center text-gray-400">（ここにレビューが表示されます）</div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;