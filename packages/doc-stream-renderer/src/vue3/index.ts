import { defineComponent, h, ref, watch, onMounted, onUnmounted } from 'vue';
export * from '../core';
import { parseStream, renderBlocksHtml, computeOlCountersBeforeIndex } from '../core';

export const DocStreamRenderer = defineComponent({
  name: 'DocStreamRenderer',
  props: {
    stream: { type: String, required: true },
    className: { type: String, default: '' },
    rootStyle: { type: Object, default: () => ({}) },
    containerStyle: { type: Object, default: () => ({}) },
    autoScroll: { type: Boolean, default: true },
  },
  setup(props) {
    const hostRef = ref<HTMLDivElement | null>(null);
    const containerRef = ref<HTMLDivElement | null>(null);
    const prevBlocksRef = ref<string[]>([]);
    const isUserScrollingRef = ref(false);
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const getContainer = () => {
      const host = hostRef.value;
      if (!host) return null;

      let shadow = host.shadowRoot;
      if (!shadow) {
        shadow = host.attachShadow({ mode: 'open' });
      }

      if (!containerRef.value) {
        const container = document.createElement('div');
        container.style.width = '100%';
        const cs = props.containerStyle as Record<string, string> | undefined;
        if (cs) {
          Object.assign(container.style, cs);
        }
        shadow.appendChild(container);
        containerRef.value = container;
      }

      return containerRef.value;
    };

    const isNearBottom = () => {
      const host = hostRef.value;
      if (!host) return true;
      const threshold = 50;
      return host.scrollHeight - host.scrollTop - host.clientHeight < threshold;
    };

    const scrollToBottom = () => {
      const host = hostRef.value;
      if (!host) return;
      host.scrollTop = host.scrollHeight;
    };

    const handleScroll = () => {
      isUserScrollingRef.value = !isNearBottom();
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        isUserScrollingRef.value = !isNearBottom();
      }, 150);
    };

    const updateShadow = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const container = getContainer();
        if (!container) return;

        const parsed = parseStream(props.stream);
        if (!parsed) {
          return;
        }

        const { blocks, globalStyle } = parsed;
        const newBlocksSerialized = blocks.map(b => JSON.stringify(b));
        const prevBlocks = prevBlocksRef.value;

        let diffIndex = 0;
        while (
          diffIndex < prevBlocks.length &&
          diffIndex < newBlocksSerialized.length &&
          prevBlocks[diffIndex] === newBlocksSerialized[diffIndex]
        ) {
          diffIndex++;
        }

        if (diffIndex === prevBlocks.length && diffIndex === newBlocksSerialized.length) {
          return;
        }

        const isPureAppend = diffIndex === prevBlocks.length && diffIndex > 0;

        if (isPureAppend) {
          const olCounters = computeOlCountersBeforeIndex(blocks, diffIndex);
          const newHtml = renderBlocksHtml(blocks.slice(diffIndex), globalStyle, [...olCounters]);
          container.insertAdjacentHTML('beforeend', newHtml);
        } else {
          container.innerHTML = renderBlocksHtml(blocks, globalStyle, []);
        }

        prevBlocksRef.value = newBlocksSerialized;

        if (props.autoScroll && !isUserScrollingRef.value) {
          scrollToBottom();
        }
      });
    };

    onMounted(() => {
      updateShadow();
      const host = hostRef.value;
      if (host && props.autoScroll) {
        host.addEventListener('scroll', handleScroll);
      }
    });

    onUnmounted(() => {
      const host = hostRef.value;
      if (host) {
        host.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    });

    watch(() => props.stream, updateShadow);

    return () =>
      h('div', {
        ref: hostRef,
        class: props.className,
        style: {
          width: '100%',
          ...props.rootStyle,
        },
      });
  },
});
