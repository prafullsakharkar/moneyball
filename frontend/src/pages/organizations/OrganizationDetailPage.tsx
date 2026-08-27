import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Avatar, Chip, Grid, IconButton } from '@mui/material';
import { ArrowLeft, Edit, Plus, Users, Shield, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@api/organization';
import { useHasPermission } from '@hooks/index';
import {
  PageShell,
  PageHeader,
  PageSection,
  Card,
  Button,
  StatCard,
  DataTable,
  LoadingState,
  type DataTableColumn,
} from '@shared/components';

import type { OrganizationMember, OrganizationRole, Department } from '@domain/index';

const ORG_TYPE_LABELS: Record<string, string> = {
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

/* ── Overview Tab ──────────────────────────────────────── */

function OverviewTab({ orgId }: { orgId: string }) {
  const { data: org } = useQuery({
    queryKey: ['org', orgId, 'detail'],
    queryFn: () => organizationService.get(orgId),
  });

  const { data: stats } = useQuery({
    queryKey: ['org', orgId, 'stats'],
    queryFn: () => organizationService.getStats(orgId),
  });

  const { data: teams } = useQuery({
    queryKey: ['org', orgId, 'teams'],
    queryFn: () => organizationService.getTeams(orgId),
  });

  const teamList = teams?.data ?? [];

  if (!org) return <LoadingState message="Loading organization..." />;

  return (
    <Box>
      <PageSection title="Organization Info">
        <Card>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{org.name}</Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Type</Typography>
                <Typography variant="body1">{ORG_TYPE_LABELS[org.type] ?? org.type}</Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Slug</Typography>
                <Typography variant="body1">{org.slug}</Typography>
              </Box>
              {org.description && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{org.description}</Typography>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {org.email && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{org.email}</Typography>
                </Box>
              )}
              {org.website && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Website</Typography>
                  <Typography variant="body1">{org.website}</Typography>
                </Box>
              )}
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Created</Typography>
                <Typography variant="body1">{new Date(org.createdAt).toLocaleDateString()}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </PageSection>

      {/* Stats */}
      {stats && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <StatCard value={stats.memberCount} label="Members" icon={<Users size={20} />} accent="primary" />
          <StatCard value={stats.teamCount} label="Teams" icon={<Shield size={20} />} accent="success" />
          <StatCard value={stats.competitionCount} label="Competitions" icon={<Building2 size={20} />} accent="warning" />
          <StatCard value={stats.matchCount} label="Matches" icon={<Edit size={20} />} accent="info" />
        </Box>
      )}

      {/* Teams */}
      {teamList.length > 0 && (
        <PageSection title="Teams">
          <Card>
            <DataTable
              columns={[
                {
                  id: 'name',
                  header: 'Team',
                  cell: (_, team) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.7rem' }}>
                        {team.shortName ?? team.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{team.name}</Typography>
                    </Box>
                  ),
                },
                {
                  id: 'gender',
                  header: 'Gender',
                  cell: (_, team) => <Chip label={team.gender} size="small" variant="outlined" />,
                },
                {
                  id: 'level',
                  header: 'Level',
                  cell: (_, team) => <Chip label={team.level.replace(/_/g, ' ')} size="small" />,
                },
                { id: 'playerCount', header: 'Players', align: 'right' },
                { id: 'coachCount', header: 'Coaches', align: 'right' },
              ]}
              data={teamList}
              getRowId={(row) => row.id}
              dense
            />
          </Card>
        </PageSection>
      )}
    </Box>
  );
}

/* ── Members Tab ───────────────────────────────────────── */

function MembersTab({ orgId }: { orgId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['org', orgId, 'members'],
    queryFn: () => organizationService.getMembers(orgId, { limit: 50 }),
  });

  const canManageMembers = useHasPermission('organization', 'manage');

  const memberList = data?.data ?? [];

  const columns: DataTableColumn<OrganizationMember>[] = [
    {
      id: 'name',
      header: 'Member',
      cell: (_, member) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
            {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {member.user.firstName} {member.user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">{member.user.email}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      cell: (_, member) => (
        <Chip label={member.role} size="small" color={member.role === 'admin' ? 'primary' : 'default'} variant="outlined" />
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (_, member) => (
        <Chip
          label={member.status}
          size="small"
          color={member.status === 'active' ? 'success' : member.status === 'invited' ? 'warning' : 'default'}
        />
      ),
    },
    {
      id: 'joinedAt',
      header: 'Joined',
      cell: (_, member) => new Date(member.joinedAt).toLocaleDateString(),
    },
    ...(canManageMembers
      ? [
          {
            id: 'actions',
            header: '',
            align: 'right' as const,
            sortable: false,
            cell: () => (
              <IconButton size="small" aria-label="Edit"><Edit size={16} /></IconButton>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box>
      <PageSection
        title={`Members (${memberList.length})`}
        actions={
          canManageMembers ? (
            <Button startIcon={<Plus size={16} />} variant="primary" size="small">Invite Member</Button>
          ) : undefined
        }
      >
        <Card>
          <DataTable
            columns={columns}
            data={memberList}
            getRowId={(row) => row.id}
            loading={isLoading}
            loadingRows={5}
            emptyTitle="No members found"
            dense
          />
        </Card>
      </PageSection>
    </Box>
  );
}

/* ── Roles Tab ─────────────────────────────────────────── */

function RolesTab({ orgId }: { orgId: string }) {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['org', orgId, 'roles'],
    queryFn: () => organizationService.getRoles(orgId),
  });

  const canManageRoles = useHasPermission('organization', 'manage');

  const columns: DataTableColumn<OrganizationRole>[] = [
    {
      id: 'name',
      header: 'Role',
      cell: (_, role) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{role.name}</Typography>,
    },
    {
      id: 'description',
      header: 'Description',
      cell: (_, role) => (
        <Typography variant="body2" color="text.secondary">{role.description ?? '—'}</Typography>
      ),
    },
    { id: 'memberCount', header: 'Members', align: 'right' },
    {
      id: 'isSystem',
      header: 'System',
      cell: (_, role) =>
        role.isSystem ? (
          <Chip label="System" size="small" color="info" variant="outlined" />
        ) : (
          <Chip label="Custom" size="small" variant="outlined" />
        ),
    },
    ...(canManageRoles
      ? ([
          {
            id: 'actions',
            header: '',
            align: 'right' as const,
            sortable: false,
            cell: (_, role) => (
              <IconButton size="small" disabled={role.isSystem} aria-label="Edit role"><Edit size={16} /></IconButton>
            ),
          },
        ] as DataTableColumn<OrganizationRole>[])
      : []),
  ];

  return (
    <Box>
      <PageSection
        title="Roles"
        actions={
          canManageRoles ? (
            <Button startIcon={<Plus size={16} />} variant="primary" size="small">Create Role</Button>
          ) : undefined
        }
      >
        <Card>
          <DataTable
            columns={columns}
            data={roles ?? []}
            getRowId={(row) => row.id}
            loading={isLoading}
            loadingRows={5}
            emptyTitle="No roles found"
            dense
          />
        </Card>
      </PageSection>
    </Box>
  );
}

/* ── Departments Tab ───────────────────────────────────── */

function DepartmentsTab({ orgId }: { orgId: string }) {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['org', orgId, 'departments'],
    queryFn: () => organizationService.getDepartments(orgId),
  });

  const canManageDepartments = useHasPermission('organization', 'manage');

  return (
    <Box>
      <PageSection
        title="Departments"
        actions={
          canManageDepartments ? (
            <Button startIcon={<Plus size={16} />} variant="primary" size="small">Create Department</Button>
          ) : undefined
        }
      >
        {isLoading ? (
          <LoadingState message="Loading departments..." />
        ) : !departments || departments.length === 0 ? (
          <Typography color="text.secondary">No departments found</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {departments.map((dept: Department) => (
              <Card key={dept.id}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{dept.name}</Typography>
                {dept.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{dept.description}</Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  {dept.memberCount} member{dept.memberCount !== 1 ? 's' : ''}
                </Typography>
              </Card>
            ))}
          </Box>
        )}
      </PageSection>
    </Box>
  );
}

/* ── Main Detail Page ──────────────────────────────────── */

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

export default function OrganizationDetailPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const activeOrgId = orgId ?? '';

  const { data: org } = useQuery({
    queryKey: ['org', activeOrgId, 'detail'],
    queryFn: () => organizationService.get(activeOrgId),
    enabled: Boolean(activeOrgId),
  });

  if (!orgId) {
    return (
      <PageShell>
        <Typography>No organization selected</Typography>
        <Button onClick={() => navigate('/organizations')} sx={{ mt: 1 }}>Back to Organizations</Button>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Organization"
        title={org?.name ?? 'Organization'}
        description={org ? (ORG_TYPE_LABELS[org.type] ?? org.type) : undefined}
        actions={
          <Button variant="ghost" size="small" onClick={() => navigate('/organizations')}>
            <ArrowLeft size={16} />
            Back
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Overview" />
        <Tab label="Members" />
        <Tab label="Roles" />
        <Tab label="Departments" />
        <Tab label="Settings" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <OverviewTab orgId={activeOrgId} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <MembersTab orgId={activeOrgId} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <RolesTab orgId={activeOrgId} />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <DepartmentsTab orgId={activeOrgId} />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <Typography color="text.secondary">Organization settings coming soon.</Typography>
      </TabPanel>
    </PageShell>
  );
}
