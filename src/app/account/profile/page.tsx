"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserProfile, UserProfile } from "@/lib/profile/profile-service";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 未認証ユーザーをリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/sign-in");
    }
  }, [user, loading, router]);

  // プロフィール情報の取得
  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          // ユーザー情報を渡してプロフィールを取得（存在しない場合は作成される）
          const userProfile = await getUserProfile(
            user.uid,
            user.email || "",
            user.displayName || "",
            user.photoURL || ""
          );
          setProfile(userProfile);
        } catch (err) {
          console.error("プロフィール取得エラー:", err);
          setError("プロフィール情報の取得に失敗しました。");
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

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

      {isLoading ? (
        <div className="text-center py-4">プロフィール情報を読み込み中...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <p className="text-gray-500 text-sm">メールアドレス</p>
            <p className="font-medium">{user.email}</p>
          </div>

          {profile && (
            <>
              {profile.displayName && (
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">表示名</p>
                  <p className="font-medium">{profile.displayName}</p>
                </div>
              )}

              {profile.occupation && (
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">職業</p>
                  <p className="font-medium">{profile.occupation}</p>
                </div>
              )}

              {profile.bio && (
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">自己紹介</p>
                  <p className="font-medium">{profile.bio}</p>
                </div>
              )}

              {profile.location && (
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">住所/所在地</p>
                  <p className="font-medium">{profile.location}</p>
                </div>
              )}

              {profile.website && (
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">ウェブサイト</p>
                  <p className="font-medium">
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </p>
                </div>
              )}
            </>
          )}

          <div className="border-b pb-3">
            <p className="text-gray-500 text-sm">アカウント作成日</p>
            <p className="font-medium">
              {user.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString(
                    "ja-JP"
                  )
                : "不明"}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-500 text-sm">最終ログイン</p>
            <p className="font-medium">
              {user.metadata.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                    "ja-JP"
                  )
                : "不明"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <Link href="/account/profile/edit">
          <Button fullWidth>プロフィールを編集する</Button>
        </Link>

        <Link href="/account/withdrawal">
          <Button variant="danger" fullWidth>
            アカウントを削除する
          </Button>
        </Link>
      </div>
    </div>
  );
}
