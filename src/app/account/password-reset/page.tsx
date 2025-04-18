"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth/context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const passwordResetSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export default function PasswordReset() {
  const { sendPasswordResetEmail } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
  });

  const onSubmit = async (data: PasswordResetFormValues) => {
    try {
      setError(null);
      setSuccess(false);
      setLoading(true);
      await sendPasswordResetEmail(data.email);
      setSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("パスワードリセットメールの送信中にエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        パスワードリセット
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
          パスワードリセットのメールを送信しました。メールの指示に従ってパスワードをリセットしてください。
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="メールアドレス"
          type="email"
          fullWidth
          placeholder="example@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "送信中..." : "パスワードリセットメールを送信"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          <Link
            href="/account/sign-in"
            className="text-blue-600 hover:underline"
          >
            ログインページに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
