'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Withdrawal() {
  const { user, loading, deleteAccount, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // 未認証ユーザーをリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/sign-in');
    }
  }, [user, loading, router]);

  const handleDeleteAccount = async () => {
    if (confirm('アカウントを削除してもよろしいですか？この操作は元に戻せません。')) {
      try {
        setIsDeleting(true);
        setError(null);
        await deleteAccount();
        await signOut();
        router.push('/');
      } catch (error) {
        console.error('Account deletion error:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('アカウント削除中にエラーが発生しました');
        }
        setIsDeleting(false);
      }
    }
  };

  // ローディング中またはユーザーがいない場合は何も表示しない
  if (loading || !user) {
    return (
      <div className="flex justify-center py-12">
        <p>ローディング中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">アカウント削除</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <p className="text-gray-700 mb-4">
          アカウントを削除すると、すべてのデータが完全に削除され、この操作は元に戻せません。
        </p>
        <p className="text-gray-700 font-medium">
          本当にアカウントを削除しますか？
        </p>
      </div>
      
      <div className="space-y-4">
        <Button
          variant="danger"
          fullWidth
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? 'アカウント削除中...' : 'アカウントを完全に削除する'}
        </Button>
        
        <Link href="/account/profile">
          <Button variant="secondary" fullWidth>
            キャンセル
          </Button>
        </Link>
      </div>
    </div>
  );
}