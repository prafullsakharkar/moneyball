/**
 * PlayersPage — CricketOS Enterprise Data Workspace
 * ============================================
 * List ↔ Detail drawer ↔ Inline editing ↔ Contextual actions.
 * Demonstrates the full data-table system: sorting, filtering, searching,
 * pagination, column visibility, density, row selection, bulk operations,
 * contextual menus, and a detail drawer with inline edit.
 */
import { useMemo, useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  PageShell,
  PageHeader,
  PageToolbar,
  Button,
  Input,
  Select,
  DataTable,
  TableToolbar,
  TablePagination,
  ContextMenu,
  BulkActionBar,
  DetailDrawer,
  FormDialog,
  ConfirmDialog,
  Form,
  FormRow,
  FormInput,
  FormSelect,
  useForm,
  useToast,
  type DataTableColumn,
  type ContextMenuItem,
  type BulkAction,
  type DetailField,
  type SelectOption,
} from '@shared/components';
import { PlayerAvatar } from '@shared/components/cricket';
import {
  usePlayers,
  useCreatePlayer,
  useUpdatePlayer,
  useDeletePlayer,
  useBulkUpdatePlayers,
  useBulkDeletePlayers,
  useHasPermission,
} from '@hooks/index';
import { useDataTable } from '@hooks/index';
import {
  PLAYER_ROLE_LABELS,
  PLAYER_STATUS_LABELS,
  BATTING_STYLE_LABELS,
  BOWLING_STYLE_LABELS,
  type Player,
  type PlayerRole,
  type PlayerStatus,
  type BattingStyle,
  type BowlingStyle,
} from '@domain/index';

const STATUS_COLORS: Record<PlayerStatus, 'success' | 'warning' | 'error' | 'default' | 'secondary'> = {
  active: 'success',
  injured: 'warning',
  suspended: 'error',
  retired: 'secondary',
  released: 'default',
};

const ROLE_COLORS: Record<PlayerRole, 'primary' | 'secondary' | 'success' | 'warning'> = {
  batsman: 'primary',
  bowler: 'secondary',
  all_rounder: 'success',
  wicket_keeper: 'warning',
};

const roleOptions: SelectOption[] = (Object.keys(PLAYER_ROLE_LABELS) as PlayerRole[]).map((value) => ({
  value,
  label: PLAYER_ROLE_LABELS[value],
}));

const statusOptions: SelectOption[] = (Object.keys(PLAYER_STATUS_LABELS) as PlayerStatus[]).map((value) => ({
  value,
  label: PLAYER_STATUS_LABELS[value],
}));

const battingOptions: SelectOption[] = (Object.keys(BATTING_STYLE_LABELS) as BattingStyle[]).map((value) => ({
  value,
  label: BATTING_STYLE_LABELS[value],
}));

const bowlingOptions: SelectOption[] = (Object.keys(BOWLING_STYLE_LABELS) as BowlingStyle[]).map((value) => ({
  value,
  label: BOWLING_STYLE_LABELS[value],
}));

/* ── Derived metrics ─────────────────────────────────── */

function battingAverage(p: Player): number {
  const dismissals = p.stats.innings - p.stats.notOuts;
  return dismissals > 0 ? p.stats.runs / dismissals : p.stats.runs;
}

function strikeRate(p: Player): number {
  return p.stats.ballsFaced > 0 ? (p.stats.runs / p.stats.ballsFaced) * 100 : 0;
}

function economyRate(p: Player): number {
  const overs = p.stats.ballsBowled / 6;
  return overs > 0 ? p.stats.runsConceded / overs : 0;
}

const fmt = (n: number, digits = 2) => (Number.isFinite(n) ? n.toFixed(digits) : '—');

/* ── Form values type ────────────────────────────────── */

interface PlayerFormValues {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  role: PlayerRole;
  status: PlayerStatus;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  jerseyNumber?: number;
  price?: number;
  ranking?: number;
}

export default function PlayersPage() {
  const toast = useToast();

  /* Table state */
  const table = useDataTable<Player>({
    initialPageSize: 10,
    initialSort: { key: 'displayName', direction: 'asc' },
    initialColumnVisibility: {
      battingStyle: false,
      bowlingStyle: false,
      price: true,
      ranking: true,
    },
  });

  /* Filters */
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /* Drawer / dialogs */
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; player: Player } | null>(null);

  /* Data */
  const { data, isLoading, isError, refetch } = usePlayers({
    page: table.page + 1,
    limit: table.pageSize,
    search: search || undefined,
    role: (roleFilter as PlayerRole) || undefined,
    status: (statusFilter as PlayerStatus) || undefined,
    sortBy: table.sort.key ?? undefined,
    sortOrder: table.sort.direction,
  });

  const players = data?.data ?? [];
  const total = data?.total ?? 0;

  /* Mutations */
  const createPlayer = useCreatePlayer();
  const updatePlayer = useUpdatePlayer();
  const deletePlayer = useDeletePlayer();
  const bulkUpdate = useBulkUpdatePlayers();
  const bulkDelete = useBulkDeletePlayers();

  /* Permissions */
  const canManagePlayers = useHasPermission('player', 'manage');

  /* ── Form ──────────────────────────────────────────── */

  const form = useForm<PlayerFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      role: 'batsman',
      status: 'active',
      battingStyle: 'right_hand',
      bowlingStyle: 'none',
    },
  });

  const openCreate = () => {
    setEditingPlayer(null);
    form.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      dateOfBirth: '',
      role: 'batsman',
      status: 'active',
      battingStyle: 'right_hand',
      bowlingStyle: 'none',
      jerseyNumber: undefined,
      price: undefined,
      ranking: undefined,
    });
    setFormOpen(true);
  };

  const openEdit = (player: Player) => {
    setEditingPlayer(player);
    form.reset({
      firstName: player.firstName,
      lastName: player.lastName,
      email: player.email ?? '',
      phone: player.phone ?? '',
      nationality: player.nationality ?? '',
      dateOfBirth: player.dateOfBirth ?? '',
      role: player.role,
      status: player.status,
      battingStyle: player.battingStyle,
      bowlingStyle: player.bowlingStyle,
      jerseyNumber: player.jerseyNumber,
      price: player.price,
      ranking: player.ranking,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (values: PlayerFormValues) => {
    if (editingPlayer) {
      await updatePlayer.mutateAsync({ playerId: editingPlayer.id, data: values });
      toast.success({ title: 'Player updated', description: `${values.firstName} ${values.lastName} saved.` });
    } else {
      await createPlayer.mutateAsync(values);
      toast.success({ title: 'Player created', description: `${values.firstName} ${values.lastName} added.` });
    }
    setFormOpen(false);
  };

  /* ── Delete ────────────────────────────────────────── */

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deletePlayer.mutateAsync(deleteTarget.id);
    toast.success({ title: 'Player deleted', description: `${deleteTarget.displayName} removed.` });
    setDeleteTarget(null);
    setDrawerOpen(false);
    setSelectedPlayer(null);
  };

  /* ── Bulk actions ──────────────────────────────────── */

  const selectedIds = useMemo(() => Array.from(table.selectedRowIds), [table.selectedRowIds]);

  const confirmBulkDelete = async () => {
    await bulkDelete.mutateAsync(selectedIds);
    toast.success({ title: 'Players deleted', description: `${selectedIds.length} players removed.` });
    setBulkDeleteOpen(false);
    table.clearSelection();
  };

  const confirmBulkStatus = async (status: PlayerStatus) => {
    await bulkUpdate.mutateAsync({ ids: selectedIds, data: { status } });
    toast.success({ title: 'Status updated', description: `${selectedIds.length} players set to ${PLAYER_STATUS_LABELS[status]}.` });
    setBulkStatusOpen(false);
    table.clearSelection();
  };

  const bulkActions: BulkAction[] = canManagePlayers
    ? [
        {
          id: 'status-active',
          label: 'Set Active',
          icon: <UserCheck size={16} />,
          onClick: () => setBulkStatusOpen(true),
        },
        {
          id: 'status-injured',
          label: 'Mark Injured',
          icon: <UserX size={16} />,
          onClick: () => setBulkStatusOpen(true),
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: <Trash2 size={16} />,
          destructive: true,
          onClick: () => setBulkDeleteOpen(true),
        },
      ]
    : [];

  /* ── Context menu ──────────────────────────────────── */

  const contextItems: ContextMenuItem[] = [
    {
      id: 'view',
      label: 'View details',
      icon: Eye,
      onClick: () => {
        if (contextMenu) {
          setSelectedPlayer(contextMenu.player);
          setDrawerOpen(true);
        }
      },
    },
    ...(canManagePlayers
      ? [
          {
            id: 'edit',
            label: 'Edit player',
            icon: Pencil,
            onClick: () => {
              if (contextMenu) openEdit(contextMenu.player);
            },
          },
          {
            id: 'divider-1',
            label: '',
            divider: true,
          },
          {
            id: 'delete',
            label: 'Delete player',
            icon: Trash2,
            destructive: true,
            onClick: () => {
              if (contextMenu) setDeleteTarget(contextMenu.player);
            },
          },
        ]
      : []),
  ];

  /* ── Columns ───────────────────────────────────────── */

  const columns: DataTableColumn<Player>[] = [
    {
      id: 'displayName',
      header: 'Player',
      sortValue: (row) => row.displayName,
      cell: (_, p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PlayerAvatar
            firstName={p.firstName}
            lastName={p.lastName}
            imageUrl={p.avatarUrl}
            size="sm"
            role={p.role === 'wicket_keeper' ? 'wk' : p.role === 'all_rounder' ? 'allrounder' : p.role}
          />
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{p.displayName}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {p.teamName ?? 'Unassigned'}
              {p.jerseyNumber ? ` · #${p.jerseyNumber}` : ''}
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      sortValue: (row) => PLAYER_ROLE_LABELS[row.role],
      cell: (_, p) => (
        <Chip label={PLAYER_ROLE_LABELS[p.role]} color={ROLE_COLORS[p.role]} size="small" variant="outlined" />
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (row) => PLAYER_STATUS_LABELS[row.status],
      cell: (_, p) => (
        <Chip label={PLAYER_STATUS_LABELS[p.status]} color={STATUS_COLORS[p.status]} size="small" />
      ),
    },
    {
      id: 'battingStyle',
      header: 'Batting',
      sortValue: (row) => BATTING_STYLE_LABELS[row.battingStyle],
      cell: (_, p) => (
        <Typography variant="body2" color="text.secondary">
          {BATTING_STYLE_LABELS[p.battingStyle]}
        </Typography>
      ),
    },
    {
      id: 'bowlingStyle',
      header: 'Bowling',
      sortValue: (row) => BOWLING_STYLE_LABELS[row.bowlingStyle],
      cell: (_, p) => (
        <Typography variant="body2" color="text.secondary">
          {BOWLING_STYLE_LABELS[p.bowlingStyle]}
        </Typography>
      ),
    },
    {
      id: 'runs',
      header: 'Runs',
      numeric: true,
      sortValue: (row) => row.stats.runs,
      cell: (_, p) => p.stats.runs.toLocaleString(),
    },
    {
      id: 'wickets',
      header: 'Wkts',
      numeric: true,
      sortValue: (row) => row.stats.wickets,
      cell: (_, p) => p.stats.wickets,
    },
    {
      id: 'battingAverage',
      header: 'Avg',
      numeric: true,
      sortValue: (row) => battingAverage(row),
      cell: (_, p) => fmt(battingAverage(p)),
    },
    {
      id: 'strikeRate',
      header: 'SR',
      numeric: true,
      sortValue: (row) => strikeRate(row),
      cell: (_, p) => fmt(strikeRate(p)),
    },
    {
      id: 'economy',
      header: 'Econ',
      numeric: true,
      sortValue: (row) => economyRate(row),
      cell: (_, p) => fmt(economyRate(p)),
    },
    {
      id: 'price',
      header: 'Price',
      numeric: true,
      sortValue: (row) => row.price ?? 0,
      cell: (_, p) => (p.price != null ? `₹${p.price.toLocaleString()}` : '—'),
    },
    {
      id: 'ranking',
      header: 'Rank',
      numeric: true,
      sortValue: (row) => row.ranking ?? 0,
      cell: (_, p) => (p.ranking != null ? `#${p.ranking}` : '—'),
    },
  ];

  /* ── Detail drawer fields ──────────────────────────── */

  const detailFields: DetailField[] = selectedPlayer
    ? [
        { label: 'Role', value: PLAYER_ROLE_LABELS[selectedPlayer.role], chip: true },
        { label: 'Status', value: PLAYER_STATUS_LABELS[selectedPlayer.status], chip: true },
        { label: 'Batting', value: BATTING_STYLE_LABELS[selectedPlayer.battingStyle] },
        { label: 'Bowling', value: BOWLING_STYLE_LABELS[selectedPlayer.bowlingStyle] },
        { label: 'Team', value: selectedPlayer.teamName ?? 'Unassigned' },
        { label: 'Nationality', value: selectedPlayer.nationality ?? '—' },
        { label: 'Matches', value: selectedPlayer.stats.matches, numeric: true },
        { label: 'Runs', value: selectedPlayer.stats.runs.toLocaleString(), numeric: true },
        { label: 'Wickets', value: selectedPlayer.stats.wickets, numeric: true },
        { label: 'Average', value: fmt(battingAverage(selectedPlayer)), numeric: true },
        { label: 'Strike rate', value: fmt(strikeRate(selectedPlayer)), numeric: true },
        { label: 'Economy', value: fmt(economyRate(selectedPlayer)), numeric: true },
        { label: 'Price', value: selectedPlayer.price != null ? `₹${selectedPlayer.price.toLocaleString()}` : '—', numeric: true },
        { label: 'Ranking', value: selectedPlayer.ranking != null ? `#${selectedPlayer.ranking}` : '—', numeric: true },
      ]
    : [];

  /* ── Export ────────────────────────────────────────── */

  const handleExport = () => {
    const header = ['Name', 'Role', 'Status', 'Runs', 'Wickets', 'Avg', 'SR', 'Econ', 'Price', 'Rank'];
    const rows = players.map((p) => [
      p.displayName,
      PLAYER_ROLE_LABELS[p.role],
      PLAYER_STATUS_LABELS[p.status],
      p.stats.runs,
      p.stats.wickets,
      fmt(battingAverage(p)),
      fmt(strikeRate(p)),
      fmt(economyRate(p)),
      p.price ?? '',
      p.ranking ?? '',
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'players.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success({ title: 'Export started', description: `${players.length} players exported.` });
  };

  const toolbarColumns = columns
    .filter((c) => c.id !== 'displayName')
    .map((c) => ({
      id: c.id!,
      label: String(c.header),
      visible: table.columnVisibility[c.id!] ?? true,
    }));

  return (
    <PageShell>
      <PageHeader
        title="Players"
        description="Manage your squad — roles, styles, and career statistics"
        actions={
          canManagePlayers ? (
            <Button startIcon={<Plus size={16} />} variant="primary" size="small" onClick={openCreate}>
              New Player
            </Button>
          ) : undefined
        }
      />

      <PageToolbar>
        <Input
          placeholder="Search players..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            table.setPage(0);
          }}
          size="small"
          sx={{ minWidth: 280, width: { xs: '100%', sm: 'auto' } }}
          slotProps={{
            input: {
              startAdornment: <Search size={16} />,
            },
          }}
        />
        <Select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as string);
            table.setPage(0);
          }}
          size="small"
          sx={{ minWidth: 150 }}
          options={[{ value: '', label: 'All Roles' }, ...roleOptions]}
        />
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as string);
            table.setPage(0);
          }}
          size="small"
          sx={{ minWidth: 150 }}
          options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
        />
      </PageToolbar>

      <TableToolbar
        title="Squad"
        resultCount={total}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          table.setPage(0);
        }}
        searchPlaceholder="Search players..."
        primaryAction={
          canManagePlayers ? (
            <Button startIcon={<Plus size={16} />} variant="primary" size="small" onClick={openCreate}>
              New Player
            </Button>
          ) : undefined
        }
        columns={toolbarColumns}
        onToggleColumn={table.toggleColumn}
        onResetColumns={table.resetColumnVisibility}
        density={table.density}
        onDensityChange={table.setDensity}
        onExport={handleExport}
      />

      <DataTable
        columns={columns}
        data={players}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={table.selectedRowIds}
        onSelectionChange={table.setSelectedRowIds}
        sortKey={table.sort.key}
        sortDirection={table.sort.direction}
        onSortChange={table.setSort}
        columnVisibility={table.columnVisibility}
        density={table.density}
        loading={isLoading}
        loadingRows={8}
        error={isError}
        errorTitle="Unable to load players"
        errorDescription="There was a problem fetching your squad. Please try again."
        onRetry={() => refetch()}
        emptyTitle="No players found"
        emptyDescription="Try adjusting your search or filters, or add a new player."
        stickyHeader
        maxHeight={560}
        onRowClick={(row) => {
          setSelectedPlayer(row);
          setDrawerOpen(true);
        }}
        onContextMenu={(row, e) => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY, player: row });
        }}
        ariaLabel="Players table"
      />

      <TablePagination
        count={total}
        page={table.page}
        onPageChange={table.setPage}
        rowsPerPage={table.pageSize}
        onRowsPerPageChange={(size) => {
          table.setPageSize(size);
          table.setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <BulkActionBar
        selectedCount={table.selectedCount}
        onClearSelection={table.clearSelection}
        actions={bulkActions}
        countLabel={(count) => `${count} player${count === 1 ? '' : 's'} selected`}
      />

      {/* Context menu */}
      <ContextMenu
        anchorPosition={contextMenu ? { x: contextMenu.x, y: contextMenu.y } : null}
        onClose={() => setContextMenu(null)}
        items={contextItems}
        header={
          contextMenu ? (
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">{contextMenu.player.displayName}</Typography>
            </Box>
          ) : undefined
        }
      />

      {/* Detail drawer */}
      <DetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedPlayer?.displayName}
        subtitle={selectedPlayer ? `${PLAYER_ROLE_LABELS[selectedPlayer.role]} · ${selectedPlayer.teamName ?? 'Unassigned'}` : undefined}
        avatar={
          selectedPlayer ? (
            <PlayerAvatar
              firstName={selectedPlayer.firstName}
              lastName={selectedPlayer.lastName}
              imageUrl={selectedPlayer.avatarUrl}
              size="lg"
              role={selectedPlayer.role === 'wicket_keeper' ? 'wk' : selectedPlayer.role === 'all_rounder' ? 'allrounder' : selectedPlayer.role}
            />
          ) : undefined
        }
        status={
          selectedPlayer ? (
            <Chip label={PLAYER_STATUS_LABELS[selectedPlayer.status]} color={STATUS_COLORS[selectedPlayer.status]} size="small" />
          ) : undefined
        }
        fields={detailFields}
        footer={
          selectedPlayer && canManagePlayers ? (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button
                variant="secondary"
                size="small"
                startIcon={<Pencil size={16} />}
                onClick={() => {
                  setDrawerOpen(false);
                  openEdit(selectedPlayer);
                }}
                sx={{ flex: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="small"
                startIcon={<Trash2 size={16} />}
                onClick={() => setDeleteTarget(selectedPlayer)}
                sx={{ flex: 1 }}
              >
                Delete
              </Button>
            </Box>
          ) : undefined
        }
      />

      {/* Create / Edit form dialog */}
      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirmClose={() => setFormOpen(false)}
        title={editingPlayer ? 'Edit player' : 'New player'}
        subtitle={editingPlayer ? editingPlayer.displayName : 'Add a player to your squad'}
        submitting={createPlayer.isPending || updatePlayer.isPending}
        dirty={form.formState.isDirty}
        submitLabel={editingPlayer ? 'Save changes' : 'Create player'}
        onSubmit={form.handleSubmit(handleSubmit)}
        successTitle={editingPlayer ? 'Player updated' : 'Player created'}
        successDescription="The player record has been saved."
        maxWidth="sm"
      >
        <Form form={form} onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormRow columns={2}>
              <FormInput name="firstName" label="First name" required placeholder="Virat" />
              <FormInput name="lastName" label="Last name" required placeholder="Kohli" />
            </FormRow>
            <FormRow columns={2}>
              <FormInput name="email" label="Email" type="email" placeholder="player@club.com" />
              <FormInput name="phone" label="Phone" placeholder="+91 90000 00000" />
            </FormRow>
            <FormRow columns={2}>
              <FormSelect name="role" label="Role" required options={roleOptions} />
              <FormSelect name="status" label="Status" options={statusOptions} />
            </FormRow>
            <FormRow columns={2}>
              <FormSelect name="battingStyle" label="Batting style" options={battingOptions} />
              <FormSelect name="bowlingStyle" label="Bowling style" options={bowlingOptions} />
            </FormRow>
            <FormRow columns={2}>
              <FormInput name="nationality" label="Nationality" placeholder="India" />
              <FormInput name="dateOfBirth" label="Date of birth" type="date" />
            </FormRow>
            <FormRow columns={3}>
              <FormInput name="jerseyNumber" label="Jersey #" type="number" />
              <FormInput name="price" label="Price (₹)" type="number" />
              <FormInput name="ranking" label="Ranking" type="number" />
            </FormRow>
          </Box>
        </Form>
      </FormDialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete player?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.displayName} from your squad. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={deletePlayer.isPending}
      />

      {/* Bulk delete confirmation */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Delete selected players?"
        description={`This will permanently remove ${selectedIds.length} player${selectedIds.length === 1 ? '' : 's'}. This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={bulkDelete.isPending}
      />

      {/* Bulk status confirmation */}
      <ConfirmDialog
        open={bulkStatusOpen}
        onClose={() => setBulkStatusOpen(false)}
        onConfirm={() => confirmBulkStatus('active')}
        title="Update player status?"
        description={`Set ${selectedIds.length} selected player${selectedIds.length === 1 ? '' : 's'} to Active?`}
        confirmLabel="Set Active"
        cancelLabel="Cancel"
        loading={bulkUpdate.isPending}
      />
    </PageShell>
  );
}
