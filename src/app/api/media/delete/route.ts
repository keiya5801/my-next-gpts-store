import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  try {
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json({ error: 'ファイルURLが必要です' }, { status: 400 });
    }

    // SupabaseのURLからファイルパスを抽出する
    // 例: .../storage/v1/object/public/game-media/167..._image.png
    // -> 抽出後: 167..._image.png
    const urlObject = new URL(fileUrl);
    const filePath = urlObject.pathname.split('/game-media/')[1];

    if (!filePath) {
      return NextResponse.json({ error: '無効なファイルURLです' }, { status: 400 });
    }

    // Supabase Storageからファイルを削除
    const { error } = await supabase.storage
      .from('game-media')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'ファイルが正常に削除されました' });

  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: error.message || 'ファイルの削除に失敗しました' }, { status: 500 });
  }
}