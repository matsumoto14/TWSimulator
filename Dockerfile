FROM rust:1.81

# wasm-packインストール
RUN cargo install wasm-pack

# Node.js（npx serve用）インストール
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

# 作業ディレクトリを作成
WORKDIR /app
COPY . .

# ポート開放（serve用）
EXPOSE 3000

CMD ["/bin/bash"]