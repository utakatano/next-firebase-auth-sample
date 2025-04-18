"use client";

import { useAuth } from "@/lib/auth/context";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold mb-6">
        Next.js + Firebase Authentication サンプル
      </h1>
      <p className="text-xl mb-8 text-gray-600">
        Next.jsのApp Routerを使用したFirebase認証の実装例です。
      </p>

      {loading ? (
        <p className="text-gray-500">ローディング中...</p>
      ) : user ? (
        <div className="space-y-6">
          <p className="text-green-600 font-medium">
            ログイン済み: {user.email}
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/account/profile">
              <Button>プロフィールを見る</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-700">
            アカウントを作成するか、既存のアカウントでログインしてください。
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/account/sign-up">
              <Button>新規登録</Button>
            </Link>
            <Link href="/account/sign-in">
              <Button variant="secondary">ログイン</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
