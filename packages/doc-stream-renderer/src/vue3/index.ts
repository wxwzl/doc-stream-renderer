import { defineComponent, h, ref, watch, onMounted } from 'vue';
export * from '../core';
import { getHtmlFromStream } from '../core';

export const DocStreamRenderer = defineComponent({
  name: 'DocStreamRenderer',
  props: {
    stream: { type: String, required: true },
    className: { type: String, default: '' },
    containerStyle: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const hostRef = ref<HTMLDivElement | null>(null);

    const updateShadow = () => {
      const host = hostRef.value;
      if (!host) return;

      let shadow = host.shadowRoot;
      if (!shadow) {
        shadow = host.attachShadow({ mode: 'open' });
      }

      shadow.innerHTML = getHtmlFromStream(props.stream);
    };

    onMounted(updateShadow);
    watch(() => props.stream, updateShadow);

    return () =>
      h('div', {
        ref: hostRef,
        class: props.className,
        style: {
          width: '100%',
          ...props.containerStyle,
        },
      });
  },
});
