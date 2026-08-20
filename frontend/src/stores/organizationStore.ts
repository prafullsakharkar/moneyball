import { create } from 'zustand';
import type { Organization, Membership } from '@domain/index';
import { getStoredOrgId, setStoredOrgId, removeStoredOrgId } from '@core/storage';

/* ── State ─────────────────────────────────────────────────── */

interface OrganizationState {
  currentOrganization: Organization | null;
  organizations: Organization[];
  memberships: Membership[];
  isSwitching: boolean;

  initialize: (memberships: Membership[]) => void;
  switchOrganization: (organizationId: string) => Membership | null;
  clear: () => void;
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  currentOrganization: null,
  organizations: [],
  memberships: [],
  isSwitching: false,

  initialize: (memberships) => {
    const active = memberships.filter((m) => m.status === 'active');
    const orgs = active.map((m) => m.organization);

    const savedOrgId = getStoredOrgId();
    let current: Organization | null = null;

    if (savedOrgId) {
      current = orgs.find((o) => o.id === savedOrgId) ?? null;
    }

    if (!current && orgs.length > 0) {
      current = orgs[0];
    }

    if (current) {
      setStoredOrgId(current.id);
    }

    set({ currentOrganization: current, organizations: orgs, memberships: active });
  },

  switchOrganization: (organizationId) => {
    const state = get();
    const membership = state.memberships.find(
      (m) => m.organizationId === organizationId && m.status === 'active'
    );

    if (!membership) return null;

    setStoredOrgId(organizationId);
    set({ currentOrganization: membership.organization, isSwitching: false });

    return membership;
  },

  clear: () => {
    removeStoredOrgId();
    set({ currentOrganization: null, organizations: [], memberships: [], isSwitching: false });
  },
}));
