/**
 * useFilteredNavigation
 * ============================================
 * Returns the navigation sections filtered by the current user's
 * permissions in the active organization.
 *
 * Items without a `permission` are always visible. Items with a permission
 * are visible only when the user holds that permission (or is an owner).
 * This makes the shell both organization-aware and permission-aware.
 */
import { useMemo } from 'react';
import { NAV_SECTIONS, type NavSection } from '@layouts/navigation';
import { useOrgContext } from './useOrgContext';

export function useFilteredNavigation(): NavSection[] {
  const { permissions, role } = useOrgContext();

  return useMemo(() => {
    const isOwner = role === 'owner';

    return NAV_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        if (!item.permission) return true;
        if (isOwner) return true;
        return permissions.some(
          (p) =>
            p.resource === item.permission!.resource &&
            (p.action === item.permission!.action || p.action === 'manage')
        );
      });

      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [permissions, role]);
}
