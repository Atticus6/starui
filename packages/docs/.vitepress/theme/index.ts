import DefaultTheme from "vitepress/theme";
import { type App } from "vue";
import StarUI from "starui";
import { ElementPlusContainer } from "@vitepress-demo-preview/component";
import "./style.css";
import "@vitepress-demo-preview/component/dist/style.css";
export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("demo-preview", ElementPlusContainer);
    app.use(StarUI);
  },
};
