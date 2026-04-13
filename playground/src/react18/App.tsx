import { useRef, useState } from 'react';
import { WordStreamPreview, generateDocxBlob } from 'doc-stream-renderer/react';
import { examples } from '../examples';

export default function App() {
  const [stream, setStream] = useState(examples.basic.data);
  const [isStreaming, setIsStreaming] = useState(false);

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

  const loadExample = (key: string) => {
    stopStreaming();

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

      <main className="container">
        <section className="demo-section">
          <h2>示例模板</h2>
          <div className="examples">
            {Object.entries(examples).map(([key, ex]) => (
              <div key={key} className="example-card" onClick={() => loadExample(key)}>
                <h4>{ex.name}</h4>
                <p>{ex.desc}</p>
              </div>
            ))}
          </div>
          <div className="info-box">提示：选择 "动态流式演示" 可体验逐字符流式生成效果</div>
        </section>

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
          <h2>预览效果 (使用 WordStreamPreview 组件)</h2>
          <WordStreamPreview stream={stream} />
        </section>
      </main>
    </div>
  );
}
