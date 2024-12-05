import { defineConfig } from "vitepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {
  containerPreview,
  componentPreview,
} from "@vitepress-demo-preview/plugin";
import { readdirSync } from "fs";

import { join, basename, extname } from "path";
function getFilesInDirectory(directoryPath: string) {
  try {
    const files = readdirSync(directoryPath); // 同步读取文件夹内容
    const filePaths = files.map((file) => join(directoryPath, file)); // 生成完整路径
    return filePaths;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

function extractFileNames(filePaths: string[]) {
  return filePaths.map((filePath) => {
    const fileName = basename(filePath, extname(filePath)); // 获取文件名并移除扩展名
    return fileName;
  });
}

const sortFilenames = (fileNames: string[]) =>
  fileNames.sort((a, b) => {
    if (a === "index") return -1; // `index` 总是在最前
    if (b === "index") return 1;
    return a.localeCompare(b); // 按字母顺序排序
  });

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "四达时代组件库",
  description: "描述",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "组件", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "组件",
        items: sortFilenames(
          extractFileNames(getFilesInDirectory("./components"))
        ).map((text) => ({
          text: text === "index" ? "介绍" : text,
          link: `/components/${text}`,
        })),
        // items: [
        //   { text: "Markdown Examples", link: "/markdown-examples" },
        //   { text: "Runtime API Examples", link: "/api-examples" },
        // ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
  vite: {
    plugins: [vueJsx()],
  },
});
