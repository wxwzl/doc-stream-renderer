<template>
  <div class="app">
    <header class="header">
      <h1>Doc Stream Renderer</h1>
      <p>流式 Word 文档预览组件 - Vue 3 演示</p>
    </header>

    <main class="container main-layout">
      <aside class="sidebar">
        <h3 class="sidebar-title">示例模板</h3>
        <div class="sidebar-list">
          <div
            v-for="(ex, key) in examples"
            :key="key"
            class="sidebar-item"
            :class="{ active: activeKey === key }"
            @click="loadExample(key)"
          >
            <span class="sidebar-item-name">{{ ex.name }}</span>
            <span class="sidebar-item-desc">{{ ex.desc }}</span>
          </div>
        </div>
        <div class="sidebar-hint">提示：选择 "动态流式演示" 可体验逐字符流式生成效果</div>
      </aside>

      <div class="content">
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
          <div
            :ref="activeKey === 'externalScroll' ? scrollContainerRef : null"
            :style="[
              { width: '100%', background: '#f5f5f5', padding: '40px 0' },
              activeKey === 'externalScroll' ? { height: '400px', overflow: 'auto' } : {},
            ]"
          >
            <div
              v-if="activeKey === 'externalScroll'"
              style="
                width: 794px;
                margin: 0 auto;
                background: #fff;
                border: 1px solid #ddd;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                box-sizing: border-box;
                padding: 24px;
              "
            >
              <DocStreamRenderer
                :stream="stream"
                auto-scroll
                :scroll-container="scrollContainerRef"
                :style="{ height: '100%' }"
              />
            </div>
            <div
              v-else
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
              <DocStreamRenderer
                :stream="stream"
                auto-scroll
                :style="
                  activeKey === 'autoScroll'
                    ? { maxHeight: '600px', overflow: 'auto', border: '1px solid #eee' }
                    : undefined
                "
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue';
  import { DocStreamRenderer, generateDocxBlob } from 'doc-stream-renderer/vue';
  import { examples } from '../examples';

  const getInitialKey = () => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('example');
    return key && key in examples ? key : 'basic';
  };

  const initialKey = getInitialKey();
  const stream = ref(examples[initialKey as keyof typeof examples].data);
  const isStreaming = ref(false);
  const activeKey = ref(initialKey);
  const scrollContainerRef = ref<HTMLElement | null>(null);
  let streamingInterval: ReturnType<typeof setInterval> | null = null;

  const stopStreaming = () => {
    if (streamingInterval) {
      clearInterval(streamingInterval);
      streamingInterval = null;
      isStreaming.value = false;
    }
  };

  const startCharStreaming = (fullText: string, durationMs = 8000, fixedDelay?: number) => {
    stopStreaming();
    stream.value = '';
    isStreaming.value = true;

    let index = 0;
    const delay = fixedDelay ?? Math.max(5, Math.floor(durationMs / fullText.length));

    streamingInterval = setInterval(() => {
      if (index < fullText.length) {
        stream.value = fullText.slice(0, index + 1);
        index++;
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
    activeKey.value = key;
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
