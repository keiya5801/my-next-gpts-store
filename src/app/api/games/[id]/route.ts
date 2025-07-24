import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ★変更点: URLからIDを抽出するヘルパー関数
const getIdFromUrl = (url: string) => {
  // URLを'/'で分割し、最後の部分を取得する
  const segments = url.split('/');
  return segments[segments.length - 1];
};

// GETリクエスト: 特定のIDのゲームを取得する
export async function GET(
  request: Request,
  // { params } はもう使いません
) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
  try {
    // ★変更点: request.urlからIDを取得
    const id = getIdFromUrl(request.url);

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id) // 抽出したIDを使用
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      throw error;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching game:', error.message);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

// PATCHリクエスト: 特定のIDのゲーム情報を更新する
export async function PATCH(
  request: Request,
) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
  try {
    // ★変更点: request.urlからIDを取得
    const id = getIdFromUrl(request.url);
    const body = await request.json();

    const { data, error } = await supabase
      .from('games')
      .update(body)
      .eq('id', id) // 抽出したIDを使用
      .select()
      .single();
      
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating game:', error.message);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}


// DELETEリクエスト: 特定のIDのゲームを削除する
export async function DELETE(
  request: Request,
) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
  try {
    // ★変更点: request.urlからIDを取得
    const id = getIdFromUrl(request.url);

    const { error } = await supabase
      .from('games')
      .delete()
      .match({ id: id }); // 抽出したIDを使用

    if (error) throw error;
    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting game:', error.message);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}