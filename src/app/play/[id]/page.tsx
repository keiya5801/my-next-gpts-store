'use client'; 

import { useParams } from 'next/navigation';

const GamePlayPage = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">ゲームプレイ画面</h1>
      <p className="mt-4">ゲームID: {id} のプレイ画面です。</p>
    </div>
  );
};
export default GamePlayPage;