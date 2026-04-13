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

  return (
    <div
      className={className}
      style={{ width: '100%', background: '#f5f5f5', padding: '40px 0', ...style }}
    >
      <div
        ref={hostRef}
        style={{
          width: '794px',
          margin: '0 auto',
          padding: '72px',
          background: '#fff',
          minHeight: '1123px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
};
