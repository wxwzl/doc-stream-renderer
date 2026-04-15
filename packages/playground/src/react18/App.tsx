import { useRef, useState } from 'react';
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

  const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStreaming = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
      setIsStreaming(false);
    }
  };

  const startCharStreaming = (fullText: string) => {
    stopStreaming();
    setStream('');
    setIsStreaming(true);

    let index = 0;
    streamingIntervalRef.current = setInterval(
      () => {
        if (index < fullText.length) {
          const nextIndex = index + 1;
          setStream(fullText.slice(0, nextIndex));
          index = nextIndex;
        } else {
          stopStreaming();
        }
      },
      Math.max(2, Math.floor(1500 / fullText.length))
    ); // 总时长约 1.5s，最少 2ms/字
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
      startCharStreaming(examples.rich.data);
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
              style={{
                width: '100%',
                background: '#f5f5f5',
                padding: '40px 0',
              }}
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
              >
                <DocStreamRenderer stream={stream} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
