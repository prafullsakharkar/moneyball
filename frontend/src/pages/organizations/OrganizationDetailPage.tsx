import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Avatar, Chip, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@api/organization';

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

  if (!org) return <Typography color="text.secondary">Loading...</Typography>;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Organization Info</Typography>
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
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          {[
            { label: 'Members', value: stats.memberCount, icon: <PeopleIcon />, color: 'primary.main' },
            { label: 'Teams', value: stats.teamCount, icon: <GroupsIcon />, color: 'success.main' },
            { label: 'Competitions', value: stats.competitionCount, icon: <EmojiEventsIcon />, color: 'warning.main' },
            { label: 'Matches', value: stats.matchCount, icon: <SportsCricketIcon />, color: 'info.main' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Teams */}
      {teamList.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Teams</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Team</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell align="right">Players</TableCell>
                    <TableCell align="right">Coaches</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamList.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.7rem' }}>
                            {team.shortName ?? team.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{team.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Chip label={team.gender} size="small" variant="outlined" /></TableCell>
                      <TableCell><Chip label={team.level.replace(/_/g, ' ')} size="small" /></TableCell>
                      <TableCell align="right">{team.playerCount}</TableCell>
                      <TableCell align="right">{team.coachCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
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

  const memberList = data?.data ?? [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Members ({memberList.length})</Typography>
        <Button variant="contained" size="small">Invite Member</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>Loading...</TableCell></TableRow>
              ) : memberList.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No members found</TableCell></TableRow>
              ) : (
                memberList.map((member: OrganizationMember) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Chip label={member.role} size="small" color={member.role === 'admin' ? 'primary' : 'default'} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        size="small"
                        color={member.status === 'active' ? 'success' : member.status === 'invited' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

/* ── Roles Tab ─────────────────────────────────────────── */

function RolesTab({ orgId }: { orgId: string }) {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['org', orgId, 'roles'],
    queryFn: () => organizationService.getRoles(orgId),
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Roles</Typography>
        <Button variant="contained" size="small">Create Role</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Members</TableCell>
                <TableCell>System</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>Loading...</TableCell></TableRow>
              ) : !roles || roles.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No roles found</TableCell></TableRow>
              ) : (
                roles.map((role: OrganizationRole) => (
                  <TableRow key={role.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{role.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{role.description ?? '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">{role.memberCount}</TableCell>
                    <TableCell>
                      {role.isSystem ? (
                        <Chip label="System" size="small" color="info" variant="outlined" />
                      ) : (
                        <Chip label="Custom" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" disabled={role.isSystem}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

/* ── Departments Tab ───────────────────────────────────── */

function DepartmentsTab({ orgId }: { orgId: string }) {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['org', orgId, 'departments'],
    queryFn: () => organizationService.getDepartments(orgId),
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Departments</Typography>
        <Button variant="contained" size="small">Create Department</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {isLoading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : !departments || departments.length === 0 ? (
          <Typography color="text.secondary">No departments found</Typography>
        ) : (
          departments.map((dept: Department) => (
            <Card key={dept.id}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{dept.name}</Typography>
                {dept.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{dept.description}</Typography>
                )}
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {dept.memberCount} member{dept.memberCount !== 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
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
      <Box>
        <Typography>No organization selected</Typography>
        <Button onClick={() => navigate('/organizations')} sx={{ mt: 1 }}>Back to Organizations</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate('/organizations')} size="small">
          <ArrowBackIcon />
        </IconButton>
        {org && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {org.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{org.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {ORG_TYPE_LABELS[org.type] ?? org.type}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
    </Box>
  );
}
