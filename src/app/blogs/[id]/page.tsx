"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { getBlogById, BlogWithPreview } from "@/lib/blogs/blog-service";
import Link from "next/link";

export default function BlogDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState<BlogWithPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async (rawId: string | string[]) => {
      try {
        const id = typeof rawId === "string" ? rawId : rawId[0];
        const blogData = await getBlogById(id);
        setBlog(blogData);
      } catch (err) {
        setError("ブログの読み込み中にエラーが発生しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog(params.id);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-red-500">エラー</h1>
        <p>{error || "ブログが見つかりませんでした"}</p>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          トップページに戻る
        </Link>
      </div>
    );
  }

  // 記事の表示内容を決定
  // 1. 会員限定記事でない場合は常に全文表示
  // 2. 会員限定記事の場合、ログインしていれば全文、していなければプレビュー
  const canViewFullContent = !blog.memberOnly || (blog.memberOnly && user);
  const displayContent = canViewFullContent
    ? blog.content
    : blog.previewContent;

  return (
    <div className="container mx-auto py-8 px-4">
      <article className="prose lg:prose-xl max-w-none">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

        {blog.memberOnly && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              会員限定
            </span>
          </div>
        )}

        <p className="text-gray-500 mb-6">
          公開日: {new Date(blog.publishedAt).toLocaleDateString()}
        </p>

        <div className="space-y-4">
          {displayContent.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {!canViewFullContent && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-lg font-medium">この記事の続きは会員限定です</p>
            <div className="mt-4 space-x-4">
              <Link
                href="/account/sign-in"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                ログイン
              </Link>
              <Link
                href="/account/sign-up"
                className="px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
              >
                新規登録
              </Link>
            </div>
          </div>
        )}
      </article>

      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
