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
  indent?: string;
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
  | 'hr';

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
