"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth/context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setError(null);
      setLoading(true);
      await signIn(data.email, data.password);
      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "ログイン中にエラーが発生しました。メールアドレスとパスワードをご確認ください。"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
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

        <Input
          label="パスワード"
          type="password"
          fullWidth
          placeholder="パスワード"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="text-right">
          <Link
            href="/account/password-reset"
            className="text-sm text-blue-600 hover:underline"
          >
            パスワードをお忘れですか？
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          アカウントをお持ちでない方は{" "}
          <Link
            href="/account/sign-up"
            className="text-blue-600 hover:underline"
          >
            こちらから新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
