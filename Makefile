# TWSimulator Makefile
# WebAssemblyビルドとフロントエンド開発のための便利なコマンド集
# devcontainer環境（特にWindowsホスト）での権限問題に対応

.PHONY: help install build build-release dev clean test lint serve all fix-permissions fix-cargo-permissions dev-server

# ユーザー情報を取得
USER_ID := $(shell id -u)
GROUP_ID := $(shell id -g)

# デフォルトターゲット: ヘルプを表示
help:
	@echo "TWSimulator Makefile"
	@echo ""
	@echo "使用可能なコマンド:"
	@echo "  make install      - 必要な依存関係をインストール"
	@echo "  make build        - WASMモジュールを開発モードでビルド"
	@echo "  make build-release - WASMモジュールをリリースモードでビルド"
	@echo "  make dev          - 開発サーバーを起動"
	@echo "  make dev-server   - 開発サーバーのみを起動（WASMビルドなし）"
	@echo "  make clean        - ビルド成果物を削除"
	@echo "  make test         - テストを実行"
	@echo "  make lint         - コードの静的解析を実行"
	@echo "  make serve        - ビルドしたアプリケーションを提供"
	@echo "  make all          - リリースビルドして提供"
	@echo "  make fix-permissions - 権限問題を修正"
	@echo "  make fix-cargo-permissions - Cargoキャッシュの権限問題を修正"

# 権限問題を修正
fix-permissions:
	@echo "権限問題を修正中..."
	@if [ -d "pkg" ]; then chmod -R 777 pkg || true; fi
	@if [ -d "target" ]; then chmod -R 777 target || true; fi
	@if [ -d "www/dist" ]; then chmod -R 777 www/dist || true; fi
	@if [ -d "www/node_modules" ]; then chmod -R 777 www/node_modules || true; fi
	@if [ -d "www/pkg" ]; then chmod -R 777 www/pkg || true; fi
	@echo "権限を修正しました"

# Cargoキャッシュの権限問題を修正
fix-cargo-permissions:
	@echo "Cargoキャッシュの権限問題を修正中..."
	@if [ -d "/usr/local/cargo/registry" ]; then \
		sudo chmod -R 777 /usr/local/cargo/registry || true; \
		echo "Cargoレジストリの権限を修正しました"; \
	fi
	@if [ -d "$$HOME/.cargo/registry" ]; then \
		chmod -R 777 $$HOME/.cargo/registry || true; \
		echo "ユーザーCargoレジストリの権限を修正しました"; \
	fi
	@if [ -d "/usr/local/cargo/git" ]; then \
		sudo chmod -R 777 /usr/local/cargo/git || true; \
		echo "Cargo gitキャッシュの権限を修正しました"; \
	fi
	@if [ -d "$$HOME/.cargo/git" ]; then \
		chmod -R 777 $$HOME/.cargo/git || true; \
		echo "ユーザーCargo gitキャッシュの権限を修正しました"; \
	fi

# 依存関係のインストール
install: fix-permissions fix-cargo-permissions
	@echo "依存関係をインストール中..."
	@if ! command -v wasm-pack > /dev/null; then \
		echo "wasm-packをインストール中..."; \
		if [ "$(USER_ID)" = "0" ]; then \
			cargo install wasm-pack; \
		else \
			sudo -E cargo install wasm-pack || cargo install wasm-pack; \
		fi \
	fi
	@cd www && npm install --no-optional || (chmod -R 777 . && npm install --no-optional)
	@$(MAKE) fix-permissions

# WASMモジュールを開発モードでビルド
build: fix-permissions fix-cargo-permissions
	@echo "WASMモジュールを開発モードでビルド中..."
	sudo -E wasm-pack build --target web || wasm-pack build --target web || (chmod -R 777 . && wasm-pack build --target web)
	@echo "WASMモジュールをwww/pkgディレクトリにコピー中..."
	@rm -rf www/pkg || true
	@mkdir -p www/pkg
	@cp -r pkg/* www/pkg/
	@$(MAKE) fix-permissions

# WASMモジュールをリリースモードでビルド
build-release: fix-permissions fix-cargo-permissions
	@echo "WASMモジュールをリリースモードでビルド中..."
	sudo -E wasm-pack build --target web --release || wasm-pack build --target web --release || (chmod -R 777 . && wasm-pack build --target web --release)
	@echo "WASMモジュールをwww/pkgディレクトリにコピー中..."
	@rm -rf www/pkg || true
	@mkdir -p www/pkg
	@cp -r pkg/* www/pkg/
	@$(MAKE) fix-permissions

# 開発サーバーを起動
dev: build
	@echo "開発サーバーを起動中..."
	cd www && npm run dev

# 開発サーバーのみを起動（WASMビルドなし）
dev-server:
	@echo "開発サーバーのみを起動中（WASMビルドなし）..."
	cd www && npm run dev

# ビルド成果物を削除
clean:
	@echo "ビルド成果物を削除中..."
	rm -rf pkg || true
	rm -rf target/wasm32-unknown-unknown || true
	rm -rf www/dist || true
	rm -rf www/pkg || true
	rm -rf www/node_modules/.vite || true
	@$(MAKE) fix-permissions

# テストを実行
test: fix-permissions fix-cargo-permissions
	@echo "Rustテストを実行中..."
	sudo -E cargo test || cargo test || (chmod -R 777 . && cargo test)
	@echo "フロントエンドテストを実行中..."
	cd www && npm test
	@$(MAKE) fix-permissions

# コードの静的解析を実行
lint: fix-permissions fix-cargo-permissions
	@echo "Rustコードの静的解析を実行中..."
	sudo -E cargo clippy -- -D warnings || cargo clippy -- -D warnings || (chmod -R 777 . && cargo clippy -- -D warnings)
	@echo "フロントエンドコードの静的解析を実行中..."
	cd www && npm run lint
	@$(MAKE) fix-permissions

# ビルドしたアプリケーションを提供
serve: build-release
	@echo "ビルドしたアプリケーションを提供中..."
	cd www && npm run build
	cd www && npx serve -s dist
	@$(MAKE) fix-permissions

# リリースビルドして提供
all: clean build-release
	@echo "リリースビルドを作成中..."
	cd www && npm run build
	@echo "アプリケーションを提供中..."
	cd www && npx serve -s dist
	@$(MAKE) fix-permissions
