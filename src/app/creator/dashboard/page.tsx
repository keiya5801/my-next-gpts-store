'use client';
import { useState, useEffect, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Game } from '@/types';

const CreatorDashboardPage = () => {
  const supabase = createClientComponentClient();
  const [games, setGames] = useState<Game[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileInputKeys, setFileInputKeys] = useState<number[]>([Date.now()]);

  // 登録済みのゲームリストを取得する関数
  const fetchGames = async () => {
    const response = await fetch('/api/games');
    const data = await response.json();
    setGames(data);
  };

  // ページ読み込み時にゲームリストを取得
  useEffect(() => {
    fetchGames();
  }, []);

  // ゲームを削除する関数（DBからレコードごと削除）
  const handleDelete = async (id: number) => {
    if (!confirm('本当にこのゲームを完全に削除しますか？関連するメディアも全て削除され、この操作は取り消せません。')) return;
    const response = await fetch(`/api/games/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchGames();
    } else {
      alert('削除に失敗しました');
    }
  };

  // フォームの送信（新規登録・更新）を処理する関数
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    
    // 編集中のゲームデータから既存のメディアURLを取得、なければ空配列
    const existingMediaUrls = editingGame?.media_urls || [];
    
    // 新しくアップロードするファイルを取得
    const files = formData.getAll('media') as File[];
    const newUploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size === 0) continue;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('game-media')
        .upload(fileName, file);
      
      if (uploadError) {
        alert('ファイルのアップロードに失敗しました: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('game-media').getPublicUrl(uploadData.path);
      newUploadedUrls.push(urlData.publicUrl);
    }
    
    // 既存のURLと新しくアップロードしたURLを結合
    const allMediaUrls = [...existingMediaUrls, ...newUploadedUrls];

    // ゲームデータをDBに送信するためのオブジェクトを作成
    const gameData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      url: formData.get('url') as string,
      media_urls: allMediaUrls,
    };

    const url = editingGame?.id ? `/api/games/${editingGame.id}` : '/api/games';
    const method = editingGame?.id ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });

    setUploading(false);
    if (response.ok) {
      fetchGames();
      setEditingGame(null);
    } else {
      alert('操作に失敗しました');
    }
  };

  // ファイル入力欄を追加する関数
  const addFileInput = () => {
    const totalMediaCount = (editingGame?.media_urls?.length || 0) + fileInputKeys.length;
    if (totalMediaCount < 5) {
      setFileInputKeys(keys => [...keys, Date.now()]);
    } else {
      alert('メディアは合計5つまでです。');
    }
  };

  // ファイル入力欄を削除する関数
  const removeFileInput = (keyToRemove: number) => {
    if (fileInputKeys.length > 1) {
      setFileInputKeys(keys => keys.filter(key => key !== keyToRemove));
    }
  };

  // モーダルを開く時に、編集対象のゲームをセットし、ファイル入力欄をリセットする関数
  const handleOpenModal = (game: Game | null) => {
    setEditingGame(game || {} as Game);
    setFileInputKeys([Date.now()]);
  };

  // 既存のメディアを削除する関数
  const handleRemoveMedia = async (urlToRemove: string) => {
    if (!editingGame) return;
    if (!confirm('このメディアを完全に削除しますか？この操作は取り消せません。\n\n削除を確定するには、この後「保存」ボタンを押してください。')) return;
  
    try {
      const response = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: urlToRemove }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ファイルの削除に失敗しました');
      }
  
      // フロントエンドのプレビュー状態を更新
      const updatedMediaUrls = editingGame.media_urls?.filter(url => url !== urlToRemove);
      setEditingGame({
        ...editingGame,
        media_urls: updatedMediaUrls || [],
      });
      
    } catch (error: any) {
      alert(error.message);
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

      {/* ゲーム管理 */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">ゲーム管理</h2>
        <button onClick={() => handleOpenModal(null)} className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
          新規ゲームを登録
        </button>
        <ul className="space-y-3">
          {games.map(game => (
            <li key={game.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
              <span className="text-white">{game.name}</span>
              <div>
                <button onClick={() => handleOpenModal(game)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md mr-2">編集</button>
                <button onClick={() => handleDelete(game.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md">削除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 編集・登録用モーダル */}
      {editingGame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-lg w-full max-w-2xl max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{editingGame.id ? 'ゲームを編集' : '新規ゲームを登録'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 各フォーム項目 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">ゲーム名</label>
                <input id="name" name="name" type="text" defaultValue={editingGame.name || ''} required className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">価格</label>
                <input id="price" name="price" type="number" defaultValue={editingGame.price || 0} required className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white" />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300">ゲームプレイURL</label>
                <input id="url" name="url" type="text" defaultValue={editingGame.url || ''} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">メディア (画像/動画)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingGame.media_urls?.map(url => (
                    <div key={url} className="relative h-20 w-20">
                      <img src={url} className="h-full w-full object-cover rounded" alt="アップロード済みメディア" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveMedia(url)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold leading-none border-2 border-gray-800"
                        aria-label="このメディアを削除"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">新しいメディアを追加 (合計5つまで):</p>
                <div className="space-y-2 mt-2">
                  {fileInputKeys.map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <input name="media" type="file" accept="image/*,video/*" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                      <button type="button" onClick={() => removeFileInput(key)} className="text-red-500 hover:text-red-400 p-1 rounded-full text-xl leading-none">×</button>
                    </div>
                  ))}
                </div>
                {(editingGame.media_urls?.length || 0) + fileInputKeys.length < 5 && (
                   <button type="button" onClick={addFileInput} className="mt-2 text-sm text-blue-400 hover:text-blue-300">+ ファイル選択欄を追加</button>
                )}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">説明</label>
                <textarea id="description" name="description" defaultValue={editingGame.description || ''} rows={4} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"></textarea>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setEditingGame(null)} disabled={uploading} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">キャンセル</button>
                <button type="submit" disabled={uploading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
                  {uploading ? '処理中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboardPage;