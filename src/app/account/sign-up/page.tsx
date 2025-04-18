'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth/context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
  confirmPassword: z.string().min(6, 'パスワードは6文字以上である必要があります'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setError(null);
      setLoading(true);
      await signUp(data.email, data.password);
      router.push('/');
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('アカウント登録中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">アカウント登録</h1>
      
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
          {...register('email')}
        />
        
        <Input
          label="パスワード"
          type="password"
          fullWidth
          placeholder="6文字以上のパスワード"
          error={errors.password?.message}
          {...register('password')}
        />
        
        <Input
          label="パスワード（確認）"
          type="password"
          fullWidth
          placeholder="同じパスワードを入力"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        
        <Button
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? 'アカウント作成中...' : 'アカウント作成'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          既にアカウントをお持ちの方は{' '}
          <Link href="/account/sign-in" className="text-blue-600 hover:underline">
            こちらからログイン
          </Link>
        </p>
      </div>
    </div>
  );
}