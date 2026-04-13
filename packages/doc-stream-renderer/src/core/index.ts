import { Allow, parse } from 'partial-json';
import * as docx from 'docx';

export type ParagraphChild = docx.ParagraphChild;
export type TextRunOptions = Exclude<ConstructorParameters<typeof docx.TextRun>[0], string>;
export type MutableTextRunOptions = { -readonly [K in keyof TextRunOptions]?: TextRunOptions[K] };
export type BorderStyleValue = (typeof docx.BorderStyle)[keyof typeof docx.BorderStyle];
export type VerticalAlignValue = (typeof docx.VerticalAlign)[keyof typeof docx.VerticalAlign];
export type WidthTypeValue = (typeof docx.WidthType)[keyof typeof docx.WidthType];
export type TextWrappingTypeValue =
  (typeof docx.TextWrappingType)[keyof typeof docx.TextWrappingType];
export type ParagraphBorders = {
  top?: docx.IBorderOptions;
  bottom?: docx.IBorderOptions;
  left?: docx.IBorderOptions;
  right?: docx.IBorderOptions;
};
export type MutablePartial<T> = { -readonly [K in keyof T]?: T[K] };

export interface InlineStyle {
  fontWeight?: string;
  fontSize?: string;
  fontStyle?: 'normal' | 'italic' | string;
  color?: string;
  textDecoration?: 'underline' | 'line-through' | string;
  backgroundColor?: string;
  verticalAlign?: 'super' | 'sub' | string;
  letterSpacing?: string;
  highlight?: string;
}

export interface InlineItem {
  text?: string;
  style?: InlineStyle;
  href?: string;
}

export interface BlockStyle {
  textAlign?: 'left' | 'center' | 'right' | string;
  fontWeight?: string;
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

export interface TableCell {
  content?: string | InlineItem[];
  colSpan?: number;
  rowSpan?: number;
  width?: string | number;
  textAlign?: 'left' | 'center' | 'right' | string;
  verticalAlign?: 'top' | 'middle' | 'bottom' | string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableContent {
  rows: TableRow[];
}

export interface ImageContent {
  src: string;
  width?: number;
  height?: number;
  wrap?: 'inline' | 'square' | 'tight' | 'topAndBottom' | 'behindText' | 'inFrontOfText';
}

export interface CodeContent {
  code: string;
  language?: string;
}

export interface ListContent {
  items?: string[];
  level?: number;
}

export type BlockContent =
  | string
  | InlineItem[]
  | ListContent
  | TableContent
  | ImageContent
  | CodeContent;

export type BlockType =
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
  | 'hr'
  | string;

export interface Block {
  type?: BlockType;
  style?: BlockStyle;
  content?: BlockContent;
}

export interface GlobalStyle {
  fontSize?: string;
  lineHeight?: string;
  fontFamily?: string;
}

export interface PageConfig {
  size?: 'A4' | 'Letter' | { width: number; height: number };
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

export interface DocumentMeta {
  title?: string;
  creator?: string;
  description?: string;
  subject?: string;
}

export interface ParsedData {
  blocks?: Block[];
  globalStyle?: GlobalStyle;
  page?: PageConfig;
  meta?: DocumentMeta;
}

function isHeading(type: BlockType | undefined): type is 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  return (
    type === 'h1' ||
    type === 'h2' ||
    type === 'h3' ||
    type === 'h4' ||
    type === 'h5' ||
    type === 'h6'
  );
}

function buildInlineHtml(items: InlineItem[]): string {
  return items
    .map(item => {
      const s = item.style || {};
      const styles = [
        `font-weight: ${s.fontWeight || 'inherit'}`,
        `font-size: ${s.fontSize || 'inherit'}`,
        `font-style: ${s.fontStyle || 'inherit'}`,
        `color: ${s.color || 'inherit'}`,
        s.textDecoration ? `text-decoration: ${s.textDecoration}` : '',
        s.backgroundColor ? `background-color: ${s.backgroundColor}` : '',
        s.verticalAlign ? `vertical-align: ${s.verticalAlign}` : '',
        s.letterSpacing ? `letter-spacing: ${s.letterSpacing}` : '',
        s.highlight ? `background-color: ${s.highlight}` : '',
      ]
        .filter(Boolean)
        .join('; ');
      const text = escapeHtml(item.text || '');
      if (item.href) {
        return `<a href="${escapeHtml(item.href)}" style="${styles};text-decoration:underline;color:#1890ff;">${text}</a>`;
      }
      return `<span style="${styles}">${text}</span>`;
    })
    .join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildBlockStyle(block: Block, globalStyle: GlobalStyle): string {
  const s = block.style || {};
  return [
    `text-align: ${s.textAlign || 'left'}`,
    `font-weight: ${s.fontWeight || 'normal'}`,
    `font-size: ${s.fontSize || globalStyle.fontSize || '16px'}`,
    `line-height: ${s.lineHeight || globalStyle.lineHeight || '1.8'}`,
    `font-family: ${s.fontFamily || globalStyle.fontFamily || 'SimSun, 宋体, serif'}`,
    s.color ? `color: ${s.color}` : '',
    s.backgroundColor ? `background-color: ${s.backgroundColor}` : '',
    `margin-top: ${s.marginTop || '0px'}`,
    `margin-bottom: ${s.marginBottom || '0px'}`,
    `margin-left: ${s.marginLeft || '0px'}`,
    `margin-right: ${s.marginRight || '0px'}`,
    s.padding ? `padding: ${s.padding}` : '',
    s.paddingTop ? `padding-top: ${s.paddingTop}` : '',
    s.paddingBottom ? `padding-bottom: ${s.paddingBottom}` : '',
    s.paddingLeft ? `padding-left: ${s.paddingLeft}` : '',
    s.paddingRight ? `padding-right: ${s.paddingRight}` : '',
    s.textIndent ? `text-indent: ${s.textIndent}` : '',
    s.borderTop ? `border-top: ${s.borderTop}` : '',
    s.borderBottom ? `border-bottom: ${s.borderBottom}` : '',
    s.borderLeft ? `border-left: ${s.borderLeft}` : '',
    s.borderRight ? `border-right: ${s.borderRight}` : '',
  ]
    .filter(Boolean)
    .join(';');
}

function renderTableHtml(content: TableContent): string {
  const rows = content.rows || [];
  const rowsHtml = rows
    .map(row => {
      const cells = row.cells || [];
      const cellsHtml = cells
        .map(cell => {
          const cellStyles = [
            'border:1px solid #ccc',
            'padding:8px',
            cell.width
              ? `width:${typeof cell.width === 'number' ? cell.width + 'px' : cell.width}`
              : '',
            cell.textAlign ? `text-align:${cell.textAlign}` : '',
            cell.verticalAlign ? `vertical-align:${cell.verticalAlign}` : '',
          ]
            .filter(Boolean)
            .join(';');
          return `<td colspan="${cell.colSpan || 1}" rowspan="${cell.rowSpan || 1}" style="${cellStyles}">${Array.isArray(cell.content) ? buildInlineHtml(cell.content) : escapeHtml((cell.content as string) || '')}</td>`;
        })
        .join('');
      return `<tr>${cellsHtml}</tr>`;
    })
    .join('');
  return `<table style="width:100%;border-collapse:collapse;border:1px solid #ccc;">${rowsHtml}</table>`;
}

function renderImageHtml(content: ImageContent): string {
  const { src, width, height, wrap } = content;
  const styleParts: string[] = ['max-width:100%;'];
  if (width) styleParts.push(`width:${width}px;`);
  if (height) styleParts.push(`height:${height}px;`);
  if (wrap && wrap !== 'inline') {
    if (wrap === 'topAndBottom') {
      styleParts.push('display:block;margin:10px auto;');
    } else {
      styleParts.push('float:left;margin:0 16px 10px 0;');
    }
  } else {
    styleParts.push('display:block;margin:0 auto;');
  }
  return `<img src="${escapeHtml(src)}" style="${styleParts.join('')}" />`;
}

function renderCodeHtml(content: CodeContent, globalStyle: GlobalStyle): string {
  const code = content.code || '';
  const lang = content.language || '';
  const style = `background:#f4f4f4;padding:12px;border-radius:4px;overflow-x:auto;font-family:'Courier New',monospace;font-size:${globalStyle.fontSize || '14px'};line-height:1.6;white-space:pre-wrap;`;
  return `<pre style="${style}"><code class="language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`;
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
        const type = block.type;
        const styleStr = buildBlockStyle(block, globalStyle);
        const content = block.content;

        // heading
        if (isHeading(type)) {
          const contentHtml = Array.isArray(content)
            ? buildInlineHtml(content)
            : escapeHtml((content as string) || '');
          return `<${type} style="margin:0;${styleStr}">${contentHtml}</${type}>`;
        }

        // paragraph / p
        if (type === 'p' || type === 'paragraph' || !type) {
          const contentHtml = Array.isArray(content)
            ? buildInlineHtml(content)
            : escapeHtml((content as string) || '');
          return `<p style="margin:0;${styleStr}">${contentHtml}</p>`;
        }

        // list
        if (type === 'ol' || type === 'ul') {
          const listTag = type === 'ol' ? 'ol' : 'ul';
          const listObj =
            typeof content === 'object' && content !== null && 'items' in content
              ? (content as ListContent)
              : { items: [] };
          const items = listObj.items || [];
          const level = listObj.level || 0;
          const indent = 24 + level * 24;
          const itemsHtml = items.map((i: string) => `<li>${escapeHtml(i)}</li>`).join('');
          return `<${listTag} style="margin:0;${styleStr};padding-left:${indent}px;">${itemsHtml}</${listTag}>`;
        }

        // table
        if (type === 'table') {
          const tableContent =
            typeof content === 'object' && content !== null && 'rows' in content
              ? (content as TableContent)
              : { rows: [] };
          const rows = tableContent.rows || [];
          if (rows.length === 0) return '';
          return `<div style="margin:0;${styleStr}">${renderTableHtml(tableContent)}</div>`;
        }

        // image / img
        if (type === 'image' || type === 'img') {
          const imgContent =
            typeof content === 'object' && content !== null && 'src' in content
              ? (content as ImageContent)
              : { src: '' };
          if (!imgContent.src) return '';
          const wrap = imgContent.wrap;
          if (wrap && wrap !== 'inline' && wrap !== 'topAndBottom') {
            return `<div style="margin:0;${styleStr};float:left;">${renderImageHtml(imgContent)}</div>`;
          }
          return `<div style="margin:0;${styleStr};">${renderImageHtml(imgContent)}</div>`;
        }

        // quote / blockquote
        if (type === 'quote' || type === 'blockquote') {
          const contentHtml = Array.isArray(content)
            ? buildInlineHtml(content)
            : escapeHtml((content as string) || '');
          return `<blockquote style="margin:0;${styleStr};padding-left:16px;border-left:4px solid #ccc;">${contentHtml}</blockquote>`;
        }

        // code
        if (type === 'code') {
          const codeContent =
            typeof content === 'object' && content !== null && 'code' in content
              ? (content as CodeContent)
              : { code: Array.isArray(content) ? '' : (content as string) || '' };
          return `<div style="margin:0;${styleStr}">${renderCodeHtml(codeContent, globalStyle)}</div>`;
        }

        // pageBreak
        if (type === 'pageBreak') {
          return `<div style="page-break-after:always;"></div>`;
        }

        // divider / hr
        if (type === 'divider' || type === 'hr') {
          return `<hr style="border:none;border-top:1px solid #ccc;margin:16px 0;" />`;
        }

        // fallback
        const fallbackHtml = Array.isArray(content)
          ? buildInlineHtml(content)
          : escapeHtml((content as string) || '');
        return `<div style="margin:0;${styleStr}">${fallbackHtml}</div>`;
      })
      .join('');
  } catch {
    return '';
  }
}

// DOCX helpers
function halfPointFromPx(pxStr: string | undefined, fallbackPt = 16): number {
  if (!pxStr) return fallbackPt * 2;
  const px = parseInt(pxStr, 10);
  if (Number.isNaN(px)) return fallbackPt * 2;
  // approximate 1px ≈ 0.75pt
  return Math.round(px * 0.75 * 2);
}

function twipsFromPx(pxStr: string | undefined): number {
  if (!pxStr) return 0;
  const px = parseInt(pxStr, 10);
  if (Number.isNaN(px)) return 0;
  return Math.round(px * 15);
}

function normalizeHexColor(color?: string): string | undefined {
  if (!color) return undefined;
  let hex = color.replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  return hex;
}

function createTextRuns(
  content: BlockContent,
  globalStyle: GlobalStyle,
  blockStyle: BlockStyle,
  defaultColor?: string
): ParagraphChild[] {
  const resolveColor = (color?: string) => normalizeHexColor(color);
  const resolveFont = () => blockStyle.fontFamily || globalStyle.fontFamily;
  const resolveSize = (size?: string) =>
    size ? halfPointFromPx(size) : halfPointFromPx(globalStyle.fontSize);

  if (Array.isArray(content)) {
    return content.map((c: InlineItem) => {
      const s = c.style || {};
      const runConfig: MutableTextRunOptions = {
        text: c.text || '',
        bold: s.fontWeight === 'bold',
        italics: s.fontStyle === 'italic',
        size: resolveSize(s.fontSize),
        color:
          resolveColor(s.color) || resolveColor(defaultColor) || resolveColor(blockStyle.color),
        font: resolveFont(),
      };
      if (s.textDecoration === 'underline') {
        runConfig.underline = { type: docx.UnderlineType.SINGLE };
      } else if (s.textDecoration === 'line-through') {
        runConfig.strike = true;
      }
      if (s.backgroundColor) {
        runConfig.shading = { fill: normalizeHexColor(s.backgroundColor) };
      }
      if (s.verticalAlign === 'super') {
        runConfig.superScript = true;
      } else if (s.verticalAlign === 'sub') {
        runConfig.subScript = true;
      }
      if (s.letterSpacing) {
        const lsPx = parseInt(s.letterSpacing, 10);
        if (!Number.isNaN(lsPx)) {
          runConfig.characterSpacing = lsPx * 20;
        }
      }
      if (s.highlight) {
        runConfig.highlight = s.highlight as never;
      }

      const textRun = new docx.TextRun(runConfig);
      if (c.href) {
        return new docx.ExternalHyperlink({ children: [textRun], link: c.href });
      }
      return textRun;
    });
  }
  const text = typeof content === 'string' ? content : (content as InlineItem)?.text || '';
  const runConfig: MutableTextRunOptions = {
    text,
    bold: blockStyle.fontWeight === 'bold',
    size: resolveSize(blockStyle.fontSize),
    color: resolveColor(defaultColor) || resolveColor(blockStyle.color),
    font: resolveFont(),
  };
  return [new docx.TextRun(runConfig)];
}

function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(cleanBase64, 'base64'));
  }
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function cellVerticalAlign(align?: string): VerticalAlignValue {
  if (align === 'top') return docx.VerticalAlign.TOP;
  if (align === 'bottom') return docx.VerticalAlign.BOTTOM;
  return docx.VerticalAlign.CENTER;
}

function cellWidth(width?: string | number): { size: number; type: WidthTypeValue } | undefined {
  if (width === undefined) return undefined;
  if (typeof width === 'string') {
    if (width.endsWith('%')) {
      const pct = parseFloat(width);
      if (!Number.isNaN(pct)) return { size: pct, type: docx.WidthType.PERCENTAGE };
    }
    const px = parseInt(width, 10);
    if (!Number.isNaN(px)) return { size: px * 20, type: docx.WidthType.DXA };
  }
  if (typeof width === 'number') {
    if (width <= 100) return { size: width, type: docx.WidthType.PERCENTAGE };
    return { size: width * 20, type: docx.WidthType.DXA };
  }
  return undefined;
}

function createDocxTable(content: TableContent, globalStyle: GlobalStyle): docx.Table {
  const rows = (content.rows || []).map(
    row =>
      new docx.TableRow({
        children: (row.cells || []).map(cell => {
          const cellAlign =
            cell.textAlign === 'center'
              ? docx.AlignmentType.CENTER
              : cell.textAlign === 'right'
                ? docx.AlignmentType.RIGHT
                : docx.AlignmentType.LEFT;
          return new docx.TableCell({
            children: [
              new docx.Paragraph({
                children: Array.isArray(cell.content)
                  ? createTextRuns(cell.content, globalStyle, {})
                  : createTextRuns(cell.content || '', globalStyle, {}),
                alignment: cellAlign,
              }),
            ],
            columnSpan: cell.colSpan,
            rowSpan: cell.rowSpan,
            verticalAlign: cellVerticalAlign(cell.verticalAlign),
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            borders: {
              top: { style: docx.BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
              bottom: { style: docx.BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
              left: { style: docx.BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
              right: { style: docx.BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            },
            width: cellWidth(cell.width),
          });
        }),
      })
  );
  return new docx.Table({
    rows,
    width: { size: 100, type: docx.WidthType.PERCENTAGE },
  });
}

function parseBorderStyle(borderStr?: string): docx.IBorderOptions | undefined {
  if (!borderStr) return undefined;
  const parts = borderStr.trim().split(/\s+/);
  if (parts.length < 3) return undefined;
  const sizePx = parseInt(parts[0], 10);
  const styleName = parts[1];
  const color = normalizeHexColor(parts[2]);
  let style: BorderStyleValue = docx.BorderStyle.SINGLE;
  if (styleName === 'dashed') style = docx.BorderStyle.DASHED;
  else if (styleName === 'dotted') style = docx.BorderStyle.DOTTED;
  else if (styleName === 'double') style = docx.BorderStyle.DOUBLE;
  return {
    color,
    space: 1,
    style,
    size: Math.max(1, Math.round(sizePx * 6)),
  };
}

function buildParagraphBorder(style: BlockStyle) {
  const border: ParagraphBorders = {};
  if (style.borderTop) border.top = parseBorderStyle(style.borderTop);
  if (style.borderBottom) border.bottom = parseBorderStyle(style.borderBottom);
  if (style.borderLeft) border.left = parseBorderStyle(style.borderLeft);
  if (style.borderRight) border.right = parseBorderStyle(style.borderRight);
  return Object.keys(border).length > 0 ? border : undefined;
}

function imageFloating(wrap?: string): Partial<docx.IFloating> | undefined {
  if (!wrap || wrap === 'inline') return undefined;
  const wrapTypeMap: Record<string, TextWrappingTypeValue> = {
    square: docx.TextWrappingType.SQUARE,
    tight: docx.TextWrappingType.TIGHT,
    topAndBottom: docx.TextWrappingType.TOP_AND_BOTTOM,
  };
  const floatConfig: MutablePartial<docx.IFloating> = {
    margins: { top: 144000, bottom: 144000, left: 180000, right: 180000 },
    wrap: {
      type: wrapTypeMap[wrap] || docx.TextWrappingType.NONE,
      side: docx.TextWrappingSide.BOTH_SIDES,
    },
    horizontalPosition: {
      relative: docx.HorizontalPositionRelativeFrom.COLUMN,
      align: docx.HorizontalPositionAlign.LEFT,
    },
    verticalPosition: {
      relative: docx.VerticalPositionRelativeFrom.PARAGRAPH,
      align: docx.VerticalPositionAlign.TOP,
    },
  };
  if (wrap === 'behindText') {
    floatConfig.behindDocument = true;
  }
  return floatConfig;
}

/**
 * 通用的下载 Blob 生成逻辑
 * 供开发者在外部按钮点击时调用
 */
export async function generateDocxBlob(jsonStr: string): Promise<Blob> {
  try {
    const data = parse(jsonStr, Allow.ALL) as ParsedData | null;
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data');
    }
    const { blocks = [], globalStyle = {}, page, meta } = data;

    const children: (docx.Paragraph | docx.Table)[] = [];

    function pageSizeConfig(size?: PageConfig['size']) {
      if (size === 'Letter') return { width: 12240, height: 15840 };
      if (typeof size === 'object' && size) return size;
      return { width: 11906, height: 16838 };
    }

    blocks.forEach((block: Block) => {
      const style = block.style || {};
      const type = block.type;
      const content = block.content;

      const commonSpacing = {
        before: twipsFromPx(style.marginTop),
        after: twipsFromPx(style.marginBottom),
        line: style.lineHeight
          ? parseFloat(style.lineHeight) * 240
          : globalStyle.lineHeight
            ? parseFloat(globalStyle.lineHeight) * 240
            : 400,
      };

      const paragraphShading = style.backgroundColor
        ? { fill: normalizeHexColor(style.backgroundColor) }
        : undefined;

      const paragraphIndent: MutablePartial<docx.IIndentAttributesProperties> = {};
      if (style.textIndent) {
        paragraphIndent.firstLine = twipsFromPx(style.textIndent);
      }
      const finalIndent =
        Object.keys(paragraphIndent).length > 0
          ? (paragraphIndent as docx.IIndentAttributesProperties)
          : undefined;

      const customBorder = buildParagraphBorder(style);

      const alignment =
        style.textAlign === 'center'
          ? docx.AlignmentType.CENTER
          : style.textAlign === 'right'
            ? docx.AlignmentType.RIGHT
            : docx.AlignmentType.LEFT;

      // heading
      if (isHeading(type)) {
        const headingMap: Record<
          string,
          'Heading1' | 'Heading2' | 'Heading3' | 'Heading4' | 'Heading5' | 'Heading6'
        > = {
          h1: 'Heading1',
          h2: 'Heading2',
          h3: 'Heading3',
          h4: 'Heading4',
          h5: 'Heading5',
          h6: 'Heading6',
        };
        children.push(
          new docx.Paragraph({
            children: createTextRuns(content || '', globalStyle, style, '000000'),
            heading: headingMap[type],
            alignment,
            spacing: commonSpacing,
            shading: paragraphShading,
            indent: finalIndent,
            border: customBorder,
          })
        );
        return;
      }

      // list
      if (type === 'ol' || type === 'ul') {
        const listObj =
          typeof content === 'object' && content !== null && 'items' in content
            ? (content as ListContent)
            : { items: [] };
        const items = listObj.items || [];
        const level = Math.min(Math.max(listObj.level || 0, 0), 9);
        items.forEach((text: string) => {
          children.push(
            new docx.Paragraph({
              children: createTextRuns(text || '', globalStyle, style),
              bullet: type === 'ul' ? { level } : undefined,
              numbering: type === 'ol' ? { reference: 'main-num', level } : undefined,
              alignment,
              spacing: commonSpacing,
              shading: paragraphShading,
              indent: finalIndent,
              border: customBorder,
            })
          );
        });
        return;
      }

      // table
      if (type === 'table') {
        const tableContent =
          typeof content === 'object' && content !== null && 'rows' in content
            ? (content as TableContent)
            : { rows: [] };
        if (tableContent.rows && tableContent.rows.length > 0) {
          children.push(createDocxTable(tableContent, globalStyle));
        }
        return;
      }

      // image / img
      if (
        (type === 'image' || type === 'img') &&
        typeof content === 'object' &&
        content !== null &&
        'src' in content
      ) {
        const imgContent = content as ImageContent;
        if (imgContent.src) {
          try {
            const imageBuffer = base64ToUint8Array(imgContent.src);
            const width = imgContent.width || 400;
            const height = imgContent.height || 300;
            children.push(
              new docx.Paragraph({
                children: [
                  new docx.ImageRun({
                    data: imageBuffer,
                    transformation: { width, height },
                    type: (() => {
                      const src = imgContent.src || '';
                      if (src.includes('data:image/png')) return 'png';
                      if (src.includes('data:image/jpeg') || src.includes('data:image/jpg'))
                        return 'jpg';
                      return 'png';
                    })(),
                    floating: imageFloating(imgContent.wrap) as docx.IFloating,
                  }),
                ],
                alignment,
                spacing: commonSpacing,
                shading: paragraphShading,
                indent: finalIndent,
                border: customBorder,
              })
            );
          } catch {
            // ignore invalid image
          }
        }
        return;
      }

      // quote / blockquote
      if (type === 'quote' || type === 'blockquote') {
        const quoteBorder = customBorder || {};
        if (!quoteBorder.left) {
          quoteBorder.left = {
            color: 'CCCCCC',
            space: 8,
            style: docx.BorderStyle.SINGLE,
            size: 12,
          };
        }
        children.push(
          new docx.Paragraph({
            children: createTextRuns(content || '', globalStyle, style),
            alignment,
            spacing: commonSpacing,
            indent: finalIndent || { left: twipsFromPx('16px') || 240 },
            border: quoteBorder,
            shading: paragraphShading,
          })
        );
        return;
      }

      // code
      if (type === 'code') {
        const codeObj =
          typeof content === 'object' && content !== null && 'code' in content
            ? (content as CodeContent)
            : { code: typeof content === 'string' ? content : '' };
        const codeText = codeObj.code || '';
        const lines = codeText.split('\n');
        const codeRuns = lines.map(
          (line, i) =>
            new docx.TextRun({
              text: line,
              font: 'Courier New',
              size: halfPointFromPx(globalStyle.fontSize, 14),
              break: i > 0 ? 1 : undefined,
            })
        );
        children.push(
          new docx.Paragraph({
            children: codeRuns,
            alignment,
            spacing: commonSpacing,
            shading: paragraphShading || { fill: 'F4F4F4' },
            indent: finalIndent,
            border: customBorder,
          })
        );
        return;
      }

      // pageBreak
      if (type === 'pageBreak') {
        children.push(
          new docx.Paragraph({
            children: [new docx.PageBreak()],
          })
        );
        return;
      }

      // divider / hr
      if (type === 'divider' || type === 'hr') {
        children.push(
          new docx.Paragraph({
            border: {
              bottom: {
                color: 'CCCCCC',
                space: 1,
                style: docx.BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { before: 240, after: 240 },
          })
        );
        return;
      }

      // default paragraph / p / fallback
      children.push(
        new docx.Paragraph({
          children: createTextRuns(content || '', globalStyle, style),
          alignment,
          spacing: commonSpacing,
          shading: paragraphShading,
          indent: finalIndent,
          border: customBorder,
        })
      );
    });

    const sectionProps: {
      page?: {
        size?: { width: number; height: number };
        margin?: { top: number; right: number; bottom: number; left: number };
        orientation?: typeof docx.PageOrientation.LANDSCAPE;
      };
    } = {
      page: {
        size: pageSizeConfig(page?.size),
        margin: {
          top: twipsFromPx(page?.margin?.top) || 1440,
          right: twipsFromPx(page?.margin?.right) || 1440,
          bottom: twipsFromPx(page?.margin?.bottom) || 1440,
          left: twipsFromPx(page?.margin?.left) || 1440,
        },
      },
    };
    if (sectionProps.page && page?.orientation === 'landscape') {
      sectionProps.page.orientation = docx.PageOrientation.LANDSCAPE;
    }

    const doc = new docx.Document({
      sections: [
        {
          properties: sectionProps,
          children,
        },
      ],
      numbering: {
        config: [
          {
            reference: 'main-num',
            levels: Array.from({ length: 10 }).map((_, i) => ({
              level: i,
              format: 'decimal',
              text: '%1.',
              alignment: docx.AlignmentType.START,
            })),
          },
        ],
      },
      creator: meta?.creator,
      title: meta?.title,
      description: meta?.description,
      subject: meta?.subject,
    });

    return await docx.Packer.toBlob(doc);
  } catch (error) {
    return Promise.reject(error);
  }
}
