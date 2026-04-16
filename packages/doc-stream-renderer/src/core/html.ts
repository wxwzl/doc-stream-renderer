import { Allow, parse } from 'partial-json';
import type {
  Block,
  BlockStyle,
  CodeContent,
  GlobalStyle,
  ImageContent,
  InlineItem,
  ListContent,
  ParsedData,
  TableContent,
} from './types';
import { escapeHtml, isArray, isNumber, isObject } from './utils';

function buildContentHtml(content: unknown): string {
  return isArray(content)
    ? buildInlineHtml(content as InlineItem[])
    : escapeHtml((content as string) || '');
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

function renderTableElement(content: TableContent): string {
  const rows = content.rows || [];
  const rowsHtml = rows
    .map(row => {
      const cells = row.cells || [];
      const cellsHtml = cells
        .map(cell => {
          const cellStyles = [
            'border:1px solid #ccc',
            'padding:8px',
            cell.width ? `width:${isNumber(cell.width) ? cell.width + 'px' : cell.width}` : '',
            cell.textAlign ? `text-align:${cell.textAlign}` : '',
            cell.verticalAlign ? `vertical-align:${cell.verticalAlign}` : '',
          ]
            .filter(Boolean)
            .join(';');
          return `<td colspan="${cell.colSpan || 1}" rowspan="${cell.rowSpan || 1}" style="${cellStyles}">${isArray(cell.content) ? buildInlineHtml(cell.content) : escapeHtml((cell.content as string) || '')}</td>`;
        })
        .join('');
      return `<tr>${cellsHtml}</tr>`;
    })
    .join('');
  return `<table style="width:100%;border-collapse:collapse;border:1px solid #ccc;">${rowsHtml}</table>`;
}

function renderImageElement(content: ImageContent): string {
  const { src, width, height, wrap } = content;
  const styleParts: string[] = ['max-width:100%;'];
  if (width) styleParts.push(`width:${isNumber(width) ? width + 'px' : width};`);
  if (height) styleParts.push(`height:${isNumber(height) ? height + 'px' : height};`);
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

function renderCodeElement(
  content: CodeContent,
  globalStyle: GlobalStyle,
  blockStyle?: BlockStyle
): string {
  const code = content.code || '';
  const lang = content.language || '';
  const lineHeight = blockStyle?.lineHeight || globalStyle.lineHeight || '1.6';
  const fontSize = blockStyle?.fontSize || globalStyle.fontSize || '14px';
  const style = `background:#f4f4f4;padding:12px;border-radius:4px;overflow-x:auto;font-family:'Courier New',monospace;font-size:${fontSize};line-height:${lineHeight};white-space:pre-wrap;`;
  return `<pre style="${style}"><code class="language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`;
}

function renderHeadingHtml(block: Block, globalStyle: GlobalStyle): string {
  const type = block.type!;
  const styleStr = buildBlockStyle(block, globalStyle);
  return `<${type} style="margin:0;${styleStr}">${buildContentHtml(block.content)}</${type}>`;
}

function renderParagraphHtml(block: Block, globalStyle: GlobalStyle): string {
  const styleStr = buildBlockStyle(block, globalStyle);
  return `<p style="margin:0;${styleStr}">${buildContentHtml(block.content)}</p>`;
}

function renderListHtml(block: Block, globalStyle: GlobalStyle, olCounters: number[]): string {
  const type = block.type!;
  const styleStr = buildBlockStyle(block, globalStyle);
  const content = block.content;
  const listObj = isObject<ListContent>(content) && 'items' in content ? content : { items: [] };
  const items = listObj.items || [];
  const level = Math.max(0, Math.min(10, listObj.level || 0));
  const indent = listObj.indent || block.style?.paddingLeft || `${24 + level * 24}px`;
  const itemsHtml = items
    .map((i: string) => {
      if (type === 'ol') {
        olCounters.length = level + 1;
        olCounters[level] = (olCounters[level] || 0) + 1;
        const prefix = olCounters.slice(0, level + 1).join('.') + '. ';
        return `<li style="list-style:none;">${prefix}${escapeHtml(i)}</li>`;
      }
      return `<li>${escapeHtml(i)}</li>`;
    })
    .join('');
  return `<${type} style="margin:0;${styleStr};padding-left:${indent};">${itemsHtml}</${type}>`;
}

function renderTableBlockHtml(block: Block, globalStyle: GlobalStyle): string {
  const styleStr = buildBlockStyle(block, globalStyle);
  const content = block.content;
  const tableContent =
    isObject<TableContent>(content) && 'rows' in content ? content : { rows: [] };
  const rows = tableContent.rows || [];
  if (rows.length === 0) return '';
  return `<div style="margin:0;${styleStr}">${renderTableElement(tableContent)}</div>`;
}

function renderImageBlockHtml(block: Block, globalStyle: GlobalStyle): string {
  const styleStr = buildBlockStyle(block, globalStyle);
  const content = block.content;
  const imgContent = isObject<ImageContent>(content) && 'src' in content ? content : { src: '' };
  if (!imgContent.src) return '';
  const wrap = imgContent.wrap;
  if (wrap && wrap !== 'inline' && wrap !== 'topAndBottom') {
    return `<div style="margin:0;${styleStr};float:left;">${renderImageElement(imgContent)}</div>`;
  }
  return `<div style="margin:0;${styleStr};">${renderImageElement(imgContent)}</div>`;
}

function renderQuoteHtml(block: Block, globalStyle: GlobalStyle): string {
  const styleStr = buildBlockStyle(block, globalStyle);
  return `<blockquote style="margin:0;${styleStr};padding-left:16px;border-left:4px solid #ccc;">${buildContentHtml(block.content)}</blockquote>`;
}

function renderCodeBlockHtml(block: Block, globalStyle: GlobalStyle): string {
  const styleStr = buildBlockStyle(block, globalStyle);
  const content = block.content;
  const codeContent =
    isObject<CodeContent>(content) && 'code' in content
      ? content
      : { code: isArray(content) ? '' : (content as string) || '' };
  return `<div style="margin:0;${styleStr}">${renderCodeElement(codeContent, globalStyle, block.style || {})}</div>`;
}

function renderPageBreakHtml(): string {
  return `<div style="page-break-after:always;"></div>`;
}

function renderDividerHtml(): string {
  return `<hr style="border:none;border-top:1px solid #ccc;margin:16px 0;" />`;
}

function renderFallbackHtml(block: Block, globalStyle: GlobalStyle): string {
  const styleStr = buildBlockStyle(block, globalStyle);
  return `<div style="margin:0;${styleStr}">${buildContentHtml(block.content)}</div>`;
}

/**
 * 预览 HTML 生成逻辑
 */
export function getHtmlFromStream(rawStr: string): string {
  if (!rawStr) return '';
  try {
    const data = parse(rawStr, Allow.ALL) as ParsedData | null;
    if (!data || !isObject(data)) return '';
    const blocks = data.blocks || [];
    const globalStyle = data.globalStyle || {};

    const olCounters: number[] = [];

    return blocks
      .map((block: Block) => {
        const type = block.type;
        if (!type) {
          return renderParagraphHtml(block, globalStyle);
        }

        switch (type) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return renderHeadingHtml(block, globalStyle);
          case 'p':
          case 'paragraph':
            return renderParagraphHtml(block, globalStyle);
          case 'ol':
          case 'ul':
            return renderListHtml(block, globalStyle, olCounters);
          case 'table':
            return renderTableBlockHtml(block, globalStyle);
          case 'image':
          case 'img':
            return renderImageBlockHtml(block, globalStyle);
          case 'quote':
          case 'blockquote':
            return renderQuoteHtml(block, globalStyle);
          case 'code':
            return renderCodeBlockHtml(block, globalStyle);
          case 'pageBreak':
            return renderPageBreakHtml();
          case 'divider':
          case 'hr':
            return renderDividerHtml();
          default:
            return renderFallbackHtml(block, globalStyle);
        }
      })
      .join('');
  } catch (err) {
    console.error('[getHtmlFromStream] error:', err);
    return '';
  }
}
