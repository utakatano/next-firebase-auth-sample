# ルーティング

| path                    | description            |
| ----------------------- | ---------------------- |
| /                       | TOP ページ             |
| /account/sign-up        | サインアップページ     |
| /account/sign-in        | サインインページ       |
| /account/password-reset | パスワード再設定ページ |
| /account/profile        | プロフィールページ     |
| /account/profile/edit   | プロフィール編集ページ |
| /account/withdrawal     | アカウント削除ページ   |
| /blogs/:id              | ブログ詳細ページ       |

# 技術スタック

Next.js の App Router を使用

## 認証サービス

Firebase Authentication を使用

# 機能概要

## 認証機能

- ヘッダーにある新規登録ボタンよりサインアップページにてアカウント登録ができます。
- ヘッダーにあるログインボタンよりサインインページにてアカウントログインができます。
- ログイン後は、ヘッダーがログイン済みの表示になり、ログアウトができます。
- サインアップページとサインインページはお互いページ遷移できます。
- サインインページでパスワードを忘れた場合に、パスワード再設定ページに遷移してパスワードリセットができます。
- プロフィールページからアカウント削除ページに遷移でき、アカウント削除を行うことができます。

## ブログ機能

- ブログ詳細ページ(/blogs/:id)では、API から取得したブログの内容を表示します。
- 各ブログ記事には会員限定フラグ（memberOnly）があり、このフラグと認証状態に基づいて表示内容が変わります：
  - 会員限定でない記事は、ログイン状態に関わらず常に全文表示されます。
  - 会員限定記事は、ログインしているユーザーには全文が表示され、未ログインのユーザーにはプレビュー内容のみが表示されます。
- 会員限定記事には「会員限定」バッジが表示されます。
- 会員限定記事を未ログインで閲覧した場合、「この記事の続きは会員限定です」というメッセージとログイン・新規登録ボタンが表示されます。

# ワークフロー

## 認証機能

サインアップ

```mermaid
sequenceDiagram
    participant User
    participant Next.js Client
    participant Firebase Auth

    User->>Next.js Client: サインアップ情報入力（メール・パスワード）
    Next.js Client->>Firebase Auth: createUserWithEmailAndPassword()
    Firebase Auth-->>Next.js Client: IDトークン・ユーザー情報
    Next.js Client-->>User: 登録完了＆認証済UI表示
```

サインイン

```mermaid
sequenceDiagram
    participant User
    participant Next.js Client
    participant Firebase Auth
    participant Next.js API
    participant Firebase Admin

    User->>Next.js Client: アプリにアクセス
    Next.js Client->>Firebase Auth: ログイン処理（メール/パスワード or OAuth）
    Firebase Auth-->>Next.js Client: IDトークンを発行
    Next.js Client->>Next.js API: IDトークンをAuthorizationヘッダーで送信
    Next.js API->>Firebase Admin: IDトークンを検証
    Firebase Admin-->>Next.js API: ユーザー情報を返す
    Next.js API-->>Next.js Client: 認証済データを返す
    Next.js Client-->>User: 認証済みUIを表示
```

ログアウト

```mermaid
sequenceDiagram
    participant User
    participant Next.js Client
    participant Firebase Auth

    User->>Next.js Client: ログアウトをクリック
    Next.js Client->>Firebase Auth: signOut()
    Firebase Auth-->>Next.js Client: 認証状態クリア
    Next.js Client-->>User: ログイン画面など非認証UIを表示
```

パスワード再設定

```mermaid
sequenceDiagram
    participant User
    participant Next.js Client
    participant Firebase Auth
    participant メールシステム

    User->>Next.js Client: パスワード再設定をリクエスト
    Next.js Client->>Firebase Auth: sendPasswordResetEmail()
    Firebase Auth->>メールシステム: リセットメール送信
    メールシステム-->>User: リセットリンクを含むメール受信
    User->>Firebase Auth: リンククリック後、新パスワードを入力
    Firebase Auth-->>User: パスワード更新完了
```

プロフィール編集

```mermaid
sequenceDiagram
    participant User
    participant Next.js Client
    participant Firebase Auth

    User->>Next.js Client: プロフィール変更フォーム入力
    Next.js Client->>Firebase Auth: updateProfile()
    Firebase Auth-->>Next.js Client: ユーザー情報更新完了
    Next.js Client-->>User: 更新結果表示
```

アカウント削除

```mermaid
sequenceDiagram
    participant User
    participant Next.js Client
    participant Firebase Auth

    User->>Next.js Client: アカウント削除を選択
    Next.js Client->>Firebase Auth: deleteUser()
    Firebase Auth-->>Next.js Client: アカウント削除完了
    Next.js Client-->>User: ログイン画面または削除完了メッセージ表示
```
