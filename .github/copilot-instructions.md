# ルーティング

| path                    | description            |
| ----------------------- | ---------------------- |
| /                       | TOP ページ             |
| /account/sign-up        | サインアップページ     |
| /account/sign-in        | サインインページ       |
| /account/password-reset | パスワード再設定ページ |
| /account/profile        | プロフィールページ     |
| /account/withdrawal     | アカウント削除ページ   |

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
