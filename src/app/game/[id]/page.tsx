// 'use client' を追加して、クライアントサイドでパラメータを取得できるようにします。
'use client'; 

import { useParams } from 'next/navigation';

const GameDetailPage = () => {
  const params = useParams();
  const { id } = params; // URLからゲームIDを取得

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">ゲーム詳細ページ</h1>
      <p className="mt-4">表示しているゲームのID: {id}</p>
    </div>
  );
};
export default GameDetailPage;