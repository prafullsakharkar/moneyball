/**
 * PlayerAvatar — CricketOS Design System
 * Player profile avatar with initials fallback, role indicator, and status badges.
 */
import { Avatar, Box, Badge, useTheme, type SxProps, type Theme } from '@mui/material';

export interface PlayerAvatarProps {
  /** Player first name */
  firstName: string;
  /** Player last name */
  lastName: string;
  /** Avatar image URL */
  imageUrl?: string;
  /** Display size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Player role color */
  role?: 'batsman' | 'bowler' | 'allrounder' | 'wk';
  /** Online/active status */
  online?: boolean;
  /** Show role indicator */
  showRole?: boolean;
  sx?: SxProps<Theme>;
}

const sizeMap = {
  xs: { avatar: 24, fontSize: '0.625rem' },
  sm: { avatar: 32, fontSize: '0.75rem' },
  md: { avatar: 40, fontSize: '0.875rem' },
  lg: { avatar: 56, fontSize: '1.125rem' },
  xl: { avatar: 72, fontSize: '1.5rem' },
};

const roleLabels: Record<string, string> = {
  batsman: 'BAT',
  bowler: 'BWL',
  allrounder: 'AR',
  wk: 'WK',
};

export function PlayerAvatar({
  firstName,
  lastName,
  imageUrl,
  size = 'md',
  role,
  online,
  showRole = false,
  sx,
}: PlayerAvatarProps) {
  const theme = useTheme();
  const { palette } = theme;
  const s = sizeMap[size];
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const roleColor = (r: NonNullable<PlayerAvatarProps['role']>): string => {
    switch (r) {
      case 'batsman':
        return palette.primary.main;
      case 'bowler':
        return palette.error.main;
      case 'allrounder':
        return palette.success.main;
      case 'wk':
        return palette.warning.main;
    }
  };

  const resolvedRoleColor = role ? roleColor(role) : palette.primary.main;

  const avatar = (
    <Avatar
      src={imageUrl}
      sx={{
        width: s.avatar,
        height: s.avatar,
        fontSize: s.fontSize,
        fontWeight: 600,
        bgcolor: resolvedRoleColor,
        ...sx,
      }}
    >
      {!imageUrl && initials}
    </Avatar>
  );

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {online !== undefined ? (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: online ? palette.success.main : palette.text.disabled,
              border: '2px solid',
              borderColor: 'background.paper',
              width: size === 'xs' ? 6 : 8,
              height: size === 'xs' ? 6 : 8,
              borderRadius: '50%',
            },
          }}
        >
          {avatar}
        </Badge>
      ) : (
        avatar
      )}
      {showRole && role && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            bgcolor: resolvedRoleColor,
            color: '#fff',
            fontSize: '0.5rem',
            fontWeight: 700,
            px: 0.5,
            borderRadius: 0.5,
            lineHeight: '14px',
            border: '1.5px solid',
            borderColor: 'background.paper',
          }}
        >
          {roleLabels[role]}
        </Box>
      )}
    </Box>
  );
}
