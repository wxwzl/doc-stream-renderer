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
      h(
        'div',
        {
          class: props.className,
          style: {
            width: '100%',
            background: '#f5f5f5',
            padding: '40px 0',
            ...props.containerStyle,
          },
        },
        [
          h('div', {
            ref: hostRef,
            style: {
              width: '794px',
              margin: '0 auto',
              padding: '72px',
              background: '#fff',
              minHeight: '1123px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              boxSizing: 'border-box',
            },
          }),
        ]
      );
  },
});
