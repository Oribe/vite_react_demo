import { resolve } from "path";
import type { UserConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

/**
 * 获取某文件路径
 * @param path 文件路径
 */
const rootDir = resolve(__dirname);

const config: UserConfig = {
  plugins: [reactRefresh()],
  server: {
    port: 4000,
    open: false,
    proxy: {
      "/api": {
        target: "http://localhost:3030",
        changeOrigin: true,
        rewrite: (path) => path.replace(/\/api/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @primary-color: #002060;
          @link-color: #002060;
        `,
        javascriptEnabled: true,
      },
    },
  },
  root: rootDir,
  alias: [
    { find: /^component/, replacement: resolve(rootDir, "src/component") },
    { find: /^assets/, replacement: resolve(rootDir, "src/assets") },
    { find: /^style/, replacement: resolve(rootDir, "src/style") },
    { find: /^view/, replacement: resolve(rootDir, "src/view") },
    { find: /^route/, replacement: resolve(rootDir, "src/route") },
    { find: /^store/, replacement: resolve(rootDir, "src/store") },
    { find: /^utils/, replacement: resolve(rootDir, "src/utils") },
    { find: /^layout/, replacement: resolve(rootDir, "src/layout") },
    { find: /^\/~/, replacement: resolve(rootDir, "src") },
  ],
  optimizeDeps: {
    include: [
      "redux-persist/lib/storage/session",
      "redux-persist/integration/react",
      "antd/lib/button/button-group",
    ],
  },
};

export default config;
