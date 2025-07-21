import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-xl">
          GPTs Game Store
        </Link>
        <div className="space-x-4">
          <Link href="/store" className="hover:text-gray-300">ストア</Link>
          <Link href="/library" className="hover:text-gray-300">ライブラリ</Link>
          <Link href="/cart" className="hover:text-gray-300">カート</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;