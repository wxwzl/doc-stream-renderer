import React, { useEffect, useRef, useMemo } from 'react';
export * from '../core';
import { getHtmlFromStream } from '../core';

export const DocStreamRenderer: React.FC<{
  stream: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ stream, className, style }) => {
  const htmlContent = useMemo(() => getHtmlFromStream(stream), [stream]);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let shadow = host.shadowRoot;
    if (!shadow) {
      shadow = host.attachShadow({ mode: 'open' });
    }

    shadow.innerHTML = htmlContent;
  }, [htmlContent]);

  return <div ref={hostRef} className={className} style={{ width: '100%', ...style }} />;
};
