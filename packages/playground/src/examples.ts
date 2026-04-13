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
  incomplete: {
    name: '模拟流式数据',
    desc: '不完整的 JSON（模拟 LLM 流式输出）',
    data: `{"globalStyle":{"fontSize":"16px","lineHeight":"1.8","fontFamily":"Microsoft YaHei, sans-serif"},"blocks":[{"type":"h1","content":"2025 年度产品战略规划（实时生成中）","style":{"textAlign":"center","fontWeight":"bold","fontSize":"24px","marginBottom":"20px"}},{"type":"p","content":[{"text":"编制日期：","style":{"fontWeight":"bold"}},{"text":"2026年4月13日"}]},{"type":"p","content":[{"text":"责任部门：","style":{"fontWeight":"bold"}},{"text":"产品战略部 · 增长与商业化中心"}]},{"type":"h2","content":"一、市场洞察与机会分析","style":{"fontWeight":"bold","fontSize":"18px","marginTop":"20px","marginBottom":"10px"}},{"type":"p","content":"随着 AI 技术的快速演进，企业级文档处理市场正经历着前所未有的变革。用户需求从单一的格式转换，逐步转向以流式渲染、实时协作为核心的智能文档体验。"},{"type":"p","content":"我们的核心竞争优势在于："},{"type":"ul","content":{"items":['底层自研的流式 JSON 协议，支持在任意截断状态下安全渲染','跨框架（React / Vue 3）组件复用，降低客户接入成本','基于 Web Worker 的异步文档生成，保障大文件场景下的主线程流畅性']}},{"type":"h2","content":"二、年度核心目标","style":{"fontWeight":"bold","fontSize":"18px","marginTop":"20px","marginBottom":"10px"}},{"type":"p","content":"围绕“体验升级、生态开放、商业闭环”三大关键词，我们制定了以下年度目标："},{"type":"ol","content":{"items":['Q1-Q2：完成流式渲染引擎 2.0 升级，支持表格、图片、分页符等复杂元素','Q2-Q3：上线开放平台与插件市场，引入第三方开发者共建生态','Q3-Q4：商业化产品矩阵落地，实现年度经常性收入（ARR）增长 150%']}},{"type":"h2","content":"三、关键举措与里程碑","style":{"fontWeight":"bold","fontSize":"18px","marginTop":"20px","marginBottom":"10px"}},{"type":"p","content":"为确保战略目标的达成，我们将在技术研发、市场拓展和组织建设三方面同步发力。`,
  },
  streaming: {
    name: '动态流式演示',
    desc: '点击后开始模拟流式生成',
    data: '',
  },
};
