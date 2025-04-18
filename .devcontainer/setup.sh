#!/bin/bash
set -e

# DevContainer セットアップスクリプト
echo "TWSimulator 開発環境をセットアップしています..."

# 環境変数ファイルのセットアップ
if [ ! -f .env ]; then
  echo "環境変数ファイルをコピーしています..."
  cp .env.example .env
  echo ".env ファイルが作成されました。必要に応じて編集してください。"
fi

# Rust ツールチェーンの確認
echo "Rust ツールチェーンを確認しています..."
rustup component add rustfmt clippy
cargo --version
rustc --version
wasm-pack --version

# 依存関係のチェック
echo "依存関係をチェックしています..."
cargo check

# VS Code タスクの設定
if [ ! -d ../.vscode ]; then
  echo "VS Code タスク設定を作成しています..."
  mkdir -p ../.vscode
  cp tasks.json ../.vscode/tasks.json
  cp launch.json ../.vscode/launch.json
  echo "VS Code タスク設定が完了しました。"
fi

echo "セットアップが完了しました！"
echo "開発を開始するには:"
echo "1. wasm-pack build --target web"
echo "2. cd www && npx serve"
echo "3. ブラウザで http://localhost:3000 にアクセス"
