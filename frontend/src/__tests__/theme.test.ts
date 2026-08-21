import { describe, it, expect } from 'vitest';
import { lightTheme, darkTheme } from '../core/theme';
import { darkTokens, lightTokens } from '../core/theme';

describe('CricketOS Theme', () => {
  it('applies CricketOS dark palette', () => {
    expect(darkTheme.palette.mode).toBe('dark');
    expect(darkTheme.palette.background.default).toBe('#090A0B');
    expect(darkTheme.palette.background.paper).toBe('#101113');
    expect(darkTheme.palette.primary.main).toBe('#A3E635');
    expect(darkTheme.palette.text.primary).toBe('#F1F3F4');
    expect(darkTheme.palette.text.secondary).toBe(darkTokens.muted);
    expect(darkTheme.palette.success.main).toBe('#84CC16');
    expect(darkTheme.palette.warning.main).toBe('#F59E0B');
    expect(darkTheme.palette.error.main).toBe('#F87171');
    expect(darkTheme.palette.info.main).toBe('#60A5FA');
    expect(darkTheme.palette.border).toBe('rgba(255, 255, 255, 0.07)');
  });

  it('applies the CricketOS light palette as a deliberate counterpart', () => {
    expect(lightTheme.palette.mode).toBe('light');
    expect(lightTheme.palette.background.default).toBe('#F7F7F5');
    expect(lightTheme.palette.background.paper).toBe('#FFFFFF');
    expect(lightTheme.palette.primary.main).toBe('#65A30D');
    expect(lightTheme.palette.text.primary).toBe('#151515');
    expect(lightTheme.palette.text.secondary).toBe(lightTokens.muted);
    expect(lightTheme.palette.border).toBe('rgba(21, 21, 21, 0.09)');
  });

  it('uses Inter with a system-ui fallback', () => {
    const family = darkTheme.typography.fontFamily;
    expect(family).toContain('Inter');
    expect(family).toContain('system-ui');
  });

  it('centralizes all required MUI component overrides', () => {
    const required = [
      'MuiButton',
      'MuiTextField',
      'MuiInputBase',
      'MuiSelect',
      'MuiMenu',
      'MuiPopover',
      'MuiDialog',
      'MuiDrawer',
      'MuiCard',
      'MuiPaper',
      'MuiTabs',
      'MuiTab',
      'MuiTable',
      'MuiTableRow',
      'MuiTableCell',
      'MuiChip',
      'MuiTooltip',
      'MuiAvatar',
      'MuiIconButton',
    ];
    for (const key of required) {
      const k = key as keyof typeof darkTheme.components;
      expect(darkTheme.components?.[k], `missing ${key}`).toBeDefined();
      expect(lightTheme.components?.[k], `missing ${key} (light)`).toBeDefined();
    }
  });
});
