# doc-stream-renderer

专门为流式 JSON 数据设计的 Word 文档预览组件。适用于大模型（LLM）边生成内容边预览 Word 文档的场景。

同时提供：

- **HTML 预览**（边生成边渲染）
- **DOCX 导出**（完整 JSON 下载）

---

## 安装

```bash
pnpm add doc-stream-renderer docx
```

> `docx` 是必需的 peerDependency，用于生成 `.docx` 文件。

---

## 快速开始

### React

```tsx
import { WordStreamPreview, generateDocxBlob } from 'doc-stream-renderer/react';

function App() {
  const [stream, setStream] = useState('{"blocks":[{"type":"title","content":"Hello"}]}');

  const handleDownload = async () => {
    const blob = await generateDocxBlob(stream);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.docx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <WordStreamPreview stream={stream} />
      <button onClick={handleDownload}>下载 Word</button>
    </>
  );
}
```

### Vue 3

```vue
<script setup>
  import { ref } from 'vue';
  import { WordStreamPreview, generateDocxBlob } from 'doc-stream-renderer/vue';

  const stream = ref('{"blocks":[{"type":"title","content":"Hello"}]}');

  const handleDownload = async () => {
    const blob = await generateDocxBlob(stream.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.docx';
    a.click();
    URL.revokeObjectURL(url);
  };
</script>

<template>
  <WordStreamPreview :stream="stream" />
  <button @click="handleDownload">下载 Word</button>
</template>
```

---

## 组件 API

### `WordStreamPreview` (React)

| 属性名      | 类型                  | 必填 | 说明                                       |
| ----------- | --------------------- | ---- | ------------------------------------------ |
| `stream`    | `string`              | 是   | 流式 JSON 字符串，支持不完整 JSON 容错解析 |
| `className` | `string`              | 否   | 外层容器的 CSS 类名                        |
| `style`     | `React.CSSProperties` | 否   | 外层容器的内联样式                         |

### `WordStreamPreview` (Vue 3)

| 属性名           | 类型     | 必填 | 说明                                       |
| ---------------- | -------- | ---- | ------------------------------------------ |
| `stream`         | `string` | 是   | 流式 JSON 字符串，支持不完整 JSON 容错解析 |
| `className`      | `string` | 否   | 外层容器的 CSS 类名                        |
| `containerStyle` | `object` | 否   | 外层容器的内联样式对象                     |

---

## 核心 API

如果只需要底层能力，可以直接从 `core` 引入。

```ts
import { getHtmlFromStream, generateDocxBlob } from 'doc-stream-renderer/core';
```

### `getHtmlFromStream(rawStr: string): string`

将流式 JSON 字符串解析为 HTML。

- 自动使用 **容错解析**（`partial-json`），即使 JSON 不完整也不会报错。
- 返回可直接插入 DOM 的 HTML 字符串。

```ts
const html = getHtmlFromStream('{"blocks":[{"content":"Hello"}]}');
// => <div style="text-align: left; ...">Hello</div>
```

### `generateDocxBlob(jsonStr: string): Promise<Blob>`

将完整 JSON 字符串转换为 Word `.docx` Blob。

- 同样使用容错解析，避免流式数据在下载瞬间不完整导致崩溃。
- 返回的 `Blob` 可用于文件下载或上传。

```ts
const blob = await generateDocxBlob('{"blocks":[{"content":"Hello"}]}');
```

---

## 数据协议

组件支持 **不完整的 JSON 字符串**，解析时会自动容错补全。完整的数据结构如下：

```ts
interface InlineStyle {
  fontWeight?: 'bold' | 'normal' | string;
  fontSize?: string; // e.g. "16px"
}

interface InlineItem {
  text?: string;
  style?: InlineStyle;
}

interface BlockStyle {
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'bold' | 'normal' | string;
  fontSize?: string;
  marginTop?: string; // e.g. "10px"
  marginBottom?: string; // e.g. "10px"
}

interface Block {
  type?: 'title' | 'subtitle' | 'heading' | 'paragraph' | 'ol' | 'ul' | string;
  style?: BlockStyle;
  content?: string | InlineItem[] | { items?: string[] };
}

interface GlobalStyle {
  fontSize?: string; // e.g. "16px"
  lineHeight?: string; // e.g. "1.8"
  fontFamily?: string; // e.g. "SimSun, 宋体, serif"
}

interface ParsedData {
  blocks?: Block[];
  globalStyle?: GlobalStyle;
}
```

### 完整示例

```json
{
  "globalStyle": {
    "fontSize": "16px",
    "lineHeight": "1.8",
    "fontFamily": "SimSun, 宋体, serif"
  },
  "blocks": [
    {
      "type": "title",
      "content": "文档标题",
      "style": {
        "textAlign": "center",
        "fontWeight": "bold",
        "fontSize": "24px",
        "marginBottom": "20px"
      }
    },
    {
      "type": "paragraph",
      "content": [
        { "text": "普通文本，", "style": {} },
        { "text": "加粗文本", "style": { "fontWeight": "bold", "fontSize": "18px" } },
        { "text": "，继续普通文本。" }
      ]
    },
    {
      "type": "ul",
      "content": {
        "items": ["项目 A", "项目 B", "项目 C"]
      }
    },
    {
      "type": "ol",
      "content": {
        "items": ["步骤 1", "步骤 2", "步骤 3"]
      }
    }
  ]
}
```

### 字段说明

| 字段                                     | 说明                                                                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `globalStyle.fontSize`                   | 全局默认字号，作用于所有未单独设置字号的块                                                    |
| `globalStyle.lineHeight`                 | 全局行高，作用于所有块                                                                        |
| `globalStyle.fontFamily`                 | 全局字体，作用于所有块                                                                        |
| `block.type`                             | 块的类型，用于决定渲染方式。`ol`/`ul` 会渲染为列表，其他类型渲染为普通段落/标题               |
| `block.content`                          | 块的内容。可以是：纯字符串、富文本数组（`InlineItem[]`）、列表项对象（`{ items: string[] }`） |
| `block.style.textAlign`                  | 对齐方式：`left` / `center` / `right`                                                         |
| `block.style.fontWeight`                 | 字重，如 `bold`                                                                               |
| `block.style.fontSize`                   | 块级字号，覆盖全局字号                                                                        |
| `block.style.marginTop` / `marginBottom` | 块级上下边距                                                                                  |

---

## playground

在线示例：[https://wxwzl.github.io/doc-stream-renderer/](https://wxwzl.github.io/doc-stream-renderer/)

---

## 许可证

MIT
