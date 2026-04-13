import { Allow, parse } from 'partial-json';
import * as docx from 'docx';

interface InlineStyle {
  fontWeight?: string;
  fontSize?: string;
}

interface InlineItem {
  text?: string;
  style?: InlineStyle;
}

interface BlockStyle {
  textAlign?: string;
  fontWeight?: string;
  fontSize?: string;
  marginTop?: string;
  marginBottom?: string;
}

interface Block {
  type?: string;
  style?: BlockStyle;
  content?: string | InlineItem[] | { items?: string[] };
}

interface GlobalStyle {
  fontSize?: string;
  lineHeight?: string;
  fontFamily?: string;
}

interface ParsedData {
  blocks?: Block[];
  globalStyle?: GlobalStyle;
}

/**
 * 预览 HTML 生成逻辑
 */
export function getHtmlFromStream(rawStr: string): string {
  if (!rawStr) return '';
  try {
    const data = parse(rawStr, Allow.ALL) as ParsedData | null;
    if (!data || typeof data !== 'object') return '';
    const blocks = data.blocks || [];
    const globalStyle = data.globalStyle || {};

    return blocks
      .map((block: Block) => {
        const s = block.style || {};
        const styleStr = [
          `text-align: ${s.textAlign || 'left'}`,
          `font-weight: ${s.fontWeight || 'normal'}`,
          `font-size: ${s.fontSize || globalStyle.fontSize || '16px'}`,
          `margin-top: ${s.marginTop || '0px'}`,
          `margin-bottom: ${s.marginBottom || '0px'}`,
          `line-height: ${globalStyle.lineHeight || '1.8'}`,
          `font-family: ${globalStyle.fontFamily || 'SimSun, 宋体, serif'}`,
        ].join(';');

        let contentHtml: string;
        const content = block.content;
        if (Array.isArray(content)) {
          contentHtml = content
            .map(
              (item: InlineItem) =>
                `<span style="font-weight: ${item.style?.fontWeight || 'inherit'}; font-size: ${item.style?.fontSize || 'inherit'}">${item.text || ''}</span>`
            )
            .join('');
        } else if (block.type === 'ol' || block.type === 'ul') {
          const listTag = block.type === 'ol' ? 'ol' : 'ul';
          const items =
            typeof content === 'object' && content !== null
              ? (content as { items?: string[] }).items || []
              : [];
          contentHtml = `<${listTag}>${items.map((i: string) => `<li>${i}</li>`).join('')}</${listTag}>`;
        } else {
          contentHtml = typeof content === 'string' ? content : (content as InlineItem)?.text || '';
        }
        return `<div style="${styleStr}">${contentHtml}</div>`;
      })
      .join('');
  } catch {
    return '';
  }
}

/**
 * 通用的下载 Blob 生成逻辑
 * 供开发者在外部按钮点击时调用
 */
export async function generateDocxBlob(jsonStr: string): Promise<Blob> {
  const data = parse(jsonStr) as ParsedData; // 下载时也使用容错解析，防止下载到一半的内容报错
  const { blocks = [], globalStyle = {} } = data;

  const children = blocks
    .map((block: Block) => {
      const style = block.style || {};

      // 文字生成逻辑
      const createTextRuns = (content: Block['content']) => {
        if (Array.isArray(content)) {
          return content.map(
            (c: InlineItem) =>
              new docx.TextRun({
                text: c.text,
                bold: c.style?.fontWeight === 'bold',
                size: c.style?.fontSize
                  ? parseInt(c.style.fontSize) * 2
                  : globalStyle.fontSize
                    ? parseInt(globalStyle.fontSize) * 2
                    : 32,
              })
          );
        }
        return [
          new docx.TextRun({
            text: typeof content === 'string' ? content : (content as InlineItem)?.text || '',
            bold: style.fontWeight === 'bold',
            size: style.fontSize
              ? parseInt(style.fontSize) * 2
              : globalStyle.fontSize
                ? parseInt(globalStyle.fontSize) * 2
                : 32,
          }),
        ];
      };

      if (block.type === 'ol' || block.type === 'ul') {
        const items = Array.isArray(block.content)
          ? []
          : (block.content as { items?: string[] })?.items || [];
        return items.map(
          (text: string) =>
            new docx.Paragraph({
              text,
              bullet: block.type === 'ul' ? { level: 0 } : undefined,
              numbering: block.type === 'ol' ? { reference: 'main-num', level: 0 } : undefined,
            })
        );
      }

      return new docx.Paragraph({
        children: createTextRuns(block.content),
        alignment:
          style.textAlign === 'center'
            ? docx.AlignmentType.CENTER
            : style.textAlign === 'right'
              ? docx.AlignmentType.RIGHT
              : docx.AlignmentType.LEFT,
        spacing: {
          before: style.marginTop ? parseInt(style.marginTop) * 20 : 0,
          after: style.marginBottom ? parseInt(style.marginBottom) * 20 : 0,
          line: globalStyle.lineHeight ? parseFloat(globalStyle.lineHeight) * 240 : 400,
        },
      });
    })
    .flat();

  const doc = new docx.Document({
    sections: [{ properties: {}, children }],
    numbering: {
      config: [
        {
          reference: 'main-num',
          levels: [
            { level: 0, format: 'decimal', text: '%1.', alignment: docx.AlignmentType.START },
          ],
        },
      ],
    },
  });

  return await docx.Packer.toBlob(doc);
}
