// この型定義が、このアプリケーションの「正義」になります。
export type Game = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  // 複数のメディアURLを文字列の配列として保持します。
  media_urls: string[] | null; 
  url: string | null; // ゲームプレイ用のURL
  created_at: string;
  developer_id: string | null;
};