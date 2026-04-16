import * as docx from 'docx';
import type { BorderStyleValue, VerticalAlignValue, WidthTypeValue, BlockType } from './types';

export function isHeading(
  type: BlockType | undefined
): type is 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  return (
    type === 'h1' ||
    type === 'h2' ||
    type === 'h3' ||
    type === 'h4' ||
    type === 'h5' ||
    type === 'h6'
  );
}

function getType(value: unknown): string {
  return Object.prototype.toString.call(value);
}

export function isString(value: unknown): value is string {
  return getType(value) === '[object String]';
}

export function isNumber(value: unknown): value is number {
  return getType(value) === '[object Number]';
}

export function isObject<T>(value: unknown): value is T {
  return getType(value) === '[object Object]';
}

export function isArray<T>(value: unknown): value is T[] {
  return getType(value) === '[object Array]';
}

export const DEFAULT_FONT_SIZE_PX = 16;
export const DEFAULT_FONT_SIZE_PT = DEFAULT_FONT_SIZE_PX * 0.75; // 12pt

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function resolveLength(
  cssValue: string | undefined,
  basePt: number = DEFAULT_FONT_SIZE_PT
): number {
  if (!cssValue) return 0;
  const trimmed = cssValue.trim().toLowerCase();
  const num = parseFloat(trimmed);
  if (Number.isNaN(num)) return 0;
  if (trimmed.endsWith('pt')) return num;
  if (trimmed.endsWith('px')) return num * 0.75;
  if (trimmed.endsWith('em')) return num * basePt;
  // 纯数字默认当作 pt（兼容现有隐式行为）
  return num;
}

export function halfPointFromSize(
  sizeStr: string | undefined,
  fallbackPt = DEFAULT_FONT_SIZE_PT
): number {
  const pt = resolveLength(sizeStr, fallbackPt) || fallbackPt;
  return Math.round(pt * 2);
}

export function twipsFromSize(sizeStr: string | undefined): number {
  const pt = resolveLength(sizeStr);
  return Math.round(pt * 20);
}

export function normalizeHexColor(color?: string): string | undefined {
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

export function base64ToUint8Array(base64: string): Uint8Array {
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

export function cellVerticalAlign(align?: string): VerticalAlignValue {
  if (align === 'top') return docx.VerticalAlign.TOP;
  if (align === 'bottom') return docx.VerticalAlign.BOTTOM;
  return docx.VerticalAlign.CENTER;
}

export function cellWidth(
  width?: string | number
): { size: number; type: WidthTypeValue } | undefined {
  if (width === undefined) return undefined;
  if (isString(width)) {
    if (width.endsWith('%')) {
      const pct = parseFloat(width);
      if (!Number.isNaN(pct)) return { size: pct, type: docx.WidthType.PERCENTAGE };
    }
    const pt = resolveLength(width);
    if (!Number.isNaN(pt) && pt > 0) return { size: Math.round(pt * 20), type: docx.WidthType.DXA };
  }
  if (isNumber(width)) {
    if (width <= 100) return { size: width, type: docx.WidthType.PERCENTAGE };
    return { size: width * 20, type: docx.WidthType.DXA };
  }
  return undefined;
}

export function parseBorderStyle(borderStr?: string): docx.IBorderOptions | undefined {
  if (!borderStr) return undefined;
  const parts = borderStr.trim().split(/\s+/);
  if (parts.length < 3) return undefined;
  const sizePt = resolveLength(parts[0]);
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
    size: Math.max(1, Math.round(sizePt * 8)),
  };
}
