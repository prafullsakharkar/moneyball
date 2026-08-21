/**
 * ThemeToggle — CricketIQ Design System
 * Icon button that toggles between light and dark mode.
 * Uses the CricketIQ theme context (light/dark/system aware).
 */
import { IconButton, Tooltip, type IconButtonProps } from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@providers/ThemeProvider';

export interface ThemeToggleProps extends Omit<IconButtonProps, 'title'> {
  /** Show a tooltip on hover */
  tooltip?: boolean;
}

export function ThemeToggle({ tooltip = true, size = 'small', ...props }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const button = (
    <IconButton
      size={size}
      onClick={toggleTheme}
      aria-label={label}
      sx={{
        color: 'text.secondary',
        '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
      }}
      {...props}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );

  if (!tooltip) return button;

  return <Tooltip title={label}>{button}</Tooltip>;
}
