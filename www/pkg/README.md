# TWSimulator

TalesWeaver向けのダメージ計算ツールです。Rust + WebAssemblyで高速に動作します。

![TWSimulator Screenshot](https://via.placeholder.com/800x450.png?text=TWSimulator+Screenshot)

## 📋 機能

- **画像認識**: 装備画面のスクリーンショットから自動的に装備情報を抽出
- **ダメージ計算**: TalesWikiの計算式に基づいた正確なダメージシミュレーション
- **モンスター選択**: 複数のモンスターに対するダメージを同時計算
- **属性対応**: 属性相性を考慮したダメージ計算
- **リッチUI**: 直感的で使いやすいインターフェース
- **レスポンシブ対応**: モバイルデバイスでも快適に使用可能

## 🚀 使い方

1. TalesWeaverで装備画面を開きます
2. スクリーンショットを撮影します（PrintScreenキーなど）
3. アプリにスクリーンショットをアップロードします
4. 自動的に装備情報が抽出されます
5. ダメージを計算したいモンスターを選択します
6. 「ダメージ計算」ボタンをクリックして結果を確認します

## 🔧 技術スタック

- **フロントエンド**: React + TypeScript
- **バックエンド**: Rust + WebAssembly
- **画像処理**: Rust image クレート + テンプレートマッチング
- **スタイリング**: CSS（レスポンシブデザイン）
- **状態管理**: React Hooks

## 📦 セットアップ手順

### 必要なもの

- Rust (1.60.0以上)
- wasm-pack
- Node.js (v18以降)
- Make (Makefileを使用する場合)

### インストール手順

#### Makefileを使用する方法（推奨）

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/twsimulator.git
cd twsimulator
```

2. 依存関係をインストール

```bash
make install
```

3. 開発サーバを起動

```bash
make dev
```

4. ブラウザで http://localhost:5173 にアクセス

#### 手動セットアップ

1. Rust & wasm-pack をインストール（初回のみ）

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack
```

2. リポジトリをクローン

```bash
git clone https://github.com/yourusername/twsimulator.git
cd twsimulator
```

3. WASMモジュールをビルド

```bash
wasm-pack build --target web
```

4. Reactアプリケーションの依存関係をインストール

```bash
cd www
npm install
```

5. 開発サーバを起動

```bash
# www ディレクトリ内で
npm run dev
```

6. ブラウザで http://localhost:5173 にアクセス

## 🐳 開発環境のセットアップ

### VS Code DevContainer を使用する場合（推奨）

1. [VS Code](https://code.visualstudio.com/) と [Remote - Containers 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)をインストール
2. [Docker Desktop](https://www.docker.com/products/docker-desktop)をインストール
3. VS Code でプロジェクトを開く
4. コマンドパレット（`Ctrl+Shift+P` または `Cmd+Shift+P`）を開き、`Remote-Containers: Reopen in Container`を選択
5. VS Code が DevContainer を構築し、その中でプロジェクトを開きます
6. コンテナ内で Makefile を使用してビルド・実行

```bash
# 依存関係のインストール
make install

# 開発サーバーの起動
make dev
```

#### Windows ホストでの権限問題について

Windows ホストで DevContainer を使用する場合、ファイル権限の問題が発生することがあります。この問題を解決するために、Makefileには `fix-permissions` コマンドが含まれています：

```bash
# 権限問題を修正
make fix-permissions
```

このコマンドは自動的に各ビルドステップの前後に実行されますが、問題が発生した場合は手動で実行することもできます。

詳細は [.devcontainer/README.md](.devcontainer/README.md) を参照してください。

### 通常の Docker を使用する場合

1. ビルド・起動

```bash
docker-compose build
docker-compose up -d
docker exec -it twsimulator bash
```

2. コンテナ内でビルド＆サーバ起動（Makefileを使用）

```bash
# 依存関係のインストール
make install

# 開発サーバーの起動
make dev
```

または手動で:

```bash
# WASMモジュールのビルド
wasm-pack build --target web

# React UIの起動
cd www
npm install
npm run dev
```

3. ブラウザで確認

http://localhost:5173 にアクセス

## 🧪 開発

### Makefileを使用する場合（推奨）

```bash
# WASMモジュールのビルド（開発モード）
make build

# WASMモジュールのビルド（リリースモード）
make build-release

# 開発サーバーの起動
make dev

# テスト実行
make test

# コードの静的解析
make lint

# ビルド成果物のクリーン
make clean

# リリースビルドとサーブ
make serve

# 全ての処理（クリーン、ビルド、サーブ）
make all

# 権限問題を修正（Windows ホストの DevContainer で特に有用）
make fix-permissions
```

#### Makefileの権限対応について

このプロジェクトのMakefileは、特にWindowsホストでDevContainerを使用する際に発生する権限問題に対応しています：

- 各コマンドの実行前後に自動的に権限を修正
- コマンド実行に失敗した場合、権限を修正して再試行
- `sudo` コマンドの自動的な使用（必要な場合）
- エラーハンドリングの強化

これにより、ホストOSに依存せず、どの環境でも一貫した方法でビルドと開発が可能になります。

### 手動で実行する場合

#### WASMモジュールのビルド

```bash
wasm-pack build --target web
```

#### React UIの開発

```bash
cd www
npm run dev
```

#### テスト実行

```bash
cargo test
```

#### リリースビルド

```bash
# WASMモジュールのリリースビルド
wasm-pack build --target web --release

# React UIのビルド
cd www
npm run build
```

## 📝 参考資料

- [TalesWiki ダメージ計算式](https://talewiki.com/?cmd=read&page=%A5%B9%A5%C6%A1%BC%A5%BF%A5%B9&word=%A5%C0%A5%E1%A1%BC%A5%B8%B7%D7%BB%BB#z4747f51)
- [Rust WASM Book](https://rustwasm.github.io/docs/book/)

## 🤝 貢献

バグ報告や機能リクエストは GitHub Issues にお願いします。
プルリクエストも歓迎します！

## 📄 ライセンス

MIT
