<template>
  <div class="app">
    <header class="header">
      <h1>Doc Stream Renderer</h1>
      <p>流式 Word 文档预览组件 - Vue 3 演示</p>
    </header>

    <main class="container">
      <section class="demo-section">
        <h2>示例模板</h2>
        <div class="examples">
          <div
            v-for="(ex, key) in examples"
            :key="key"
            class="example-card"
            @click="loadExample(key)"
          >
            <h4>{{ ex.name }}</h4>
            <p>{{ ex.desc }}</p>
          </div>
        </div>
        <div class="info-box">提示：选择 "动态流式演示" 可体验逐字符流式生成效果</div>
      </section>

      <section class="demo-section">
        <h2>
          JSON 输入
          <span v-if="isStreaming" class="stream-status streaming">流式生成中...</span>
        </h2>
        <div class="controls">
          <button
            class="btn btn-secondary"
            @click="
              stopStreaming();
              stream = '';
            "
          >
            清空
          </button>
          <button class="btn btn-primary" @click="downloadDocx">下载 Word</button>
        </div>
        <textarea
          v-model="stream"
          @input="stopStreaming()"
          class="input-area"
          placeholder="在此输入 JSON 数据..."
        />
      </section>

      <section class="demo-section">
        <h2>预览效果 (使用 DocStreamRenderer 组件)</h2>
        <div style="width: 100%; background: #f5f5f5; padding: 40px 0">
          <div
            style="
              width: 794px;
              margin: 0 auto;
              padding: 72px;
              background: #fff;
              min-height: 1123px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              box-sizing: border-box;
            "
          >
            <DocStreamRenderer :stream="stream" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue';
  import { DocStreamRenderer, generateDocxBlob } from 'doc-stream-renderer/vue';
  import { examples } from '../examples';

  const stream = ref(examples.basic.data);
  const isStreaming = ref(false);
  let streamingInterval: ReturnType<typeof setInterval> | null = null;

  const stopStreaming = () => {
    if (streamingInterval) {
      clearInterval(streamingInterval);
      streamingInterval = null;
      isStreaming.value = false;
    }
  };

  const startCharStreaming = (fullText: string) => {
    stopStreaming();
    stream.value = '';
    isStreaming.value = true;

    let index = 0;
    const delay = Math.max(2, Math.floor(1500 / fullText.length));

    streamingInterval = setInterval(() => {
      if (index < fullText.length) {
        stream.value = fullText.slice(0, index + 1);
        index++;
      } else {
        stopStreaming();
      }
    }, delay);
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

    stream.value = examples[key as keyof typeof examples].data;
  };

  const downloadDocx = async () => {
    try {
      const blob = await generateDocxBlob(stream.value);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('生成失败：' + e.message);
    }
  };

  onUnmounted(() => {
    stopStreaming();
  });
</script>
