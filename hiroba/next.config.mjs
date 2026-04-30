import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // 親フォルダの lockfile により解決基準が ai/sns になりがちなので、広場ルートを固定
    root: __dirname,
    resolveAlias: {
      tailwindcss: path.join(__dirname, "node_modules", "tailwindcss"),
      "@tailwindcss/postcss": path.join(
        __dirname,
        "node_modules",
        "@tailwindcss",
        "postcss"
      ),
    },
  },
  images: {
    remotePatterns: [],
  },
  /**
   * 開発時のみ: ChunkLoadError（動的 import の JS が読み込めない／timeout）対策。
   * VPN・プロキ・親フォルダの同期・CPU 負荷で初回コンパイルが遅い環境向け。
   * それでも出る場合は `npm run dev:clean` とブラウザのスーパーリロード、ポートの統一（3000 固定）を確認。
   */
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer && config.output) {
      config.output.chunkLoadTimeout = 300000
    }
    return config
  },
}

export default nextConfig
