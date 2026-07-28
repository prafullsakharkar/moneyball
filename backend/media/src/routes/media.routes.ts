// Routes for Media Service

import { Router } from 'express';
import {
  mediaFileService,
  mediaAlbumService,
  mediaTagService,
  mediaAnalyticsService
} from '../services/MediaService';
import {
  MediaFileCreateInput,
  MediaFileUpdateInput,
  MediaAlbumCreateInput,
  MediaAlbumUpdateInput,
  MediaAlbumItemCreateInput,
  MediaTagCreateInput,
  MediaAnalyticsUpdateInput,
  MediaType
} from '../models/Media';

const router = Router();

// Media File routes
router.get('/media', async (req, res) => {
  try {
    const { entityType, entityId, fileType, isPrimary, limit, offset } = req.query;
    const params: any = {};
    if (entityType) params.entityType = entityType as MediaType;
    if (entityId) params.entityId = entityId;
    if (fileType) params.fileType = fileType;
    if (isPrimary !== undefined) params.isPrimary = isPrimary === 'true';
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await mediaFileService.getMediaFilesByEntity(
      params.entityType,
      params.entityId,
      params
    );
    res.json({ success: true, data: result.files, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media files' });
  }
});

router.get('/media/:id', async (req, res) => {
  try {
    const mediaFile = await mediaFileService.getMediaFileById(req.params.id);
    if (!mediaFile) {
      return res.status(404).json({ success: false, error: 'Media file not found' });
    }
    res.json({ success: true, data: mediaFile });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media file' });
  }
});

router.post('/media', async (req, res) => {
  try {
    const input: MediaFileCreateInput = req.body;
    const mediaFile = await mediaFileService.createMediaFile(input);
    res.status(201).json({ success: true, data: mediaFile });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create media file' });
  }
});

router.put('/media/:id', async (req, res) => {
  try {
    const input: MediaFileUpdateInput = req.body;
    const mediaFile = await mediaFileService.updateMediaFile(req.params.id, input);
    res.json({ success: true, data: mediaFile });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update media file' });
  }
});

router.delete('/media/:id', async (req, res) => {
  try {
    const deleted = await mediaFileService.deleteMediaFile(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Media file not found' });
    }
    res.json({ success: true, message: 'Media file deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete media file' });
  }
});

router.patch('/media/:id/primary', async (req, res) => {
  try {
    const { entityType, entityId } = req.body;
    await mediaFileService.setPrimaryMediaFile(entityType, entityId, req.params.id);
    res.json({ success: true, message: 'Primary media file updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update primary media file' });
  }
});

// Media Album routes
router.get('/media/albums', async (req, res) => {
  try {
    const { entityType, entityId } = req.query;
    const albums = await mediaAlbumService.getMediaAlbumsByEntity(
      entityType as MediaType,
      entityId as string
    );
    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media albums' });
  }
});

router.get('/media/albums/:id', async (req, res) => {
  try {
    const album = await mediaAlbumService.getMediaAlbumById(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, error: 'Media album not found' });
    }
    res.json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media album' });
  }
});

router.post('/media/albums', async (req, res) => {
  try {
    const input: MediaAlbumCreateInput = req.body;
    const album = await mediaAlbumService.createMediaAlbum(input);
    res.status(201).json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create media album' });
  }
});

router.put('/media/albums/:id', async (req, res) => {
  try {
    const input: MediaAlbumUpdateInput = req.body;
    const album = await mediaAlbumService.updateMediaAlbum(req.params.id, input);
    res.json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update media album' });
  }
});

router.delete('/media/albums/:id', async (req, res) => {
  try {
    const deleted = await mediaAlbumService.deleteMediaAlbum(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Media album not found' });
    }
    res.json({ success: true, message: 'Media album deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete media album' });
  }
});

// Media Album Items routes
router.post('/media/albums/:albumId/items', async (req, res) => {
  try {
    const input: MediaAlbumItemCreateInput = { ...req.body, albumId: req.params.albumId };
    const item = await mediaAlbumService.addMediaFileToAlbum(input);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add media file to album' });
  }
});

router.delete('/media/albums/:albumId/items/:mediaFileId', async (req, res) => {
  try {
    const deleted = await mediaAlbumService.removeMediaFileFromAlbum(
      req.params.albumId,
      req.params.mediaFileId
    );
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Album item not found' });
    }
    res.json({ success: true, message: 'Media file removed from album' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove media file from album' });
  }
});

router.get('/media/albums/:albumId/items', async (req, res) => {
  try {
    const items = await mediaAlbumService.getAlbumItems(req.params.albumId);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch album items' });
  }
});

// Media Tag routes
router.get('/media/:mediaFileId/tags', async (req, res) => {
  try {
    const tags = await mediaTagService.getTagsByMediaFile(req.params.mediaFileId);
    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media tags' });
  }
});

router.post('/media/:mediaFileId/tags', async (req, res) => {
  try {
    const input: MediaTagCreateInput = { ...req.body, mediaFileId: req.params.mediaFileId };
    const tag = await mediaTagService.addTag(input);
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add media tag' });
  }
});

router.delete('/media/:mediaFileId/tags/:tag', async (req, res) => {
  try {
    const deleted = await mediaTagService.removeTag(req.params.mediaFileId, req.params.tag);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Media tag not found' });
    }
    res.json({ success: true, message: 'Media tag removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove media tag' });
  }
});

router.get('/media/search/tags', async (req, res) => {
  try {
    const { tag, limit, offset } = req.query;
    const result = await mediaTagService.searchByTag(tag as string, { limit, offset });
    res.json({ success: true, data: result.files, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search media by tag' });
  }
});

// Media Analytics routes
router.get('/media/:mediaFileId/analytics', async (req, res) => {
  try {
    const analytics = await mediaAnalyticsService.getAnalytics(req.params.mediaFileId);
    if (!analytics) {
      return res.status(404).json({ success: false, error: 'Media analytics not found' });
    }
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media analytics' });
  }
});

router.post('/media/:mediaFileId/analytics', async (req, res) => {
  try {
    const input: MediaAnalyticsUpdateInput = req.body;
    const analytics = await mediaAnalyticsService.upsertAnalytics(req.params.mediaFileId, input);
    res.status(201).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create media analytics' });
  }
});

router.patch('/media/:mediaFileId/analytics/views', async (req, res) => {
  try {
    await mediaAnalyticsService.incrementViews(req.params.mediaFileId);
    res.json({ success: true, message: 'View count incremented' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to increment view count' });
  }
});

router.patch('/media/:mediaFileId/analytics/downloads', async (req, res) => {
  try {
    await mediaAnalyticsService.incrementDownloads(req.params.mediaFileId);
    res.json({ success: true, message: 'Download count incremented' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to increment download count' });
  }
});

export default router;
