import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Chip, IconButton, InputAdornment,
  Button, Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@api/organization';
import { PageHeader } from '@shared/components/PageHeader';
import type { OrganizationType } from '@domain/index';

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  national_board: 'National Board',
  state_association: 'State Association',
  league: 'League',
  franchise: 'Franchise',
  professional_club: 'Professional Club',
  amateur_club: 'Amateur Club',
  academy: 'Academy',
  school: 'School',
  university: 'University',
  corporate: 'Corporate',
  media: 'Media',
};

const ORG_TYPE_COLORS: Record<OrganizationType, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
  national_board: 'primary',
  state_association: 'secondary',
  league: 'success',
  franchise: 'warning',
  professional_club: 'info',
  amateur_club: 'info',
  academy: 'success',
  school: 'secondary',
  university: 'primary',
  corporate: 'warning',
  media: 'error',
};

export default function OrganizationListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['organizations', { search, type: typeFilter, page: page + 1, limit: rowsPerPage }],
    queryFn: () => organizationService.list({
      search: search || undefined,
      type: typeFilter || undefined,
      page: page + 1,
      limit: rowsPerPage,
    }),
  });

  const organizations = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <Box>
      <PageHeader
        title="Organizations"
        description="Manage all organizations on the platform"
        actions={
          <Button startIcon={<AddIcon />} variant="contained" size="small">
            New Organization
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              size="small"
              sx={{ minWidth: 280 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
              >
                <MenuItem value="">All Types</MenuItem>
                {(Object.keys(ORG_TYPE_LABELS) as OrganizationType[]).map((type) => (
                  <MenuItem key={type} value={type}>{ORG_TYPE_LABELS[type]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Organization</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Members</TableCell>
                <TableCell align="right">Teams</TableCell>
                <TableCell align="right">Competitions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Loading organizations...</Typography>
                  </TableCell>
                </TableRow>
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No organizations found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                          {org.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{org.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{org.slug}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={ORG_TYPE_LABELS[org.type]} color={ORG_TYPE_COLORS[org.type]} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">{org.memberCount}</TableCell>
                    <TableCell align="right">{org.teamCount}</TableCell>
                    <TableCell align="right">{org.competitionCount}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/organizations/${org.id}`)}>
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </Box>
  );
}
