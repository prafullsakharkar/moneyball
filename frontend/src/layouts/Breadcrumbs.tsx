import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useContextHierarchy } from '@hooks/useContextHierarchy';
import { useOrgContext } from '@hooks/useOrgContext';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
}

/**
 * Breadcrumbs
 * ============================================
 * Organization-aware breadcrumb trail. When an organization is active it is
 * inserted as the first crumb (after Home), so users always know which
 * tenant they are operating in — reinforcing the
 * Global → Organization → … hierarchy.
 */
export function Breadcrumbs() {
  const location = useLocation();
  const { organization } = useOrgContext();
  const { level } = useContextHierarchy();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) return null;

  return (
    <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ px: 3, pt: 2 }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit" variant="body2">
        Home
      </Link>
      {organization && level !== 'global' && (
        <Link component={RouterLink} to="/organizations" underline="hover" color="inherit" variant="body2">
          {organization.name}
        </Link>
      )}
      {pathnames.map((segment, index) => {
        const to = '/' + pathnames.slice(0, index + 1).join('/');
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography key={to} variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
            {capitalize(segment)}
          </Typography>
        ) : (
          <Link key={to} component={RouterLink} to={to} underline="hover" color="inherit" variant="body2">
            {capitalize(segment)}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
