'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    onLogout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📝</span>
          <h1 className="text-xl font-semibold text-gray-800">Todo App</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;