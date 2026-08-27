import { useState } from 'react';
import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <Paper variant="outlined"
      sx={{
        display: 'flex', alignItems: 'center',
        width: focused ? 320 : 200, transition: 'width 0.2s ease',
        borderColor: focused ? 'primary.main' : 'divider', px: 1,
      }}>
      <SearchIcon fontSize="small" color="action" />
      <InputBase placeholder="Search…" value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
        inputProps={{ 'aria-label': 'Global search' }} />
      {query && (
        <IconButton size="small" onClick={() => setQuery('')} aria-label="Clear search">
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
}
