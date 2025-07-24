'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext'; // useCartフックをインポート

const Header = () => {
  const { cartCount } = useCart(); // カートのアイテム数を取得

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="space-x-4 flex items-center">
          {/* ロゴのリンク先を/storeに変更 */}
          <Link href="/store" className="font-bold text-xl">
            GPTs Game Store
          </Link>
          <Link href="/store" className="hover:text-gray-300">ストア</Link>
          <Link href="/library" className="hover:text-gray-300">ライブラリ</Link>
        </div>
        <div className="space-x-4 flex items-center">
          <Link href="/creator/dashboard" className="hover:text-gray-300">クリエイター向け</Link>
          <Link href="/cart" className="relative hover:text-gray-300">
            カート
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;