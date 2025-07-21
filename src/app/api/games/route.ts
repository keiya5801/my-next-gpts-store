import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ★重要★
// API Routeのようなサーバーサイドのコードでのみ、秘密キーを使います。
// これにより、クライアントサイド（ブラウザ）に秘密キーが漏れるのを防ぎます。
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// 'GET'リクエストが来た時の処理
export async function GET(request: Request) {
  try {
    // Supabaseの'games'テーブルから全てのデータを取得
    const { data, error } = await supabase.from('games').select('*');

    // もしSupabaseからエラーが返ってきたら、500エラーを返す
    if (error) {
      throw error;
    }

    // 成功したら、取得したデータをJSON形式で返す
    return NextResponse.json(data);

  } catch (error) {
    // 何か予期せぬエラーが起きた場合
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POSTリクエスト（新規追加！）
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 簡単なバリデーション
    if (!body.name || typeof body.price !== 'number') {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('games')
      .insert([
        { 
          name: body.name, 
          description: body.description,
          price: body.price,
          image_url: body.image_url,
          url: body.url // ゲームプレイ用のURL
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}