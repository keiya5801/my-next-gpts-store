'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import type { Game } from '@/types';

// ★ヘルパー関数: URLが動画ファイルかどうかを判定
const isVideo = (url: string) => {
  const videoExtensions = ['.mp4', '.webm', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};


const GameDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  // ★変更点: 現在選択されているメディアのURLを管理するstate
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

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

        // ★変更点: データの取得後、最初のメディアをデフォルトで選択状態にする
        if (data.media_urls && data.media_urls.length > 0) {
          setSelectedMediaUrl(data.media_urls[0]);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  const handleAddToCart = () => {
    if (game) {
      addToCart(game);
      alert(`${game.name}をカートに追加しました！`);
    }
  };

  if (loading) return <div className="text-center p-10">読み込み中...</div>;
  if (error) return <div className="text-center p-10 text-red-500">エラー: {error}</div>;
  if (!game) return <div className="text-center p-10">ゲームが見つかりません。</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* ★変更点: メインメディア表示エリア */}
          <div className="w-full aspect-video bg-black rounded-lg shadow-lg mb-4">
            {selectedMediaUrl ? (
              isVideo(selectedMediaUrl) ? (
                <video key={selectedMediaUrl} src={selectedMediaUrl} controls autoPlay muted loop className="w-full h-full object-contain rounded-lg">
                  お使いのブラウザはビデオタグをサポートしていません。
                </video>
              ) : (
                <img src={selectedMediaUrl} alt={game.name} className="w-full h-full object-contain rounded-lg" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">メディアがありません</div>
            )}
          </div>

          {/* ★変更点: ギャラリーエリア */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {game.media_urls?.map((url, index) => (
              <div 
                key={index}
                onClick={() => setSelectedMediaUrl(url)}
                className={`cursor-pointer rounded-lg overflow-hidden border-4 ${selectedMediaUrl === url ? 'border-blue-500' : 'border-transparent'} hover:border-blue-400`}
              >
                <img 
                  src={isVideo(url) ? (game.media_urls?.[0] || '') : url} // 動画の場合、代表画像をサムネイルにするなどの工夫も可能
                  alt={`${game.name} media ${index + 1}`}
                  className="w-full h-24 object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg h-fit">
          <h1 className="text-4xl font-extrabold text-white mb-4">{game.name}</h1>
          <p className="text-3xl font-bold text-cyan-400 mb-6">{game.price.toLocaleString()} 円</p>
          <div className="space-y-4 mb-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg">今すぐ購入</button>
            <button onClick={handleAddToCart} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-lg">カートに追加</button>
          </div>
        </div>
      </div>

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