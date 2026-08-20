/**
 * Legacy organization service.
 * Re-exports from the repository layer.
 * Remove once all consumers import from @api/repositories directly.
 */
export { organizationRepository as organizationService } from './repositories/organization';
