import React, { useEffect, useRef, useCallback } from 'react';
export * from '../core';
import { parseStream, renderBlocksHtml, computeOlCountersBeforeIndex } from '../core';

export interface DocStreamRendererProps {
  stream: string;
  className?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  autoScroll?: boolean;
  scrollContainer?: HTMLElement | null;
}

export const DocStreamRenderer: React.FC<DocStreamRendererProps> = ({
  stream,
  className,
  style,
  containerStyle,
  autoScroll = true,
  scrollContainer,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevBlocksRef = useRef<string[]>([]);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  const getContainer = useCallback(() => {
    const host = hostRef.current;
    if (!host) return null;

    let shadow = host.shadowRoot;
    if (!shadow) {
      shadow = host.attachShadow({ mode: 'open' });
    }

    if (!containerRef.current) {
      const container = document.createElement('div');
      container.style.width = '100%';
      if (containerStyle) {
        Object.assign(container.style, containerStyle);
      }
      shadow.appendChild(container);
      containerRef.current = container;
    }

    return containerRef.current;
  }, [containerStyle]);

  const getScrollTarget = useCallback(() => scrollContainer ?? hostRef.current, [scrollContainer]);

  const isNearBottom = useCallback(() => {
    const target = getScrollTarget();
    if (!target) return true;
    const threshold = 50;
    return target.scrollHeight - target.scrollTop - target.clientHeight < threshold;
  }, [getScrollTarget]);

  const scrollToBottom = useCallback(() => {
    const target = getScrollTarget();
    if (!target) return;
    target.scrollTop = target.scrollHeight;
  }, [getScrollTarget]);

  // 监听用户滚动
  useEffect(() => {
    const target = getScrollTarget();
    if (!target || !autoScroll) return;

    const handleScroll = () => {
      isUserScrollingRef.current = !isNearBottom();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = !isNearBottom();
      }, 150);
    };

    target.addEventListener('scroll', handleScroll);
    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [autoScroll, isNearBottom, getScrollTarget]);

  // 增量更新
  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const container = getContainer();
      if (!container) return;

      const parsed = parseStream(stream);
      if (!parsed) {
        // 解析失败，保留已有内容（不白屏）
        return;
      }

      const { blocks, globalStyle } = parsed;
      const newBlocksSerialized = blocks.map(b => JSON.stringify(b));
      const prevBlocks = prevBlocksRef.current;

      // 找到第一个不同的索引
      let diffIndex = 0;
      while (
        diffIndex < prevBlocks.length &&
        diffIndex < newBlocksSerialized.length &&
        prevBlocks[diffIndex] === newBlocksSerialized[diffIndex]
      ) {
        diffIndex++;
      }

      // 如果完全相同，不需要更新
      if (diffIndex === prevBlocks.length && diffIndex === newBlocksSerialized.length) {
        return;
      }

      const isPureAppend = diffIndex === prevBlocks.length && diffIndex > 0;

      if (isPureAppend) {
        // 纯追加：只渲染并 append 新增 blocks
        const olCounters = computeOlCountersBeforeIndex(blocks, diffIndex);
        const newHtml = renderBlocksHtml(blocks.slice(diffIndex), globalStyle, [...olCounters]);
        container.insertAdjacentHTML('beforeend', newHtml);
      } else {
        // 有修改或删除：全量更新
        container.innerHTML = renderBlocksHtml(blocks, globalStyle, []);
      }

      prevBlocksRef.current = newBlocksSerialized;

      // 自动滚动
      if (autoScroll && !isUserScrollingRef.current) {
        scrollToBottom();
      }
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [stream, autoScroll, containerStyle, getContainer, scrollToBottom, getScrollTarget]);

  return <div ref={hostRef} className={className} style={{ width: '100%', ...style }} />;
};
