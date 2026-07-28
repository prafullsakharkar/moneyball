// Media Service with CRUD operations and media management

import { pool } from '../config/database';
import {
  MediaFile,
  MediaAlbum,
  MediaAlbumItem,
  MediaTag,
  MediaAnalytics,
  MediaFileCreateInput,
  MediaFileUpdateInput,
  MediaAlbumCreateInput,
  MediaAlbumUpdateInput,
  MediaAlbumItemCreateInput,
  MediaTagCreateInput,
  MediaAnalyticsUpdateInput,
  MediaType,
  StorageProvider
} from '../models/Media';

// Media File Service
export class MediaFileService {
  // Get media files by entity
  async getMediaFilesByEntity(
    entityType: MediaType,
    entityId: string,
    params?: { fileType?: string; isPrimary?: boolean; limit?: number; offset?: number }
  ): Promise<{ files: MediaFile[]; total: number }> {
    const client = await pool.connect();
    try {
      const { fileType, isPrimary, limit = 10, offset = 0 } = params || {};
      const values: any[] = [entityType, entityId];
      let paramIndex = 3;

      const conditions: string[] = ['entity_type = $1', 'entity_id = $2'];
      if (fileType) {
        conditions.push(`file_type = $${paramIndex++}`);
        values.push(fileType);
      }
      if (isPrimary !== undefined) {
        conditions.push(`is_primary = $${paramIndex++}`);
        values.push(isPrimary);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM media_files WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM media_files WHERE ${whereClause}`,
        values
      );

      return {
        files: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get media file by ID
  async getMediaFileById(id: string): Promise<MediaFile | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM media_files WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create media file
  async createMediaFile(input: MediaFileCreateInput): Promise<MediaFile> {
    const client = await pool.connect();
    try {
      const {
        entityType,
        entityId,
        fileName,
        filePath,
        fileUrl,
        fileType,
        fileSize,
        fileFormat,
        storageProvider = 's3',
        bucketName,
        objectKey,
        thumbnailUrl,
        duration,
        width,
        height,
        metadata,
        isPrimary = false
      } = input;

      const result = await client.query(
        `
        INSERT INTO media_files (
          id, entity_type, entity_id, file_name, file_path, file_url, file_type,
          file_size, file_format, storage_provider, bucket_name, object_key,
          thumbnail_url, duration, width, height, metadata, is_primary
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
        RETURNING *
        `,
        [
          entityType, entityId, fileName, filePath, fileUrl, fileType, fileSize,
          fileFormat, storageProvider, bucketName, objectKey, thumbnailUrl,
          duration, width, height, metadata ? JSON.stringify(metadata) : null, isPrimary
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update media file
  async updateMediaFile(id: string, input: MediaFileUpdateInput): Promise<MediaFile> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.fileName) {
        updates.push(`file_name = $${paramIndex++}`);
        values.push(input.fileName);
      }
      if (input.filePath) {
        updates.push(`file_path = $${paramIndex++}`);
        values.push(input.filePath);
      }
      if (input.fileUrl) {
        updates.push(`file_url = $${paramIndex++}`);
        values.push(input.fileUrl);
      }
      if (input.thumbnailUrl) {
        updates.push(`thumbnail_url = $${paramIndex++}`);
        values.push(input.thumbnailUrl);
      }
      if (input.duration !== undefined) {
        updates.push(`duration = $${paramIndex++}`);
        values.push(input.duration);
      }
      if (input.width !== undefined) {
        updates.push(`width = $${paramIndex++}`);
        values.push(input.width);
      }
      if (input.height !== undefined) {
        updates.push(`height = $${paramIndex++}`);
        values.push(input.height);
      }
      if (input.metadata) {
        updates.push(`metadata = $${paramIndex++}`);
        values.push(JSON.stringify(input.metadata));
      }
      if (input.isPrimary !== undefined) {
        updates.push(`is_primary = $${paramIndex++}`);
        values.push(input.isPrimary);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM media_files WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE media_files SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete media file
  async deleteMediaFile(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM media_files WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Set primary media file
  async setPrimaryMediaFile(entityType: MediaType, entityId: string, mediaFileId: string): Promise<void> {
    const client = await pool.connect();
    try {
      // First, unset all primary files for this entity
      await client.query(
        'UPDATE media_files SET is_primary = false WHERE entity_type = $1 AND entity_id = $2',
        [entityType, entityId]
      );

      // Then set the new primary file
      await client.query(
        'UPDATE media_files SET is_primary = true WHERE id = $1',
        [mediaFileId]
      );
    } finally {
      client.release();
    }
  }
}

// Media Album Service
export class MediaAlbumService {
  // Get media albums by entity
  async getMediaAlbumsByEntity(
    entityType: MediaType,
    entityId: string
  ): Promise<MediaAlbum[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM media_albums WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC',
        [entityType, entityId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get media album by ID
  async getMediaAlbumById(id: string): Promise<MediaAlbum | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM media_albums WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create media album
  async createMediaAlbum(input: MediaAlbumCreateInput): Promise<MediaAlbum> {
    const client = await pool.connect();
    try {
      const {
        name,
        description,
        entityType,
        entityId,
        coverImageId,
        isPrivate = false
      } = input;

      const result = await client.query(
        `
        INSERT INTO media_albums (
          id, name, description, entity_type, entity_id, cover_image_id, is_private
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6
        )
        RETURNING *
        `,
        [name, description, entityType, entityId, coverImageId, isPrivate]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update media album
  async updateMediaAlbum(id: string, input: MediaAlbumUpdateInput): Promise<MediaAlbum> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.description) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.coverImageId) {
        updates.push(`cover_image_id = $${paramIndex++}`);
        values.push(input.coverImageId);
      }
      if (input.isPrivate !== undefined) {
        updates.push(`is_private = $${paramIndex++}`);
        values.push(input.isPrivate);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM media_albums WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE media_albums SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete media album
  async deleteMediaAlbum(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM media_albums WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Add media file to album
  async addMediaFileToAlbum(input: MediaAlbumItemCreateInput): Promise<MediaAlbumItem> {
    const client = await pool.connect();
    try {
      const { albumId, mediaFileId, sortOrder = 0 } = input;

      const result = await client.query(
        `
        INSERT INTO media_album_items (id, album_id, media_file_id, sort_order)
        VALUES (gen_random_uuid(), $1, $2, $3)
        RETURNING *
        `,
        [albumId, mediaFileId, sortOrder]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Remove media file from album
  async removeMediaFileFromAlbum(albumId: string, mediaFileId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM media_album_items WHERE album_id = $1 AND media_file_id = $2 RETURNING id',
        [albumId, mediaFileId]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Get album items
  async getAlbumItems(albumId: string): Promise<MediaAlbumItem[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM media_album_items WHERE album_id = $1 ORDER BY sort_order',
        [albumId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

// Media Tag Service
export class MediaTagService {
  // Get tags for a media file
  async getTagsByMediaFile(mediaFileId: string): Promise<MediaTag[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM media_tags WHERE media_file_id = $1',
        [mediaFileId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Add tag to media file
  async addTag(input: MediaTagCreateInput): Promise<MediaTag> {
    const client = await pool.connect();
    try {
      const { mediaFileId, tag } = input;

      const result = await client.query(
        `
        INSERT INTO media_tags (id, media_file_id, tag)
        VALUES (gen_random_uuid(), $1, $2)
        RETURNING *
        `,
        [mediaFileId, tag]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Remove tag from media file
  async removeTag(mediaFileId: string, tag: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM media_tags WHERE media_file_id = $1 AND tag = $2 RETURNING id',
        [mediaFileId, tag]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Search media by tag
  async searchByTag(tag: string, params?: { limit?: number; offset?: number }): Promise<{ files: MediaFile[]; total: number }> {
    const client = await pool.connect();
    try {
      const { limit = 10, offset = 0 } = params || {};

      const result = await client.query(
        `
        SELECT mf.* FROM media_files mf
        JOIN media_tags mt ON mf.id = mt.media_file_id
        WHERE mt.tag = $1
        ORDER BY mf.created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [tag, limit, offset]
      );

      const countResult = await client.query(
        'SELECT COUNT(*) FROM media_tags WHERE tag = $1',
        [tag]
      );

      return {
        files: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }
}

// Media Analytics Service
export class MediaAnalyticsService {
  // Get analytics for a media file
  async getAnalytics(mediaFileId: string): Promise<MediaAnalytics | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM media_analytics WHERE media_file_id = $1',
        [mediaFileId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create or update analytics
  async upsertAnalytics(mediaFileId: string, input: MediaAnalyticsUpdateInput): Promise<MediaAnalytics> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.views !== undefined) {
        updates.push(`views = $${paramIndex++}`);
        values.push(input.views);
      }
      if (input.downloads !== undefined) {
        updates.push(`downloads = $${paramIndex++}`);
        values.push(input.downloads);
      }
      if (input.likes !== undefined) {
        updates.push(`likes = $${paramIndex++}`);
        values.push(input.likes);
      }
      if (input.shares !== undefined) {
        updates.push(`shares = $${paramIndex++}`);
        values.push(input.shares);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        // Check if record exists
        const existing = await client.query(
          'SELECT * FROM media_analytics WHERE media_file_id = $1',
          [mediaFileId]
        );
        if (existing.rows.length === 0) {
          // Create new record
          const result = await client.query(
            `
            INSERT INTO media_analytics (id, media_file_id, views, downloads, likes, shares)
            VALUES (gen_random_uuid(), $1, 0, 0, 0, 0)
            RETURNING *
            `,
            [mediaFileId]
          );
          return result.rows[0];
        }
        return existing.rows[0];
      }

      values.push(mediaFileId);
      const query = `
        INSERT INTO media_analytics (id, media_file_id, views, downloads, likes, shares)
        VALUES (gen_random_uuid(), $1, 0, 0, 0, 0)
        ON CONFLICT (media_file_id) DO UPDATE SET ${updates.join(', ')}
        RETURNING *
      `;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Increment view count
  async incrementViews(mediaFileId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `
        INSERT INTO media_analytics (id, media_file_id, views, last_viewed_at)
        VALUES (gen_random_uuid(), $1, 1, CURRENT_TIMESTAMP)
        ON CONFLICT (media_file_id) DO UPDATE SET
          views = media_analytics.views + 1,
          last_viewed_at = CURRENT_TIMESTAMP
        `,
        [mediaFileId]
      );
    } finally {
      client.release();
    }
  }

  // Increment download count
  async incrementDownloads(mediaFileId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `
        INSERT INTO media_analytics (id, media_file_id, downloads, last_downloaded_at)
        VALUES (gen_random_uuid(), $1, 1, CURRENT_TIMESTAMP)
        ON CONFLICT (media_file_id) DO UPDATE SET
          downloads = media_analytics.downloads + 1,
          last_downloaded_at = CURRENT_TIMESTAMP
        `,
        [mediaFileId]
      );
    } finally {
      client.release();
    }
  }
}

// Export all services
export const mediaFileService = new MediaFileService();
export const mediaAlbumService = new MediaAlbumService();
export const mediaTagService = new MediaTagService();
export const mediaAnalyticsService = new MediaAnalyticsService();
