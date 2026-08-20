import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
}

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) return null;

  return (
    <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ px: 3, pt: 2 }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit" variant="body2">
        Home
      </Link>
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
