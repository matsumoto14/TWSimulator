# DevContainer for TWSimulator

このディレクトリには、VS Code の DevContainer 機能を使用して開発環境をセットアップするための設定ファイルが含まれています。

## 概要

DevContainer を使用すると、Docker コンテナ内で一貫した開発環境を提供できます。これにより、チームメンバー全員が同じ環境で開発できるようになり、「自分の環境では動くのに」という問題を回避できます。

## 前提条件

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Remote - Containers 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## 使用方法

1. VS Code でプロジェクトを開きます
2. コマンドパレット（`Ctrl+Shift+P` または `Cmd+Shift+P`）を開きます
3. `Remote-Containers: Reopen in Container` を選択します
4. VS Code が DevContainer を構築し、その中でプロジェクトを開きます

## 開発環境の構成

開発環境には以下のツールがプリインストールされています：

- Rust と Cargo
- wasm-pack
- Node.js と npm
- serve（ローカル開発サーバー）
- Git
- その他の開発ツール（Zsh, Oh My Zsh など）

## ボリュームマウント

以下のボリュームがマウントされています：

- プロジェクトディレクトリ: `/app`
- Cargo レジストリキャッシュ: `/usr/local/cargo/registry`
- Cargo Git キャッシュ: `/usr/local/cargo/git`
- Rust ターゲットディレクトリ: `/app/target`

これらのボリュームは、コンテナを再構築しても保持されるため、ビルド時間を短縮できます。

## 推奨される VS Code 拡張機能

DevContainer には以下の拡張機能が自動的にインストールされます：

- rust-analyzer: Rust 言語サポート
- even-better-toml: TOML ファイルのサポート
- crates: Cargo.toml の依存関係管理
- vscode-lldb: Rust のデバッグ
- vscode-docker: Docker サポート
- eslint: JavaScript/TypeScript の静的解析
- prettier: コードフォーマッター
- liveserver: 静的ファイルのライブサーバー
- tailwindcss: Tailwind CSS サポート
- markdown-all-in-one: Markdown サポート

## アプリケーションの実行

コンテナ内でアプリケーションをビルドして実行するには：

```bash
# WebAssembly モジュールをビルド
wasm-pack build --target web

# 静的ファイルを提供するサーバーを起動
cd www
npx serve
```

その後、ブラウザで http://localhost:3000 にアクセスしてアプリケーションを表示できます。
