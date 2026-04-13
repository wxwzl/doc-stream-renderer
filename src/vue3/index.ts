import { defineComponent, computed, h } from 'vue';
import { getHtmlFromStream, generateDocxBlob } from '../core';

export { generateDocxBlob };

export const WordStreamPreview = defineComponent({
  name: 'WordStreamPreview',
  props: {
    stream: { type: String, required: true },
    className: { type: String, default: '' },
    containerStyle: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const htmlContent = computed(() => getHtmlFromStream(props.stream));

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
            style: {
              width: '794px',
              margin: '0 auto',
              padding: '72px',
              background: '#fff',
              minHeight: '1123px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              boxSizing: 'border-box',
            },
            innerHTML: htmlContent.value,
          }),
        ]
      );
  },
});
