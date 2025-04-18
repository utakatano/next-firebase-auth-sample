'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 未認証ユーザーをリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/sign-in');
    }
  }, [user, loading, router]);

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
      <h1 className="text-2xl font-bold mb-6 text-center">プロフィール</h1>
      
      <div className="space-y-4">
        <div className="border-b pb-3">
          <p className="text-gray-500 text-sm">メールアドレス</p>
          <p className="font-medium">{user.email}</p>
        </div>
        
        <div className="border-b pb-3">
          <p className="text-gray-500 text-sm">アカウント作成日</p>
          <p className="font-medium">
            {user.metadata.creationTime 
              ? new Date(user.metadata.creationTime).toLocaleDateString('ja-JP') 
              : '不明'}
          </p>
        </div>
        
        <div className="border-b pb-3">
          <p className="text-gray-500 text-sm">最終ログイン</p>
          <p className="font-medium">
            {user.metadata.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toLocaleDateString('ja-JP')
              : '不明'}
          </p>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <Link href="/account/withdrawal">
          <Button variant="danger" fullWidth>
            アカウントを削除する
          </Button>
        </Link>
      </div>
    </div>
  );
}