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
import { DocStreamRenderer, generateDocxBlob } from 'doc-stream-renderer/react';

function App() {
  const [stream, setStream] = useState('{"blocks":[{"type":"h1","content":"Hello"}]}');

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
      <DocStreamRenderer stream={stream} />
      <button onClick={handleDownload}>下载 Word</button>
    </>
  );
}
```

### Vue 3

```vue
<script setup>
  import { ref } from 'vue';
  import { DocStreamRenderer, generateDocxBlob } from 'doc-stream-renderer/vue';

  const stream = ref('{"blocks":[{"type":"h1","content":"Hello"}]}');

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
  <DocStreamRenderer :stream="stream" />
  <button @click="handleDownload">下载 Word</button>
</template>
```

---

## 组件 API

### `DocStreamRenderer` (React)

| 属性名      | 类型                  | 必填 | 说明                                       |
| ----------- | --------------------- | ---- | ------------------------------------------ |
| `stream`    | `string`              | 是   | 流式 JSON 字符串，支持不完整 JSON 容错解析 |
| `className` | `string`              | 否   | 外层容器的 CSS 类名                        |
| `style`     | `React.CSSProperties` | 否   | 外层容器的内联样式                         |

### `DocStreamRenderer` (Vue 3)

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
const html = getHtmlFromStream('{"blocks":[{"type":"p","content":"Hello"}]}');
// => <p style="text-align: left; ...">Hello</p>
```

### `generateDocxBlob(jsonStr: string): Promise<Blob>`

将完整 JSON 字符串转换为 Word `.docx` Blob。

- 同样使用容错解析，避免流式数据在下载瞬间不完整导致崩溃。
- 返回的 `Blob` 可用于文件下载或上传。

```ts
const blob = await generateDocxBlob('{"blocks":[{"type":"p","content":"Hello"}]}');
```

---

## 数据协议

组件支持 **不完整的 JSON 字符串**，解析时会自动容错补全。完整的数据结构如下：

### 类型定义

```ts
interface InlineStyle {
  fontWeight?: 'bold' | 'normal' | string;
  fontSize?: string;
  fontStyle?: 'normal' | 'italic' | string;
  color?: string;
  textDecoration?: 'underline' | 'line-through' | string;
  backgroundColor?: string;
  verticalAlign?: 'super' | 'sub' | string;
  letterSpacing?: string;
  highlight?: string;
}

interface InlineItem {
  text?: string;
  style?: InlineStyle;
  href?: string;
}

interface BlockStyle {
  textAlign?: 'left' | 'center' | 'right' | string;
  fontWeight?: 'bold' | 'normal' | string;
  fontSize?: string;
  lineHeight?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  textIndent?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
}

interface TableCell {
  content?: string | InlineItem[];
  colSpan?: number;
  rowSpan?: number;
  width?: string | number;
  textAlign?: 'left' | 'center' | 'right' | string;
  verticalAlign?: 'top' | 'middle' | 'bottom' | string;
}

interface TableRow {
  cells: TableCell[];
}

interface TableContent {
  rows: TableRow[];
}

interface ImageContent {
  src: string; // base64 或图片 URL
  width?: number;
  height?: number;
  wrap?: 'inline' | 'square' | 'tight' | 'topAndBottom' | 'behindText' | 'inFrontOfText';
}

interface CodeContent {
  code: string;
  language?: string;
}

interface ListContent {
  items?: string[];
  level?: number;
}

type BlockType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'paragraph'
  | 'ul'
  | 'ol'
  | 'table'
  | 'image'
  | 'img'
  | 'quote'
  | 'blockquote'
  | 'code'
  | 'pageBreak'
  | 'divider'
  | 'hr';

interface Block {
  type?: BlockType;
  style?: BlockStyle;
  content?: string | InlineItem[] | ListContent | TableContent | ImageContent | CodeContent;
}

interface GlobalStyle {
  fontSize?: string;
  lineHeight?: string;
  fontFamily?: string;
}

interface PageConfig {
  size?: 'A4' | 'Letter' | { width: number; height: number };
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

interface DocumentMeta {
  title?: string;
  creator?: string;
  description?: string;
  subject?: string;
}

interface ParsedData {
  blocks?: Block[];
  globalStyle?: GlobalStyle;
  page?: PageConfig;
  meta?: DocumentMeta;
}
```

### Block 类型说明

| `block.type`           | HTML 渲染       | DOCX 渲染    | `content` 格式                                                                                 |
| ---------------------- | --------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `h1` ~ `h6`            | `<h1>` ~ `<h6>` | 标题级别 1~6 | `string` / `InlineItem[]`                                                                      |
| `p` / `paragraph`      | `<p>`           | 普通段落     | `string` / `InlineItem[]`                                                                      |
| `ul`                   | `<ul>`          | 项目符号列表 | `{ items: string[], level?: number }`                                                          |
| `ol`                   | `<ol>`          | 编号列表     | `{ items: string[], level?: number }`                                                          |
| `table`                | `<table>`       | 表格         | `{ rows: [{ cells: [{ content, colSpan?, rowSpan?, width?, textAlign?, verticalAlign? }] }] }` |
| `image` / `img`        | `<img>`         | 图片         | `{ src: string, width?: number, height?: number, wrap?: string }`                              |
| `quote` / `blockquote` | `<blockquote>`  | 左侧缩进段落 | `string` / `InlineItem[]`                                                                      |
| `code`                 | `<pre><code>`   | 等宽字体段落 | `{ code: string, language?: string }` 或 `string`                                              |
| `pageBreak`            | 分页符          | 分页符       | 无                                                                                             |
| `divider` / `hr`       | `<hr>`          | 分隔线       | 无                                                                                             |

### 完整示例

```json
{
  "globalStyle": {
    "fontSize": "16px",
    "lineHeight": "1.8",
    "fontFamily": "SimSun, 宋体, serif"
  },
  "page": {
    "size": "A4",
    "orientation": "portrait",
    "margin": {
      "top": "72pt",
      "bottom": "72pt",
      "left": "90pt",
      "right": "90pt"
    }
  },
  "meta": {
    "title": "示例文档",
    "creator": "doc-stream-renderer"
  },
  "blocks": [
    {
      "type": "h1",
      "content": "文档标题",
      "style": {
        "textAlign": "center",
        "fontWeight": "bold",
        "fontSize": "24px",
        "marginBottom": "20px"
      }
    },
    {
      "type": "h2",
      "content": "一、项目概述"
    },
    {
      "type": "p",
      "content": [
        { "text": "普通文本，", "style": {} },
        { "text": "加粗文本", "style": { "fontWeight": "bold", "fontSize": "18px" } },
        { "text": "，继续普通文本。" },
        { "text": "点击访问", "style": { "color": "#1890ff" }, "href": "https://example.com" }
      ],
      "style": {
        "textIndent": "2em",
        "borderLeft": "4px solid #1890ff"
      }
    },
    {
      "type": "table",
      "content": {
        "rows": [
          {
            "cells": [
              { "content": "项目", "width": "50%", "textAlign": "center" },
              { "content": "状态", "width": "50%", "textAlign": "center" }
            ]
          },
          {
            "cells": [
              { "content": "渲染引擎", "textAlign": "left" },
              { "content": "已完成", "textAlign": "right" }
            ]
          }
        ]
      }
    },
    {
      "type": "code",
      "content": {
        "code": "console.log('hello')",
        "language": "javascript"
      }
    },
    {
      "type": "ul",
      "content": {
        "items": ["项目 A", "项目 B"],
        "level": 0
      }
    },
    {
      "type": "ol",
      "content": {
        "items": ["步骤 1", "步骤 2", "步骤 3"],
        "level": 1
      }
    },
    {
      "type": "image",
      "content": {
        "src": "data:image/png;base64,iVBORw0KGgo...",
        "width": 300,
        "height": 200,
        "wrap": "square"
      }
    },
    {
      "type": "divider"
    }
  ]
}
```

### 字段说明

| 字段                                                                        | 说明                                                                                          |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `globalStyle.fontSize`                                                      | 全局默认字号，作用于所有未单独设置字号的块                                                    |
| `globalStyle.lineHeight`                                                    | 全局行高，作用于所有块                                                                        |
| `globalStyle.fontFamily`                                                    | 全局字体，作用于所有块                                                                        |
| `page.size`                                                                 | 页面尺寸：`A4` / `Letter` / 自定义 `{ width, height }`                                        |
| `page.orientation`                                                          | 页面方向：`portrait`（纵向）/ `landscape`（横向）                                             |
| `page.margin`                                                               | 页面边距，支持 `top` / `right` / `bottom` / `left`                                            |
| `meta.title`                                                                | 文档标题（DOCX 属性）                                                                         |
| `meta.creator`                                                              | 文档作者（DOCX 属性）                                                                         |
| `meta.description`                                                          | 文档描述（DOCX 属性）                                                                         |
| `meta.subject`                                                              | 文档主题（DOCX 属性）                                                                         |
| `block.type`                                                                | 块的类型，决定渲染方式。支持标题、段落、列表、表格、图片、代码块、分页符等                    |
| `block.content`                                                             | 块的内容。类型不同，格式不同：纯字符串、富文本数组、列表项、表格结构、图片对象、代码对象等    |
| `block.style.textAlign`                                                     | 对齐方式：`left` / `center` / `right`                                                         |
| `block.style.fontWeight`                                                    | 字重，如 `bold`                                                                               |
| `block.style.fontSize`                                                      | 块级字号，覆盖全局字号                                                                        |
| `block.style.lineHeight`                                                    | 块级行高，覆盖全局行高                                                                        |
| `block.style.fontFamily`                                                    | 块级字体，覆盖全局字体                                                                        |
| `block.style.color`                                                         | 块级文字颜色                                                                                  |
| `block.style.backgroundColor`                                               | 块级背景色                                                                                    |
| `block.style.marginTop` / `marginBottom`                                    | 块级上下边距                                                                                  |
| `block.style.marginLeft` / `marginRight`                                    | 块级左右边距                                                                                  |
| `block.style.padding`                                                       | 块级统一内边距                                                                                |
| `block.style.paddingTop` / `paddingBottom` / `paddingLeft` / `paddingRight` | 块级分项内边距                                                                                |
| `block.style.textIndent`                                                    | 首行缩进，如 `2em`                                                                            |
| `block.style.borderTop` / `borderBottom` / `borderLeft` / `borderRight`     | 段落四边边框，格式同 CSS `border`（如 `1px solid #ccc`）                                      |
| `inline.style.textDecoration`                                               | 文字装饰：`underline` / `line-through`                                                        |
| `inline.style.backgroundColor`                                              | 文字背景色                                                                                    |
| `inline.style.verticalAlign`                                                | 垂直对齐：`super`（上标）/ `sub`（下标）                                                      |
| `inline.style.letterSpacing`                                                | 字符间距，如 `1px` / `0.5pt`                                                                  |
| `inline.style.highlight`                                                    | 文字高亮颜色（DOCX 高亮），如 `yellow` / `green` / `cyan` / `red` / `blue`                    |
| `inline.href`                                                               | 超链接地址，设置后该 InlineItem 渲染为可点击链接                                              |
| `tableCell.width`                                                           | 单元格宽度，支持百分比字符串或数字（twips）                                                   |
| `tableCell.textAlign`                                                       | 单元格文字水平对齐                                                                            |
| `tableCell.verticalAlign`                                                   | 单元格文字垂直对齐：`top` / `middle` / `bottom`                                               |
| `listContent.level`                                                         | 列表嵌套层级，支持 `0` ~ `9`                                                                  |
| `imageContent.wrap`                                                         | 图片环绕方式：`inline` / `square` / `tight` / `topAndBottom` / `behindText` / `inFrontOfText` |

---

## playground

在线示例：[https://wxwzl.github.io/doc-stream-renderer/](https://wxwzl.github.io/doc-stream-renderer/)

---

## 许可证

MIT
