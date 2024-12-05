import type { App, Plugin } from "vue";

import { each, get, set } from "lodash-es";

const INSTALLED_KEY = "startimes";

export default function makeInstaller(components: Plugin[]) {
  const install = (app: App) => {
    if (get(app, INSTALLED_KEY)) return;
    set(app, INSTALLED_KEY, true);

    each(components, (c) => {
      app.use(c);
    });
  };

  return install;
}
