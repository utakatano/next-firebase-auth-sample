export interface Blog {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  memberOnly: boolean;
}

// プレビューテキストを生成する関数
// 最大2文または指定された文字数までのテキストを返す
function generatePreviewContent(
  content: string,
  maxSentences = 2,
  maxChars = 150
): string {
  // 文章を分割（。や.で区切る）
  const sentences = content.match(/[^。.]+[。.]+/g) || [];

  if (sentences.length <= maxSentences) {
    // 文章が少ない場合は文字数で制限
    return content.length <= maxChars
      ? content
      : `${content.substring(0, maxChars)}...`;
  }

  // 指定された文数までを結合
  const preview = sentences.slice(0, maxSentences).join("");

  // 最大文字数を超えていないかチェック
  return preview.length <= maxChars
    ? preview
    : `${preview.substring(0, maxChars)}...`;
}

// モックデータ - 実際の環境では外部APIなどから取得する想定
const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Firebaseとは何か",
    content:
      "Firebaseは、Googleが提供するモバイルおよびウェブアプリケーション開発プラットフォームです。認証、リアルタイムデータベース、ストレージ、ホスティング、分析など多くの機能を提供しています。特に認証機能は非常に強力で、メール/パスワード認証のほか、Google、Facebook、Twitterなどの主要なOAuthプロバイダとの連携も簡単に実装できます。\n\nFirebaseを使うことで、バックエンド開発の多くの側面を簡素化でき、開発者はアプリケーションのフロントエンド部分に集中できるようになります。特にスタートアップや小規模チームにとって、初期の開発速度を上げるための強力なツールとなっています。",
    publishedAt: "2025-04-15",
    memberOnly: false, // 誰でも全文閲覧可能
  },
  {
    id: "2",
    title: "Next.jsでのFirebase Authentication統合ガイド",
    content:
      "Next.jsアプリケーションでFirebase Authenticationを統合する方法を解説します。まず、Firebaseプロジェクトを作成し、必要な認証方法を有効にします。次に、Next.jsプロジェクトにFirebaseSDKをインストールし、設定ファイルを作成します。\n\nApp Routerを使用する場合は、クライアントコンポーネントとしてFirebase認証のコンテキストプロバイダーを実装します。これにより、アプリケーション全体で認証状態を簡単に管理できます。\n\nサインアップ、サインイン、サインアウト、パスワードリセットなどの機能は、FirebaseのAPIを使用して実装します。また、認証状態に基づいた条件付きレンダリングや保護されたルートの実装方法についても説明します。",
    publishedAt: "2025-04-18",
    memberOnly: true, // 会員限定記事
  },
  {
    id: "3",
    title: "Next.js App Routerの基礎",
    content:
      "Next.js 13で導入されたApp Routerは、React Server Componentsを活用した新しいルーティングパラダイムです。従来のPages Routerと比較して、より柔軟なレイアウト管理、ストリーミングによるUI表示、効率的なデータフェッチングなど多くの利点があります。\n\nApp Routerでは、ファイルシステムベースのルーティングが採用されており、特定のファイル命名規則（page.tsx, layout.tsx, loading.tsx など）に従ってコンポーネントを配置することでアプリケーションの構造を定義します。\n\nサーバーコンポーネントとクライアントコンポーネントの使い分けも重要なポイントです。データフェッチングやデータベースアクセスなどの処理はサーバーコンポーネントで行い、インタラクティブな要素はクライアントコンポーネントで実装するというアプローチが推奨されています。",
    publishedAt: "2025-04-20",
    memberOnly: true, // 会員限定記事
  },
];

export interface BlogWithPreview extends Blog {
  previewContent: string;
}

export async function getBlogById(id: string): Promise<BlogWithPreview | null> {
  // 実際の環境ではAPIからフェッチするなどの処理
  const blog = mockBlogs.find((blog) => blog.id === id);
  if (!blog) return null;

  // プレビューコンテンツを生成して返す
  return {
    ...blog,
    previewContent: generatePreviewContent(blog.content),
  };
}

export async function getAllBlogs(): Promise<BlogWithPreview[]> {
  // 実際の環境ではAPIからフェッチするなどの処理
  return mockBlogs.map((blog) => ({
    ...blog,
    previewContent: generatePreviewContent(blog.content),
  }));
}
