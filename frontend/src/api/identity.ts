/**
 * Legacy identity service.
 * Re-exports from the repository layer.
 * Remove once all consumers import from @api/repositories directly.
 */
export { identityRepository as identityService } from './repositories/identity';
