import { useRef, useState, useCallback } from 'react';
import { DocStreamRenderer, generateDocxBlob } from 'doc-stream-renderer/react';
import { examples } from '../examples';

const getInitialKey = () => {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('example');
  return key && key in examples ? key : 'basic';
};

export default function App() {
  const initialKey = getInitialKey();
  const [stream, setStream] = useState(examples[initialKey as keyof typeof examples].data);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeKey, setActiveKey] = useState<string>(initialKey);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const handleScrollContainerRef = useCallback((el: HTMLElement | null) => {
    scrollContainerRef.current = el;
    setScrollContainer(el);
  }, []);

  const stopStreaming = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
      setIsStreaming(false);
    }
  };

  const startCharStreaming = (fullText: string, durationMs = 8000, fixedDelay?: number) => {
    stopStreaming();
    setStream('');
    setIsStreaming(true);

    let index = 0;
    const delay = fixedDelay ?? Math.max(5, Math.floor(durationMs / fullText.length));

    streamingIntervalRef.current = setInterval(() => {
      if (index < fullText.length) {
        const nextIndex = index + 1;
        setStream(fullText.slice(0, nextIndex));
        index = nextIndex;
      } else {
        stopStreaming();
      }
    }, delay);
  };

  const updateUrl = (key: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('example', key);
    window.history.replaceState({}, '', url);
  };

  const loadExample = (key: string) => {
    stopStreaming();
    setActiveKey(key);
    updateUrl(key);

    if (key === 'incomplete') {
      startCharStreaming(examples.incomplete.data);
      return;
    }

    if (key === 'streaming') {
      startCharStreaming(examples.streaming.data, 8000);
      return;
    }

    if (key === 'autoScroll') {
      startCharStreaming(examples.autoScroll.data, 20000, 4);
      return;
    }

    if (key === 'externalScroll') {
      startCharStreaming(examples.externalScroll.data, 20000, 4);
      return;
    }

    setStream(examples[key as keyof typeof examples].data);
  };

  const downloadDocx = async () => {
    try {
      const blob = await generateDocxBlob(stream);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      alert('生成失败：' + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Doc Stream Renderer</h1>
        <p>流式 Word 文档预览组件演示</p>
      </header>

      <main className="container main-layout">
        <aside className="sidebar">
          <h3 className="sidebar-title">示例模板</h3>
          <div className="sidebar-list">
            {Object.entries(examples).map(([key, ex]) => (
              <div
                key={key}
                className={`sidebar-item${activeKey === key ? ' active' : ''}`}
                onClick={() => loadExample(key)}
              >
                <span className="sidebar-item-name">{ex.name}</span>
                <span className="sidebar-item-desc">{ex.desc}</span>
              </div>
            ))}
          </div>
          <div className="sidebar-hint">提示：选择 "动态流式演示" 可体验逐字符流式生成效果</div>
        </aside>

        <div className="content">
          <section className="demo-section">
            <h2>
              JSON 输入
              {isStreaming && <span className="stream-status streaming">流式生成中...</span>}
            </h2>
            <div className="controls">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  stopStreaming();
                  setStream('');
                }}
              >
                清空
              </button>
              <button className="btn btn-primary" onClick={downloadDocx}>
                下载 Word
              </button>
            </div>
            <textarea
              className="input-area"
              value={stream}
              onChange={e => {
                stopStreaming();
                setStream(e.target.value);
              }}
              placeholder="在此输入 JSON 数据..."
            />
          </section>

          <section className="demo-section">
            <h2>预览效果 (使用 DocStreamRenderer 组件)</h2>
            <div
              ref={activeKey === 'externalScroll' ? handleScrollContainerRef : undefined}
              style={{
                width: '100%',
                background: '#f5f5f5',
                padding: '40px 0',
                ...(activeKey === 'externalScroll' ? { height: '400px', overflow: 'auto' } : {}),
              }}
            >
              {activeKey === 'externalScroll' ? (
                <div
                  style={{
                    width: '794px',
                    margin: '0 auto',
                    background: '#fff',
                    border: '1px solid #ddd',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box',
                    padding: '24px',
                  }}
                >
                  <DocStreamRenderer
                    stream={stream}
                    autoScroll
                    scrollContainer={scrollContainer}
                    style={{ height: '100%' }}
                  />
                </div>
              ) : (
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
                >
                  <DocStreamRenderer
                    stream={stream}
                    autoScroll
                    style={
                      activeKey === 'autoScroll'
                        ? { maxHeight: '600px', overflow: 'auto', border: '1px solid #eee' }
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
