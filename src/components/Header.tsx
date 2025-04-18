'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Button } from './ui/Button';

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Next Firebase Auth
            </Link>
          </div>
          <nav className="space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/account/profile" className="text-gray-700 hover:text-blue-600">
                  プロフィール
                </Link>
                <Button onClick={() => signOut()} variant="secondary">
                  ログアウト
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/account/sign-in" className="text-gray-700 hover:text-blue-600">
                  ログイン
                </Link>
                <Link href="/account/sign-up">
                  <Button>新規登録</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};