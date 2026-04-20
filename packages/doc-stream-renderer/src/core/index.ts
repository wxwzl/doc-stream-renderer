// Re-export types
export type {
  ParagraphChild,
  TextRunOptions,
  MutableTextRunOptions,
  BorderStyleValue,
  VerticalAlignValue,
  WidthTypeValue,
  TextWrappingTypeValue,
  ParagraphBorders,
  MutablePartial,
  InlineStyle,
  InlineItem,
  BlockStyle,
  TableCell,
  TableRow,
  TableContent,
  ImageContent,
  CodeContent,
  ListContent,
  BlockContent,
  BlockType,
  Block,
  GlobalStyle,
  PageConfig,
  DocumentMeta,
  ParsedData,
} from './types';

// Re-export utilities
export {
  resolveLength,
  halfPointFromSize,
  twipsFromSize,
  parseBorderStyle,
  cellWidth,
} from './utils';

// Re-export core functions
export {
  getHtmlFromStream,
  parseStream,
  renderBlocksHtml,
  computeOlCountersBeforeIndex,
} from './html';
export { generateDocxBlob } from './docx';
