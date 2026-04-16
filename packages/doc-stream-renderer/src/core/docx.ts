import { Allow, parse } from 'partial-json';
import * as docx from 'docx';
import type {
  Block,
  BlockContent,
  BlockStyle,
  CodeContent,
  GlobalStyle,
  ImageContent,
  InlineItem,
  ListContent,
  MutablePartial,
  MutableTextRunOptions,
  PageConfig,
  ParagraphBorders,
  ParsedData,
  TableContent,
  TextWrappingTypeValue,
} from './types';
import {
  base64ToUint8Array,
  cellVerticalAlign,
  cellWidth,
  DEFAULT_FONT_SIZE_PT,
  halfPointFromSize,
  isArray,
  isObject,
  isString,
  normalizeHexColor,
  parseBorderStyle,
  resolveLength,
  twipsFromSize,
} from './utils';

const HEADING_MAP: Record<
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

function createTextRuns(
  content: BlockContent,
  globalStyle: GlobalStyle,
  blockStyle: BlockStyle,
  defaultColor?: string
): docx.ParagraphChild[] {
  const resolveColor = (color?: string) => normalizeHexColor(color);
  const resolveFont = () => blockStyle.fontFamily || globalStyle.fontFamily;
  const resolveSize = (size?: string) =>
    size ? halfPointFromSize(size) : halfPointFromSize(blockStyle.fontSize || globalStyle.fontSize);

  if (isArray(content)) {
    return content.flatMap((c: InlineItem) => {
      const s = c.style || {};
      // 将文本中的 \n 拆分为多个 TextRun，防止 Word 把 <w:t> 中的换行符渲染成软回车（导致多出空行）
      const lines = (c.text || '').split('\n');
      // 去掉末尾因 \n 产生的空项，避免在 Word 中多出一行空白
      while (lines.length > 0 && lines[lines.length - 1] === '') {
        lines.pop();
      }
      return lines.map((line, i) => {
        const runConfig: MutableTextRunOptions = {
          text: line,
          bold: s.fontWeight === 'bold',
          italics: s.fontStyle === 'italic',
          size: resolveSize(s.fontSize),
          color:
            resolveColor(s.color) || resolveColor(blockStyle.color) || resolveColor(defaultColor),
          font: resolveFont(),
          break: i > 0 ? 1 : undefined,
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
          const currentFontSizePt =
            resolveLength(s.fontSize) ||
            resolveLength(blockStyle.fontSize) ||
            resolveLength(globalStyle.fontSize) ||
            DEFAULT_FONT_SIZE_PT;
          const lsPt = resolveLength(s.letterSpacing, currentFontSizePt);
          if (!Number.isNaN(lsPt)) {
            runConfig.characterSpacing = Math.round(lsPt * 20);
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
    });
  }
  const text = isString(content) ? content : (content as InlineItem)?.text || '';
  // 同样将字符串中的 \n 拆分为多个 TextRun，避免 Word 中出现多余的软回车
  const lines = text.split('\n');
  // 去掉末尾因 \n 产生的空项，避免在 Word 中多出一行空白
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  const runConfigBase: MutableTextRunOptions = {
    bold: blockStyle.fontWeight === 'bold',
    size: resolveSize(blockStyle.fontSize),
    color: resolveColor(blockStyle.color) || resolveColor(defaultColor),
    font: resolveFont(),
  };
  return lines.map(
    (line, i) => new docx.TextRun({ ...runConfigBase, text: line, break: i > 0 ? 1 : undefined })
  );
}

function buildParagraphSpacing(globalStyle: GlobalStyle, blockStyle: BlockStyle = {}) {
  const spacing: {
    before: number;
    after: number;
    line: number;
    lineRule?: typeof docx.LineRuleType.EXACT;
  } = {
    before: 0,
    after: 0,
    line: 400,
  };
  const lh = blockStyle.lineHeight || globalStyle.lineHeight;
  if (lh) {
    const trimmed = lh.trim();
    if (/^[\d.]+(px|pt|em)$/i.test(trimmed)) {
      const baseFontSizePt = resolveLength(blockStyle.fontSize || globalStyle.fontSize);
      const pt = resolveLength(trimmed, baseFontSizePt);
      spacing.line = Math.round(pt * 20);
      spacing.lineRule = docx.LineRuleType.EXACT;
    } else {
      const num = parseFloat(trimmed);
      if (!Number.isNaN(num)) {
        spacing.line = Math.round(num * 240);
      }
    }
  }
  if (spacing.line && !spacing.lineRule && lh) {
    const num = parseFloat(lh);
    if (!Number.isNaN(num)) {
      const baseFontSizePt =
        resolveLength(blockStyle.fontSize || globalStyle.fontSize) || DEFAULT_FONT_SIZE_PT;
      spacing.line = Math.round(baseFontSizePt * num * 20);
      spacing.lineRule = docx.LineRuleType.EXACT;
    }
  }
  return spacing;
}

function createDocxTable(
  content: TableContent,
  globalStyle: GlobalStyle,
  blockStyle: BlockStyle = {}
): docx.Table {
  const tableCellSpacing = buildParagraphSpacing(globalStyle, blockStyle);
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
                children: isArray(cell.content)
                  ? createTextRuns(cell.content, globalStyle, {})
                  : createTextRuns(cell.content || '', globalStyle, {}),
                alignment: cellAlign,
                spacing: tableCellSpacing,
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

type BlockRenderResult = docx.Paragraph | docx.Table;

function buildBlockContext(globalStyle: GlobalStyle, style: BlockStyle) {
  const spacing = buildParagraphSpacing(globalStyle, style);
  spacing.before = twipsFromSize(style.marginTop);
  spacing.after = twipsFromSize(style.marginBottom);

  const shading = style.backgroundColor
    ? { fill: normalizeHexColor(style.backgroundColor) }
    : undefined;

  const indent: MutablePartial<docx.IIndentAttributesProperties> = {};
  if (style.textIndent) {
    indent.firstLine = twipsFromSize(style.textIndent);
  }
  const finalIndent =
    Object.keys(indent).length > 0 ? (indent as docx.IIndentAttributesProperties) : undefined;

  const border = buildParagraphBorder(style);

  const alignment =
    style.textAlign === 'center'
      ? docx.AlignmentType.CENTER
      : style.textAlign === 'right'
        ? docx.AlignmentType.RIGHT
        : docx.AlignmentType.LEFT;

  return { spacing, shading, indent: finalIndent, border, alignment };
}

function renderHeadingDocx(block: Block, globalStyle: GlobalStyle): BlockRenderResult[] {
  const style = block.style || {};
  const ctx = buildBlockContext(globalStyle, style);
  return [
    new docx.Paragraph({
      children: createTextRuns(block.content || '', globalStyle, style, '000000'),
      heading: HEADING_MAP[block.type!],
      alignment: ctx.alignment,
      spacing: ctx.spacing,
      shading: ctx.shading,
      indent: ctx.indent,
      border: ctx.border,
    }),
  ];
}

function renderListDocx(block: Block, globalStyle: GlobalStyle): BlockRenderResult[] {
  const style = block.style || {};
  const ctx = buildBlockContext(globalStyle, style);
  const type = block.type!;
  const content = block.content;
  const listObj = isObject<ListContent>(content) && 'items' in content ? content : { items: [] };
  const items = listObj.items || [];
  const level = Math.min(Math.max(listObj.level || 0, 0), 9);
  const listIndentStr = listObj.indent || style.paddingLeft;
  const listIndentTwips = listIndentStr ? twipsFromSize(listIndentStr) : 0;
  const indent = listIndentTwips
    ? { left: listIndentTwips, hanging: Math.round(listIndentTwips / 2) }
    : ctx.indent;
  return items.map(
    (text: string) =>
      new docx.Paragraph({
        children: createTextRuns(text || '', globalStyle, style),
        bullet: type === 'ul' ? { level } : undefined,
        numbering: type === 'ol' ? { reference: 'main-num', level } : undefined,
        alignment: ctx.alignment,
        spacing: ctx.spacing,
        shading: ctx.shading,
        indent,
        border: ctx.border,
      })
  );
}

function renderTableDocx(block: Block, globalStyle: GlobalStyle): BlockRenderResult[] {
  const style = block.style || {};
  const content = block.content;
  const tableContent =
    isObject<TableContent>(content) && 'rows' in content ? content : { rows: [] };
  if (tableContent.rows && tableContent.rows.length > 0) {
    return [createDocxTable(tableContent, globalStyle, style)];
  }
  return [];
}

function renderImageDocx(block: Block, globalStyle: GlobalStyle): BlockRenderResult[] {
  const style = block.style || {};
  const ctx = buildBlockContext(globalStyle, style);
  const content = block.content;
  if (!isObject<ImageContent>(content) || !('src' in content) || !content.src) {
    return [];
  }
  try {
    const imageBuffer = base64ToUint8Array(content.src);
    const width = content.width || 400;
    const height = content.height || 300;
    return [
      new docx.Paragraph({
        children: [
          new docx.ImageRun({
            data: imageBuffer,
            transformation: { width, height },
            type: (() => {
              const src = content.src || '';
              if (src.includes('data:image/png')) return 'png';
              if (src.includes('data:image/jpeg') || src.includes('data:image/jpg')) return 'jpg';
              return 'png';
            })(),
            floating: imageFloating(content.wrap) as docx.IFloating,
          }),
        ],
        alignment: ctx.alignment,
        spacing: ctx.spacing,
        shading: ctx.shading,
        indent: ctx.indent,
        border: ctx.border,
      }),
    ];
  } catch {
    return [];
  }
}

function renderQuoteDocx(block: Block, globalStyle: GlobalStyle): BlockRenderResult[] {
  const style = block.style || {};
  const ctx = buildBlockContext(globalStyle, style);
  const quoteBorder = ctx.border || {};
  if (!quoteBorder.left) {
    quoteBorder.left = {
      color: 'CCCCCC',
      space: 8,
      style: docx.BorderStyle.SINGLE,
      size: 12,
    };
  }
  return [
    new docx.Paragraph({
      children: createTextRuns(block.content || '', globalStyle, style),
      alignment: ctx.alignment,
      spacing: ctx.spacing,
      indent: ctx.indent || { left: twipsFromSize('16px') || 240 },
      border: quoteBorder,
      shading: ctx.shading,
    }),
  ];
}

function renderCodeDocx(block: Block, globalStyle: GlobalStyle): BlockRenderResult[] {
  const style = block.style || {};
  const ctx = buildBlockContext(globalStyle, style);
  const content = block.content;
  const codeObj =
    isObject<CodeContent>(content) && 'code' in content
      ? (content as { code: string })
      : { code: typeof content === 'string' ? content : '' };
  const codeText = codeObj.code || '';
  const lines = codeText.split('\n');
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  const codeRuns = lines.map(
    (line, i) =>
      new docx.TextRun({
        text: line,
        font: 'Courier New',
        size: halfPointFromSize(globalStyle.fontSize, 14),
        break: i > 0 ? 1 : undefined,
      })
  );
  return [
    new docx.Paragraph({
      children: codeRuns,
      alignment: ctx.alignment,
      spacing: ctx.spacing,
      shading: ctx.shading || { fill: 'F4F4F4' },
      indent: ctx.indent,
      border: ctx.border,
    }),
  ];
}

function renderPageBreakDocx(): BlockRenderResult[] {
  return [
    new docx.Paragraph({
      children: [new docx.PageBreak()],
    }),
  ];
}

function renderDividerDocx(): BlockRenderResult[] {
  return [
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
    }),
  ];
}

function renderFallbackDocx(block: Block, globalStyle: GlobalStyle): BlockRenderResult[] {
  const style = block.style || {};
  const ctx = buildBlockContext(globalStyle, style);
  return [
    new docx.Paragraph({
      children: createTextRuns(block.content || '', globalStyle, style),
      alignment: ctx.alignment,
      spacing: ctx.spacing,
      shading: ctx.shading,
      indent: ctx.indent,
      border: ctx.border,
    }),
  ];
}

/**
 * 通用的下载 Blob 生成逻辑
 * 供开发者在外部按钮点击时调用
 */
export async function generateDocxBlob(jsonStr: string): Promise<Blob> {
  try {
    const data = parse(jsonStr, Allow.ALL) as ParsedData | null;
    if (!data || !isObject<ParsedData>(data)) {
      throw new Error('Invalid JSON data');
    }
    const { blocks = [], globalStyle = {}, page, meta } = data;

    const children: BlockRenderResult[] = [];

    function pageSizeConfig(size?: PageConfig['size']) {
      if (size === 'Letter') return { width: 12240, height: 15840 };
      if (isObject(size)) return size as { width: number; height: number };
      return { width: 11906, height: 16838 };
    }

    blocks.forEach((block: Block) => {
      const type = block.type;
      const results = (() => {
        switch (type) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return renderHeadingDocx(block, globalStyle);
          case 'ol':
          case 'ul':
            return renderListDocx(block, globalStyle);
          case 'table':
            return renderTableDocx(block, globalStyle);
          case 'image':
          case 'img':
            return renderImageDocx(block, globalStyle);
          case 'quote':
          case 'blockquote':
            return renderQuoteDocx(block, globalStyle);
          case 'code':
            return renderCodeDocx(block, globalStyle);
          case 'pageBreak':
            return renderPageBreakDocx();
          case 'divider':
          case 'hr':
            return renderDividerDocx();
          case 'p':
          case 'paragraph':
          default:
            return renderFallbackDocx(block, globalStyle);
        }
      })();
      children.push(...results);
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
          top: twipsFromSize(page?.margin?.top) || 1440,
          right: twipsFromSize(page?.margin?.right) || 1440,
          bottom: twipsFromSize(page?.margin?.bottom) || 1440,
          left: twipsFromSize(page?.margin?.left) || 1440,
        },
      },
    };
    if (sectionProps.page && page?.orientation === 'landscape') {
      sectionProps.page.orientation = docx.PageOrientation.LANDSCAPE;
    }

    const listRunSize = halfPointFromSize(globalStyle.fontSize);
    const listRunFont = globalStyle.fontFamily;

    const headingBaseSpacing = buildParagraphSpacing(globalStyle);
    const headingRunSize = halfPointFromSize(globalStyle.fontSize);
    const headingRunFont = globalStyle.fontFamily;
    const headingStyles = [
      'Heading1',
      'Heading2',
      'Heading3',
      'Heading4',
      'Heading5',
      'Heading6',
    ].map(id => ({
      id,
      name: id.replace('Heading', 'Heading '),
      basedOn: 'Normal',
      run: {
        size: headingRunSize,
        font: headingRunFont,
        color: '000000',
        bold: true,
      },
      paragraph: {
        spacing: headingBaseSpacing,
      },
    }));

    const doc = new docx.Document({
      sections: [
        {
          properties: sectionProps,
          children,
        },
      ],
      styles: {
        paragraphStyles: [
          ...headingStyles,
          {
            id: 'ListParagraph',
            name: 'List Paragraph',
            run: {
              size: listRunSize,
              font: listRunFont,
            },
          },
        ],
      },
      numbering: {
        config: [
          {
            reference: 'main-num',
            levels: Array.from({ length: 10 }).map((_, i) => {
              const parts = Array.from({ length: i + 1 }, (_, idx) => `%${idx + 1}`);
              return {
                level: i,
                format: 'decimal',
                text: `${parts.join('.')}.`,
                alignment: docx.AlignmentType.START,
                style: {
                  run: {
                    size: listRunSize,
                    font: listRunFont,
                  },
                },
                paragraphProperties: {
                  indent: {
                    left: 720 * (i + 1),
                    hanging: 360,
                  },
                },
              };
            }),
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
