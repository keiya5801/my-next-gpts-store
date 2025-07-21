import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// GETリクエスト（新規追加！）
// 特定のIDのゲームを取得する
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*') // 全てのカラムを選択
      .eq('id', params.id) // idが一致するものを検索
      .single(); // 結果が1行であることを期待する

    if (error) {
      if (error.code === 'PGRST116') { // 見つからなかった場合のエラーコード
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

// DELETEリクエスト（既存）
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('games')
      .delete()
      .match({ id: params.id });

    if (error) throw error;

    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}