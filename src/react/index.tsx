import React, { useMemo } from 'react';
import { getHtmlFromStream, generateDocxBlob } from '../core';

export { generateDocxBlob };

export const WordStreamPreview: React.FC<{
  stream: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ stream, className, style }) => {
  const htmlContent = useMemo(() => getHtmlFromStream(stream), [stream]);

  return (
    <div
      className={className}
      style={{ width: '100%', background: '#f5f5f5', padding: '40px 0', ...style }}
    >
      <div
        style={{
          width: '794px',
          margin: '0 auto',
          padding: '72px',
          background: '#fff',
          minHeight: '1123px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
