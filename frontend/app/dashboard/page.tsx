'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import { getUser, signOut, isAuthenticated } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user data
    const userData = getUser();
    if (userData) {
      setUser(userData);
    } else {
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user?.name || 'User'} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <TaskList userId={user?.id || ''} />
      </main>
    </div>
  );
}