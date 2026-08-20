import { useState } from 'react';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const PLACEHOLDER: Array<{ id: string; title: string; body: string; time: string }> = [];

export function NotificationCenter() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const count = PLACEHOLDER.length;
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label={`${count} notifications`}>
        <Badge badgeContent={count} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 340, maxHeight: 400 } } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Notifications</Typography>
        </Box>
        <Divider />
        {count === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {PLACEHOLDER.map((n) => (
              <ListItem key={n.id} sx={{ py: 1.5 }}>
                <ListItemText
                  primary={n.title}
                  secondary={n.body}
                  slotProps={{
                    primary: { sx: { variant: 'body2', fontWeight: 500 } },
                    secondary: { sx: { variant: 'caption' } },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
