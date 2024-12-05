import { defineComponent } from "vue";
import { isFunction } from "lodash-es";

export const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object, Function],
      required: true,
    },
  },
  setup(props) {
    return () => (isFunction(props.vNode) ? props.vNode() : props.vNode);
  },
});

export * from "./install";
