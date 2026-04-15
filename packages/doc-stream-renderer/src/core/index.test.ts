import { describe, it, expect } from 'vitest';
import {
  getHtmlFromStream,
  generateDocxBlob,
  resolveLength,
  halfPointFromSize,
  twipsFromSize,
  parseBorderStyle,
  cellWidth,
} from './index';
import * as docx from 'docx';

describe('getHtmlFromStream', () => {
  it('returns empty string for empty input', () => {
    expect(getHtmlFromStream('')).toBe('');
  });

  it('renders a heading block', () => {
    const json = JSON.stringify({
      blocks: [{ type: 'h1', content: 'Hello World' }],
    });
    const html = getHtmlFromStream(json);
    expect(html).toContain('<h1');
    expect(html).toContain('Hello World');
  });

  it('renders inline styled text', () => {
    const json = JSON.stringify({
      blocks: [
        {
          type: 'p',
          content: [{ text: 'bold text', style: { fontWeight: 'bold' } }],
        },
      ],
    });
    const html = getHtmlFromStream(json);
    expect(html).toContain('font-weight: bold');
    expect(html).toContain('bold text');
  });

  it('preserves em unit in HTML output', () => {
    const json = JSON.stringify({
      blocks: [
        {
          type: 'p',
          content: [{ text: 'text', style: { fontSize: '1.5em' } }],
          style: { marginTop: '2em', textIndent: '2em' },
        },
      ],
    });
    const html = getHtmlFromStream(json);
    expect(html).toContain('font-size: 1.5em');
    expect(html).toContain('margin-top: 2em');
    expect(html).toContain('text-indent: 2em');
  });

  it('renders a table', () => {
    const json = JSON.stringify({
      blocks: [
        {
          type: 'table',
          content: {
            rows: [{ cells: [{ content: 'A' }, { content: 'B' }] }],
          },
        },
      ],
    });
    const html = getHtmlFromStream(json);
    expect(html).toContain('<table');
    expect(html).toContain('A');
    expect(html).toContain('B');
  });
});

describe('resolveLength', () => {
  it('converts px to pt', () => {
    expect(resolveLength('16px')).toBe(12); // 16 * 0.75
    expect(resolveLength('12px')).toBe(9);
  });

  it('keeps pt as pt', () => {
    expect(resolveLength('12pt')).toBe(12);
    expect(resolveLength('72pt')).toBe(72);
  });

  it('converts em to pt based on base font size', () => {
    expect(resolveLength('1.5em', 12)).toBe(18);
    expect(resolveLength('2em', 16)).toBe(32);
  });

  it('treats plain numbers as pt', () => {
    expect(resolveLength('12')).toBe(12);
    expect(resolveLength('16')).toBe(16);
  });

  it('returns 0 for undefined or empty', () => {
    expect(resolveLength(undefined)).toBe(0);
    expect(resolveLength('')).toBe(0);
    expect(resolveLength('abc')).toBe(0);
  });
});

describe('halfPointFromSize', () => {
  it('converts 16px to 24 half-points (12pt)', () => {
    expect(halfPointFromSize('16px')).toBe(24);
  });

  it('converts 12pt to 24 half-points', () => {
    expect(halfPointFromSize('12pt')).toBe(24);
  });

  it('uses default fallback when undefined', () => {
    // default is 12pt -> 24 half-points
    expect(halfPointFromSize(undefined)).toBe(24);
  });

  it('uses custom fallback when provided', () => {
    expect(halfPointFromSize(undefined, 14)).toBe(28);
  });
});

describe('twipsFromSize', () => {
  it('converts 72pt to 1440 twips', () => {
    expect(twipsFromSize('72pt')).toBe(1440);
  });

  it('converts 96px to 1440 twips', () => {
    expect(twipsFromSize('96px')).toBe(1440); // 96 * 0.75 = 72pt -> 1440 twips
  });

  it('converts 2em to twips based on default 12pt', () => {
    expect(twipsFromSize('2em')).toBe(480); // 2 * 12 = 24pt -> 480 twips
  });

  it('returns 0 for undefined', () => {
    expect(twipsFromSize(undefined)).toBe(0);
  });
});

describe('parseBorderStyle', () => {
  it('parses 1px solid #ccc', () => {
    const border = parseBorderStyle('1px solid #ccc');
    expect(border).toBeDefined();
    expect(border!.style).toBe(docx.BorderStyle.SINGLE);
    expect(border!.color).toBe('cccccc');
    // 1px = 0.75pt -> 0.75 * 8 = 6 (1/8 pt units), rounded = 6
    expect(border!.size).toBe(6);
  });

  it('parses 2pt dashed #ff0000', () => {
    const border = parseBorderStyle('2pt dashed #ff0000');
    expect(border).toBeDefined();
    expect(border!.style).toBe(docx.BorderStyle.DASHED);
    expect(border!.color).toBe('ff0000');
    // 2pt * 8 = 16
    expect(border!.size).toBe(16);
  });

  it('returns undefined for invalid strings', () => {
    expect(parseBorderStyle('')).toBeUndefined();
    expect(parseBorderStyle('solid')).toBeUndefined();
  });
});

describe('cellWidth', () => {
  it('handles percentage strings', () => {
    expect(cellWidth('50%')).toEqual({ size: 50, type: docx.WidthType.PERCENTAGE });
  });

  it('handles px strings', () => {
    expect(cellWidth('100px')).toEqual({ size: 1500, type: docx.WidthType.DXA }); // 100 * 0.75 = 75pt -> 1500
  });

  it('handles pt strings', () => {
    expect(cellWidth('72pt')).toEqual({ size: 1440, type: docx.WidthType.DXA });
  });

  it('handles em strings', () => {
    expect(cellWidth('2em')).toEqual({ size: 480, type: docx.WidthType.DXA }); // 2 * 12 = 24pt -> 480
  });

  it('handles number <= 100 as percentage', () => {
    expect(cellWidth(50)).toEqual({ size: 50, type: docx.WidthType.PERCENTAGE });
  });

  it('handles number > 100 as dxa (assumed px)', () => {
    expect(cellWidth(200)).toEqual({ size: 4000, type: docx.WidthType.DXA });
  });

  it('returns undefined for undefined', () => {
    expect(cellWidth(undefined)).toBeUndefined();
  });
});

describe('generateDocxBlob', () => {
  it('returns a Blob for valid JSON', async () => {
    const json = JSON.stringify({
      blocks: [{ type: 'p', content: 'Test' }],
    });
    const blob = await generateDocxBlob(json);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('handles pt and em units in styles', async () => {
    const json = JSON.stringify({
      globalStyle: { fontSize: '14pt' },
      blocks: [
        {
          type: 'p',
          content: [{ text: 'Hello', style: { fontSize: '1.5em', letterSpacing: '0.5em' } }],
          style: { marginTop: '12pt', lineHeight: '18pt', textIndent: '2em' },
        },
      ],
    });
    const blob = await generateDocxBlob(json);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('handles lineHeight as a multiplier', async () => {
    const json = JSON.stringify({
      blocks: [
        {
          type: 'p',
          content: 'Line height test',
          style: { lineHeight: '1.5' },
        },
      ],
    });
    const blob = await generateDocxBlob(json);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('rejects for invalid JSON', async () => {
    await expect(generateDocxBlob('not json')).rejects.toThrow();
  });
});
