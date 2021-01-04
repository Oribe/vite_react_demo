import { resolve } from "path";
import type { UserConfig } from "vite";
import createImportPlugin from "vite-plugin-import";
import * as reactPlugin from "vite-plugin-react";

/**
 * 获取某文件路径
 * @param path 文件路径
 */
function pathResolve(path: string) {
  return resolve(__dirname, "./", path);
}

const config: UserConfig = {
  jsx: "react",
  plugins: [
    reactPlugin,
    createImportPlugin([
      {
        libraryName: "antd",
        style: true,
      },
    ]),
  ],
  port: 4000,
  alias: {
    "/@/": pathResolve("src"),
    "/@component/": pathResolve("src/component"),
    "/@assets/": pathResolve("src/assets"),
    "/@style/": pathResolve("src/style"),
    "/@view/": pathResolve("src/view"),
    "/@route/": pathResolve("src/route"),
    "/@store/": pathResolve("src/store"),
    "/@utils/": pathResolve("src/utils"),
  },
  open: false,
  optimizeDeps: {
    // include: ["@ant-design/icons"],
  },
  proxy: {
    "/api": {
      target: "http://localhost:3030",
      changeOrigin: true,
      rewrite: (path) => path.replace(/\/api/, ""),
    },
  },
};

export default config;
