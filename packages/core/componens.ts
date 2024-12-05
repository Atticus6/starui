import * as items from "@starui/components";
import type { Plugin } from "vue";

const compoentns: Plugin[] = [];

Object.keys(items).forEach((key) => {
  if (key.startsWith("St"))
    // @ts-ignore
    compoentns.push(items[key]);
});

export default compoentns;
