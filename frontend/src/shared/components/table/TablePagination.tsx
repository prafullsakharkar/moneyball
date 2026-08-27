/**
 * TablePagination — enterprise pagination control
 * ================================================
 * Page size selector + page navigation with a compact, dense layout
 * consistent with the CricketOS design system. Uses tabular numerals
 * for page counts.
 */
import { Box, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TablePaginationProps {
  /** Total number of rows */
  count: number;
  /** Current page (0-indexed) */
  page: number;
  onPageChange: (page: number) => void;
  /** Rows per page */
  rowsPerPage: number;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  /** Options for the rows-per-page selector */
  rowsPerPageOptions?: number[];
  /** Label for the rows-per-page selector */
  labelRowsPerPage?: string;
  /** Show the total count */
  showTotal?: boolean;
}

export function TablePagination({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  labelRowsPerPage = 'Rows per page',
  showTotal = true,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const safePage = Math.min(page, totalPages - 1);
  const from = count === 0 ? 0 : safePage * rowsPerPage + 1;
  const to = Math.min(count, (safePage + 1) * rowsPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        px: 2,
        py: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {labelRowsPerPage}
        </Typography>
        <Select
          size="small"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          sx={{ minWidth: 72, fontSize: '0.8125rem' }}
          slotProps={{ input: { 'aria-label': labelRowsPerPage } }}
        >
          {rowsPerPageOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {showTotal && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
        >
          {from}–{to} of {count}
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Previous page">
          <span>
            <IconButton
              size="small"
              disabled={safePage === 0}
              onClick={() => onPageChange(safePage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </IconButton>
          </span>
        </Tooltip>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'center' }}
        >
          {safePage + 1} / {totalPages}
        </Typography>
        <Tooltip title="Next page">
          <span>
            <IconButton
              size="small"
              disabled={safePage >= totalPages - 1}
              onClick={() => onPageChange(safePage + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
