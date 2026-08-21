import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Avatar, Chip, TablePagination } from '@mui/material';
import { Search, Plus, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@api/organization';
import {
  PageShell,
  PageHeader,
  PageToolbar,
  Button,
  Input,
  Select,
  DataTable,
  type DataTableColumn,
} from '@shared/components';
import type { Organization, OrganizationType } from '@domain/index';

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

  const columns: DataTableColumn<Organization>[] = [
    {
      id: 'name',
      header: 'Organization',
      sortValue: (row) => row.name,
      cell: (_, org) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8125rem' }}>
            {org.name.charAt(0)}
          </Avatar>
          <Box>
            <Box sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{org.name}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{org.slug}</Box>
          </Box>
        </Box>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      sortValue: (row) => ORG_TYPE_LABELS[row.type],
      cell: (_, org) => (
        <Chip label={ORG_TYPE_LABELS[org.type]} color={ORG_TYPE_COLORS[org.type]} size="small" variant="outlined" />
      ),
    },
    { id: 'memberCount', header: 'Members', align: 'right', sortValue: (row) => row.memberCount },
    { id: 'teamCount', header: 'Teams', align: 'right', sortValue: (row) => row.teamCount },
    { id: 'competitionCount', header: 'Competitions', align: 'right', sortValue: (row) => row.competitionCount },
    {
      id: 'actions',
      header: '',
      align: 'right',
      sortable: false,
      cell: (_, org) => (
        <Button variant="ghost" size="small" onClick={() => navigate(`/organizations/${org.id}`)}>
          <ArrowUpRight size={16} />
        </Button>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Organizations"
        description="Manage all organizations on the platform"
        actions={
          <Button startIcon={<Plus size={16} />} variant="primary" size="small">
            New Organization
          </Button>
        }
      />

      <PageToolbar>
        <Input
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small"
          sx={{ minWidth: 280 }}
          slotProps={{
            input: {
              startAdornment: <Search size={16} />,
            },
          }}
        />
        <Select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as string); setPage(0); }}
          size="small"
          sx={{ minWidth: 160 }}
          options={[
            { value: '', label: 'All Types' },
            ...(Object.keys(ORG_TYPE_LABELS) as OrganizationType[]).map((type) => ({
              value: type,
              label: ORG_TYPE_LABELS[type],
            })),
          ]}
        />
      </PageToolbar>

      <DataTable
        columns={columns}
        data={organizations}
        getRowId={(row) => row.id}
        loading={isLoading}
        loadingRows={5}
        emptyTitle="No organizations found"
        emptyDescription="Try adjusting your search or filters."
        onRowClick={(row) => navigate(`/organizations/${row.id}`)}
      />

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </PageShell>
  );
}
