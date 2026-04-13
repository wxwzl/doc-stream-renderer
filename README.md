# doc Stream Renderer

专门为流式 JSON 数据设计的 word 文档 预览组件。适用于大模型（LLM）边生成内容边预览 Word 文档的场景。

## 安装

```bash
pnpm add docstream-renderer docx
```

## 使用 React

```
import { DocStreamRenderer } from 'doc-stream-renderer/react';

function App() {
  const [data, setData] = useState('{"blocks":[{"type":"title",...');
  return <DocStreamRenderer stream={data} />;
}
```

## 使用 Vue 3

```
<script setup>
import { DocStreamRenderer } from 'docstream-renderer/vue';
const data = ref('{"blocks":[]');
</script>

<template>
  <DocStreamRenderer :stream="data" />
</template>

```

## [playground](https://wxwzl.github.io//doc-stream-renderer/)

## 数据协议说明

组件会自动处理不完整的 JSON 字符串。基础结构如下：

- globalStyle: 全局样式（fontSize, lineHeight, fontFamily）。
- blocks: 文档块数组。
  - type: 'title' | 'subtitle' | 'heading' |
  - 'paragraph' | 'ol' | 'ul'。
  - content: 字符串、富文本对象数组或列表项数组。
  - style: 局部样式。

---
