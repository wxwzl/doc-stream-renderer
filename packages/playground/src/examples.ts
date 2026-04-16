export const examples = {
  basic: {
    name: '基础文档',
    desc: '标题、段落和简单样式',
    data: JSON.stringify(
      {
        globalStyle: { fontSize: '16px', lineHeight: '1.8', fontFamily: 'SimSun, serif' },
        blocks: [
          {
            type: 'h1',
            content: '项目计划书',
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '24px',
              marginBottom: '20px',
            },
          },
          {
            type: 'h2',
            content: '2024年度',
            style: { textAlign: 'center', fontSize: '18px', marginBottom: '40px' },
          },
          {
            type: 'h3',
            content: '一、项目概述',
            style: {
              fontWeight: 'bold',
              fontSize: '18px',
              marginTop: '20px',
              marginBottom: '10px',
            },
          },
          {
            type: 'p',
            content: '本项目旨在开发一套智能化的文档处理系统，通过流式渲染技术实现实时预览功能。',
          },
          {
            type: 'h3',
            content: '二、技术方案',
            style: {
              fontWeight: 'bold',
              fontSize: '18px',
              marginTop: '20px',
              marginBottom: '10px',
            },
          },
          {
            type: 'p',
            content: '采用 React 和 Vue 3 双框架支持，核心逻辑使用 TypeScript 编写，确保类型安全。',
          },
        ],
      },
      null,
      2
    ),
  },
  rich: {
    name: '富文本文档',
    desc: '包含多种格式和列表',
    data: JSON.stringify(
      {
        globalStyle: {
          fontSize: '14px',
          lineHeight: '1.8',
          fontFamily: 'Microsoft YaHei, sans-serif',
        },
        blocks: [
          {
            type: 'h1',
            content: '2025 年度研发团队工作总结',
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '22px',
              marginBottom: '30px',
            },
          },
          {
            type: 'p',
            content: [
              { text: '报告周期：', style: { fontWeight: 'bold' } },
              { text: '2025年1月1日 - 2025年12月31日' },
            ],
          },
          {
            type: 'p',
            content: [
              { text: '编制部门：', style: { fontWeight: 'bold' } },
              { text: '产品研发部 · 平台技术组' },
            ],
          },
          {
            type: 'p',
            content: [
              { text: '负责人：', style: { fontWeight: 'bold' } },
              { text: '张晓明、李思雨、王浩然' },
            ],
          },
          {
            type: 'h2',
            content: '一、年度目标回顾',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'p',
            content:
              '本年度团队围绕“稳定性、性能、体验”三大关键词，持续推进平台级能力建设。核心目标包括：',
          },
          {
            type: 'ol',
            content: {
              items: [
                '将核心服务可用性从 99.9% 提升至 99.99%',
                '完成前端渲染引擎的全面重构与性能优化',
                '建立覆盖全流程的自动化测试与质量门禁体系',
              ],
            },
          },
          {
            type: 'h2',
            content: '二、重点成果展示',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'p',
            content: [
              { text: '1. 流式文档渲染引擎 ', style: { fontWeight: 'bold' } },
              { text: '—— 支持在 LLM 流式输出场景下实时渲染 Word 预览，端到端延迟降低 80%。' },
            ],
          },
          {
            type: 'p',
            content: [
              { text: '2. 双框架组件库 ', style: { fontWeight: 'bold' } },
              {
                text: '—— 核心逻辑与框架适配层完全解耦，React 与 Vue 3 共用同一套底层协议与样式系统。',
              },
            ],
          },
          {
            type: 'p',
            content: [
              { text: '3. 智能化测试平台 ', style: { fontWeight: 'bold' } },
              { text: '—— 引入基于语义的 UI 快照对比，结合 AI 辅助生成边界测试用例。' },
            ],
          },
          {
            type: 'h2',
            content: '三、技术创新点',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'ul',
            content: {
              items: [
                'JSON Patch 驱动的增量渲染：避免全量刷新，确保大文档流式更新时的帧率稳定',
                'Partial-JSON 容错解析：允许在不完整 JSON 状态下安全提取可渲染内容',
                '基于 Web Worker 的文档生成：将 docx 构建过程异步化，不阻塞主线程交互',
              ],
            },
          },
          {
            type: 'h2',
            content: '四、反思与展望',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'p',
            content:
              '回顾全年，我们在架构治理和技术债偿还方面取得了长足进步，但在跨团队协作与需求交付节奏上仍有优化空间。展望 2026，团队将聚焦以下方向：',
          },
          {
            type: 'ol',
            content: {
              items: [
                '深化 AIGC 场景落地，探索多模态内容生成与实时预览的融合方案',
                '推进国际化能力建设，完善多语言排版、RTL 适配与本地字体嵌入',
                '构建开发生态，提供低代码配置能力与第三方插件扩展机制',
              ],
            },
          },
          {
            type: 'p',
            content: [
              { text: '结语：', style: { fontWeight: 'bold', fontStyle: 'italic' } },
              { text: '技术为业务创造价值，团队为产品注入灵魂。2026，让我们继续并肩前行。' },
            ],
          },
        ],
      },
      null,
      2
    ),
  },
  advanced: {
    name: '高级组件',
    desc: '表格、代码块、引用、分隔线',
    data: JSON.stringify(
      {
        globalStyle: {
          fontSize: '14px',
          lineHeight: '1.8',
          fontFamily: 'Microsoft YaHei, sans-serif',
        },
        blocks: [
          {
            type: 'h1',
            content: '高级文档组件演示',
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '22px',
              marginBottom: '20px',
            },
          },
          {
            type: 'h2',
            content: '1. 表格',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'table',
            content: {
              rows: [
                {
                  cells: [{ content: '项目' }, { content: '状态' }, { content: '负责人' }],
                },
                {
                  cells: [
                    { content: '流式渲染引擎' },
                    { content: '已完成' },
                    { content: '张晓明' },
                  ],
                },
                {
                  cells: [{ content: 'Vue 3 适配' }, { content: '进行中' }, { content: '李思雨' }],
                },
              ],
            },
          },
          {
            type: 'h2',
            content: '2. 代码块',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'code',
            content: {
              code: "function hello() {\n  console.log('Hello, doc-stream-renderer!');\n}",
              language: 'typescript',
            },
          },
          {
            type: 'h2',
            content: '3. 引用块',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'quote',
            content:
              '流式渲染的核心价值在于：即使在数据不完整的情况下，也能提供稳定、可预期的预览体验。',
            style: {
              marginTop: '10px',
              marginBottom: '10px',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'p',
            content: '以上展示了目前支持的高级组件类型。',
            style: {
              marginTop: '10px',
            },
          },
        ],
      },
      null,
      2
    ),
  },
  fullFeatures: {
    name: '全部特性',
    desc: '展示所有新增配置项',
    data: JSON.stringify(
      {
        globalStyle: {
          fontSize: '14px',
          lineHeight: '1.8',
          fontFamily: 'Microsoft YaHei, sans-serif',
        },
        page: {
          size: 'A4',
          orientation: 'portrait',
          margin: {
            top: '72pt',
            right: '72pt',
            bottom: '72pt',
            left: '72pt',
          },
        },
        meta: {
          title: '全部特性演示文档',
          creator: 'Doc Stream Renderer',
          description: '展示所有新增配置项的完整示例',
          subject: '特性演示',
        },
        blocks: [
          {
            type: 'h1',
            content: '全部特性演示',
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '26px',
              marginBottom: '24px',
            },
          },
          {
            type: 'h2',
            content: '1. 富文本与内联样式',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'p',
            content: [
              { text: '这是普通文本。' },
              { text: '加粗', style: { fontWeight: 'bold' } },
              { text: '、' },
              { text: '斜体', style: { fontStyle: 'italic' } },
              { text: '、' },
              { text: '下划线', style: { textDecoration: 'underline' } },
              { text: '、' },
              { text: '删除线', style: { textDecoration: 'line-through' } },
              { text: '、' },
              { text: '红色文字', style: { color: '#e74c3c' } },
              { text: '、' },
              { text: '黄色背景', style: { backgroundColor: '#f1c40f' } },
              { text: '、' },
              { text: '宽字符间距', style: { letterSpacing: '2px' } },
              { text: '、' },
              { text: '高亮', style: { highlight: 'cyan' } },
              { text: '、' },
              { text: '上标', style: { verticalAlign: 'super', fontSize: '12px' } },
              { text: '与' },
              { text: '下标', style: { verticalAlign: 'sub', fontSize: '12px' } },
              { text: '。更多请访问 ' },
              {
                text: '官网',
                style: { color: '#1890ff' },
                href: 'https://github.com/wxwzl/doc-stream-renderer',
              },
              { text: '。' },
            ],
          },
          {
            type: 'h2',
            content: '2. 段落边框与首行缩进',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'p',
            content:
              '本段落设置了首行缩进 2em，并且四边均有边框。你可以看到左侧有一条醒目的蓝色边框，上下是浅灰色细线，右侧是绿色虚线边框。',
            style: {
              textIndent: '2em',
              borderLeft: '4px solid #1890ff',
              borderTop: '1px solid #ccc',
              borderBottom: '1px solid #ccc',
              borderRight: '2px dashed #2ecc71',
              padding: '10px',
              marginTop: '10px',
              marginBottom: '10px',
              backgroundColor: '#fafafa',
            },
          },
          {
            type: 'h2',
            content: '3. 表格增强',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'table',
            content: {
              rows: [
                {
                  cells: [
                    {
                      content: '功能项',
                      width: '30%',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                    },
                    { content: '状态', width: '20%', textAlign: 'center', verticalAlign: 'middle' },
                    { content: '说明', width: '50%', textAlign: 'center', verticalAlign: 'middle' },
                  ],
                },
                {
                  cells: [
                    { content: '超链接', textAlign: 'left', verticalAlign: 'top' },
                    { content: '已完成', textAlign: 'center', verticalAlign: 'middle' },
                    { content: '支持行内文本链接跳转' },
                  ],
                },
                {
                  cells: [
                    { content: '首行缩进', textAlign: 'left', verticalAlign: 'top' },
                    { content: '已完成', textAlign: 'center', verticalAlign: 'middle' },
                    { content: '段落级别 textIndent 控制' },
                  ],
                },
                {
                  cells: [
                    { content: '段落边框', textAlign: 'left', verticalAlign: 'top' },
                    { content: '已完成', textAlign: 'center', verticalAlign: 'middle' },
                    { content: '支持四边独立边框配置' },
                  ],
                },
                {
                  cells: [
                    { content: '图片环绕', textAlign: 'left', verticalAlign: 'top' },
                    { content: '已完成', textAlign: 'center', verticalAlign: 'middle' },
                    { content: '支持 square / tight / topAndBottom 等环绕方式' },
                  ],
                },
              ],
            },
          },
          {
            type: 'h2',
            content: '4. 列表嵌套层级',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'ul',
            content: {
              items: ['一级无序列表项 A', '一级无序列表项 B'],
              level: 0,
            },
          },
          {
            type: 'ul',
            content: {
              items: ['二级无序列表项 C', '二级无序列表项 D'],
              level: 1,
            },
          },
          {
            type: 'ol',
            content: {
              items: ['一级有序列表项 1', '一级有序列表项 2'],
              level: 0,
            },
          },
          {
            type: 'ol',
            content: {
              items: ['二级有序列表项 3'],
              level: 2,
            },
          },
          {
            type: 'h2',
            content: '5. 代码块',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'code',
            content: {
              code: 'const add = (a: number, b: number) =\u003e {\n  return a + b;\n};\nconsole.log(add(2, 3));',
              language: 'typescript',
            },
          },
          {
            type: 'h2',
            content: '6. 引用块',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'quote',
            content:
              '这是引用块内容。默认左侧会有蓝色竖线，也可以通过 borderLeft 自定义为其他颜色或样式。',
            style: {
              marginTop: '10px',
              marginBottom: '10px',
            },
          },
          {
            type: 'h2',
            content: '7. 图片与环绕方式',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              marginBottom: '10px',
            },
          },
          {
            type: 'h3',
            content: '7.1 inline（行内嵌入）',
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '10px',
              marginBottom: '6px',
            },
          },
          {
            type: 'p',
            content: [
              { text: '图片像文字一样嵌入在行内，适合小图标或表情。例如：' },
              { text: '[图]', style: { color: '#e74c3c' } },
              { text: ' 这就是 inline 的效果。' },
            ],
            style: {
              marginBottom: '10px',
            },
          },
          {
            type: 'image',
            content: {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAIAAAAfXYiZAAAAfElEQVR4nO3QQQkAIADAQEMYx/4pDGMFfQ3hYAHGjT2XLhv5wUfBggUrDxYsWHmwYMHKgwULVh4sWLDyYMGClQcLFqw8WLBg5cGCBSsPFixYebBgwcqDBQtWHixYsPJgwYKVBwsWrDxYsGDlwYIFKw8WLFh5sGDByoP10AEQdHjWGnpYxAAAAABJRU5ErkJggg==',
              width: 80,
              height: 48,
              wrap: 'inline',
            },
          },
          {
            type: 'h3',
            content: '7.2 square（四周环绕）',
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '10px',
              marginBottom: '6px',
            },
          },
          {
            type: 'p',
            content: 'square 环绕方式下，文字会沿着图片的矩形边界环绕。',
            style: {
              marginBottom: '10px',
            },
          },
          {
            type: 'image',
            content: {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAIAAAAfXYiZAAAAfElEQVR4nO3QQQkAIADAQEMYx/4pDGMFfQ3hYAHGjT2XLhv5wUfBggUrDxYsWHmwYMHKgwULVh4sWLDyYMGClQcLFqw8WLBg5cGCBSsPFixYebBgwcqDBQtWHixYsPJgwYKVBwsWrDxYsGDlwYIFKw8WLFh5sGDByoP10AEQdHjWGnpYxAAAAABJRU5ErkJggg==',
              width: 160,
              height: 100,
              wrap: 'square',
            },
          },
          {
            type: 'p',
            content:
              '可以看到，这段文字会自动填充到图片的右侧和下方，形成典型的图文混排效果。square 是最常用的环绕方式之一。',
            style: {
              marginTop: '10px',
            },
          },
          {
            type: 'h3',
            content: '7.3 tight（紧密环绕）',
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '10px',
              marginBottom: '6px',
            },
          },
          {
            type: 'p',
            content: 'tight 环绕方式比 square 更紧密，文字会尽量贴近图片边缘。',
            style: {
              marginBottom: '10px',
            },
          },
          {
            type: 'image',
            content: {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAIAAAAfXYiZAAAAfElEQVR4nO3QQQkAIADAQEMYx/4pDGMFfQ3hYAHGjT2XLhv5wUfBggUrDxYsWHmwYMHKgwULVh4sWLDyYMGClQcLFqw8WLBg5cGCBSsPFixYebBgwcqDBQtWHixYsPJgwYKVBwsWrDxYsGDlwYIFKw8WLFh5sGDByoP10AEQdHjWGnpYxAAAAABJRU5ErkJggg==',
              width: 160,
              height: 100,
              wrap: 'tight',
            },
          },
          {
            type: 'p',
            content:
              '在 DOCX 中，tight 环绕会让文字更贴合图片的实际轮廓，HTML 预览中则表现为 tighter 的 float 布局。',
            style: {
              marginTop: '10px',
            },
          },
          {
            type: 'h3',
            content: '7.4 topAndBottom（上下型环绕）',
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '10px',
              marginBottom: '6px',
            },
          },
          {
            type: 'p',
            content: 'topAndBottom 环绕方式下，文字只出现在图片的上方和下方，左右两侧不留文字。',
            style: {
              marginBottom: '10px',
            },
          },
          {
            type: 'image',
            content: {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAIAAAAfXYiZAAAAfElEQVR4nO3QQQkAIADAQEMYx/4pDGMFfQ3hYAHGjT2XLhv5wUfBggUrDxYsWHmwYMHKgwULVh4sWLDyYMGClQcLFqw8WLBg5cGCBSsPFixYebBgwcqDBQtWHixYsPJgwYKVBwsWrDxYsGDlwYIFKw8WLFh5sGDByoP10AEQdHjWGnpYxAAAAABJRU5ErkJggg==',
              width: 160,
              height: 100,
              wrap: 'topAndBottom',
            },
          },
          {
            type: 'p',
            content:
              '注意看，这段文字会出现在图片的下方，而图片左右两侧不会有文字环绕。适合需要独占一行的重要插图。',
            style: {
              marginTop: '10px',
            },
          },
          {
            type: 'h3',
            content: '7.5 behindText（衬于文字下方）',
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '10px',
              marginBottom: '6px',
            },
          },
          {
            type: 'p',
            content: 'behindText 将图片置于文字底层，文字会覆盖在图片上方显示。',
            style: {
              marginBottom: '10px',
            },
          },
          {
            type: 'image',
            content: {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAIAAAAfXYiZAAAAfElEQVR4nO3QQQkAIADAQEMYx/4pDGMFfQ3hYAHGjT2XLhv5wUfBggUrDxYsWHmwYMHKgwULVh4sWLDyYMGClQcLFqw8WLBg5cGCBSsPFixYebBgwcqDBQtWHixYsPJgwYKVBwsWrDxYsGDlwYIFKw8WLFh5sGDByoP10AEQdHjWGnpYxAAAAABJRU5ErkJggg==',
              width: 160,
              height: 100,
              wrap: 'behindText',
            },
          },
          {
            type: 'p',
            content:
              '在 DOCX 中，这张图片会作为背景层出现；HTML 预览里我们采用 float 左对齐，以便在语义上保持与文档一致。',
            style: {
              marginTop: '10px',
            },
          },
          {
            type: 'h3',
            content: '7.6 inFrontOfText（浮于文字上方）',
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '10px',
              marginBottom: '6px',
            },
          },
          {
            type: 'p',
            content: 'inFrontOfText 让图片浮在文字之上，常用于水印或悬浮标注效果。',
            style: {
              marginBottom: '10px',
            },
          },
          {
            type: 'image',
            content: {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAIAAAAfXYiZAAAAfElEQVR4nO3QQQkAIADAQEMYx/4pDGMFfQ3hYAHGjT2XLhv5wUfBggUrDxYsWHmwYMHKgwULVh4sWLDyYMGClQcLFqw8WLBg5cGCBSsPFixYebBgwcqDBQtWHixYsPJgwYKVBwsWrDxYsGDlwYIFKw8WLFh5sGDByoP10AEQdHjWGnpYxAAAAABJRU5ErkJggg==',
              width: 160,
              height: 100,
              wrap: 'inFrontOfText',
            },
          },
          {
            type: 'p',
            content:
              '以上展示了 doc-stream-renderer 支持的全部图片环绕配置：inline / square / tight / topAndBottom / behindText / inFrontOfText。',
            style: {
              marginTop: '10px',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'p',
            content: '以上展示了 doc-stream-renderer 支持的全部主要配置项。',
            style: {
              textAlign: 'center',
              marginTop: '20px',
              color: '#666',
            },
          },
        ],
      },
      null,
      2
    ),
  },
  incomplete: {
    name: '模拟流式数据',
    desc: '不完整的 JSON（模拟 LLM 流式输出）',
    data: `{"globalStyle":{"fontSize":"16px","lineHeight":"1.8","fontFamily":"Microsoft YaHei, sans-serif"},"blocks":[{"type":"h1","content":"2025 年度产品战略规划（实时生成中）","style":{"textAlign":"center","fontWeight":"bold","fontSize":"24px","marginBottom":"20px"}},{"type":"p","content":[{"text":"编制日期：","style":{"fontWeight":"bold"}},{"text":"2026年4月13日"}]},{"type":"p","content":[{"text":"责任部门：","style":{"fontWeight":"bold"}},{"text":"产品战略部 · 增长与商业化中心"}]},{"type":"h2","content":"一、市场洞察与机会分析","style":{"fontWeight":"bold","fontSize":"18px","marginTop":"20px","marginBottom":"10px"}},{"type":"p","content":"随着 AI 技术的快速演进，企业级文档处理市场正经历着前所未有的变革。用户需求从单一的格式转换，逐步转向以流式渲染、实时协作为核心的智能文档体验。"},{"type":"p","content":"我们的核心竞争优势在于："},{"type":"ul","content":{"items":['底层自研的流式 JSON 协议，支持在任意截断状态下安全渲染','跨框架（React / Vue 3）组件复用，降低客户接入成本','基于 Web Worker 的异步文档生成，保障大文件场景下的主线程流畅性']}},{"type":"h2","content":"二、年度核心目标","style":{"fontWeight":"bold","fontSize":"18px","marginTop":"20px","marginBottom":"10px"}},{"type":"p","content":"围绕“体验升级、生态开放、商业闭环”三大关键词，我们制定了以下年度目标："},{"type":"ol","content":{"items":['Q1-Q2：完成流式渲染引擎 2.0 升级，支持表格、图片、分页符等复杂元素','Q2-Q3：上线开放平台与插件市场，引入第三方开发者共建生态','Q3-Q4：商业化产品矩阵落地，实现年度经常性收入（ARR）增长 150%']}},{"type":"h2","content":"三、关键举措与里程碑","style":{"fontWeight":"bold","fontSize":"18px","marginTop":"20px","marginBottom":"10px"}},{"type":"p","content":"为确保战略目标的达成，我们将在技术研发、市场拓展和组织建设三方面同步发力。`,
  },
  units: {
    name: 'pt / em 单位演示',
    desc: '展示 pt、em 单位在字号、间距、行高、表格宽度中的效果',
    data: JSON.stringify(
      {
        globalStyle: {
          fontSize: '14pt',
          lineHeight: '1.6',
          fontFamily: 'Microsoft YaHei, sans-serif',
        },
        page: {
          size: 'A4',
          orientation: 'portrait',
          margin: {
            top: '72pt',
            right: '72pt',
            bottom: '72pt',
            left: '72pt',
          },
        },
        blocks: [
          {
            type: 'h1',
            content: 'pt / em 单位支持演示',
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '24pt',
              marginBottom: '1em',
            },
          },
          {
            type: 'p',
            content: [
              { text: '本页全局字号设置为 14pt。' },
              {
                text: '这行文字是 1.5em（21pt）',
                style: { fontSize: '1.5em', color: '#1890ff' },
              },
              { text: '，相对于全局字号自动放大。' },
            ],
            style: {
              marginTop: '1em',
              marginBottom: '1em',
            },
          },
          {
            type: 'p',
            content: [
              { text: '字间距 0.2em（2.8pt）', style: { letterSpacing: '0.2em' } },
              { text: ' vs ' },
              { text: '字间距 0.5em（7pt）', style: { letterSpacing: '0.5em', color: '#e74c3c' } },
            ],
            style: {
              marginBottom: '1em',
            },
          },
          {
            type: 'h2',
            content: '1. 行高测试',
            style: {
              fontWeight: 'bold',
              fontSize: '16pt',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
          },
          {
            type: 'p',
            content:
              '本段行高设置为 18pt，确保在多行文本时具有固定的垂直间距。即使在不同字号下，行高也能精确控制，不会随倍数浮动。',
            style: {
              fontSize: '12pt',
              lineHeight: '18pt',
              marginBottom: '1em',
            },
          },
          {
            type: 'p',
            content: '本段则使用倍数行高 1.8，与全局 lineHeight 保持一致。',
            style: {
              fontSize: '12pt',
              marginBottom: '1em',
            },
          },
          {
            type: 'h2',
            content: '2. 段落边距与缩进',
            style: {
              fontWeight: 'bold',
              fontSize: '16pt',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
          },
          {
            type: 'p',
            content:
              '本段落设置了首行缩进 2em（以当前 14pt 为基准即 28pt），以及上下边距 0.8em。左侧还有一条 3pt 宽的蓝色边框。',
            style: {
              textIndent: '2em',
              marginTop: '0.8em',
              marginBottom: '0.8em',
              paddingLeft: '1em',
              borderLeft: '3pt solid #1890ff',
            },
          },
          {
            type: 'h2',
            content: '3. 表格宽度支持 em/pt',
            style: {
              fontWeight: 'bold',
              fontSize: '16pt',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
          },
          {
            type: 'table',
            content: {
              rows: [
                {
                  cells: [
                    { content: '单位', width: '30%', textAlign: 'center' },
                    { content: '示例值', width: '35%', textAlign: 'center' },
                    { content: '说明', width: '35%', textAlign: 'center' },
                  ],
                },
                {
                  cells: [
                    { content: 'pt', textAlign: 'center' },
                    { content: '72pt', textAlign: 'center' },
                    { content: '绝对单位，直接映射到 Word 内部尺寸' },
                  ],
                },
                {
                  cells: [
                    { content: 'em', textAlign: 'center' },
                    { content: '2em', textAlign: 'center' },
                    { content: '相对当前字体大小，自动换算' },
                  ],
                },
                {
                  cells: [
                    { content: 'px', textAlign: 'center' },
                    { content: '16px', textAlign: 'center' },
                    { content: '按 1px = 0.75pt 近似换算' },
                  ],
                },
              ],
            },
          },
          {
            type: 'p',
            content: [
              {
                text: '以上演示了 pt、em、px 在 doc-stream-renderer 中的综合应用。',
                style: { fontWeight: 'bold' },
              },
            ],
            style: {
              textAlign: 'center',
              marginTop: '1.5em',
              color: '#666',
            },
          },
        ],
      },
      null,
      2
    ),
  },
  nestedList: {
    name: '多级有序列表',
    desc: '展示 1. / 1.1. / 1.1.1. 层级编号',
    data: JSON.stringify(
      {
        globalStyle: {
          fontSize: '14px',
          lineHeight: '1.8',
          fontFamily: 'Microsoft YaHei, sans-serif',
        },
        blocks: [
          {
            type: 'h1',
            content: '多级有序列表演示',
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '22px',
              marginBottom: '20px',
            },
          },
          {
            type: 'p',
            content: '以下展示了 DOCX 导出时支持的多级有序列表编号效果：',
          },
          {
            type: 'ol',
            content: {
              items: ['一级项目 1'],
              level: 0,
            },
          },
          {
            type: 'ol',
            content: {
              items: ['二级项目 1.1'],
              level: 1,
              indent: '48px',
            },
          },
          {
            type: 'ol',
            content: {
              items: ['三级项目 1.1.1', '三级项目 1.1.2'],
              level: 2,
              indent: '72px',
            },
          },
          {
            type: 'ol',
            content: {
              items: ['二级项目 1.2'],
              level: 1,
              indent: '48px',
            },
          },
          {
            type: 'ol',
            content: {
              items: ['一级项目 2'],
              level: 0,
            },
          },
          {
            type: 'p',
            content:
              '在 Word 文档和 HTML 预览中，各级编号会正确显示为 1. / 1.1. / 1.1.1. 样式。同时支持通过 content.indent 自定义缩进距离。',
            style: {
              marginTop: '10px',
              color: '#666',
            },
          },
        ],
      },
      null,
      2
    ),
  },
  streaming: {
    name: '动态流式演示',
    desc: '点击后开始模拟流式生成',
    data: '',
  },
};
