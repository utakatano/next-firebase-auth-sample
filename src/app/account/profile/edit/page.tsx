"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/lib/profile/profile-service";

export default function EditProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    displayName: "",
    occupation: "",
    bio: "",
    location: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

          if (userProfile) {
            setProfile({
              displayName: userProfile.displayName || "",
              occupation: userProfile.occupation || "",
              bio: userProfile.bio || "",
              location: userProfile.location || "",
              website: userProfile.website || "",
            });
          } else {
            // バックアップ：プロフィールが取得できない場合
            setProfile({
              displayName: user.displayName || "",
              email: user.email || "",
            });
          }
        } catch (err) {
          console.error("プロフィール取得エラー:", err);
          setError("プロフィール情報の取得に失敗しました。");
          // エラー時も基本情報を設定
          setProfile({
            displayName: user.displayName || "",
            email: user.email || "",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateUserProfile(user.uid, profile);
      router.push("/account/profile");
    } catch (err) {
      console.error("プロフィール更新エラー:", err);
      setError("プロフィール情報の更新に失敗しました。");
    } finally {
      setIsSaving(false);
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
      <h1 className="text-2xl font-bold mb-6 text-center">プロフィール編集</h1>

      {isLoading ? (
        <div className="text-center py-4">プロフィール情報を読み込み中...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              表示名
            </label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              value={profile.displayName || ""}
              onChange={handleChange}
              placeholder="表示名"
            />
          </div>

          <div>
            <label
              htmlFor="occupation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              職業
            </label>
            <Input
              id="occupation"
              name="occupation"
              type="text"
              value={profile.occupation || ""}
              onChange={handleChange}
              placeholder="職業（例：エンジニア、デザイナー）"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              自己紹介
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={profile.bio || ""}
              onChange={handleChange}
              placeholder="自己紹介文"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              住所/所在地
            </label>
            <Input
              id="location"
              name="location"
              type="text"
              value={profile.location || ""}
              onChange={handleChange}
              placeholder="東京都渋谷区など"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ウェブサイト
            </label>
            <Input
              id="website"
              name="website"
              type="text"
              value={profile.website || ""}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => router.push("/account/profile")}
              disabled={isSaving}
            >
              キャンセル
            </Button>
            <Button type="submit" fullWidth disabled={isSaving}>
              {isSaving ? "保存中..." : "保存する"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
