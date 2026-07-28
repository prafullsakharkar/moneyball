// Routes for Video Analysis Service

import { Router } from 'express';
import {
  videoAnalysisSessionService,
  videoAnalysisResultService,
  videoAnnotationService,
  videoHighlightService,
  videoTagService
} from '../services/VideoAnalysisService';
import {
  VideoAnalysisSessionCreateInput,
  VideoAnalysisSessionUpdateInput,
  VideoAnalysisResultCreateInput,
  VideoAnnotationCreateInput,
  VideoHighlightCreateInput,
  VideoTagCreateInput,
  AnalysisType,
  SessionStatus,
  AnnotationType,
  HighlightType
} from '../models/VideoAnalysis';

const router = Router();

// Video Analysis Session routes
router.get('/video-analysis/sessions', async (req, res) => {
  try {
    const { matchId, playerId, status, limit, offset } = req.query;
    let sessions;
    if (matchId) {
      sessions = await videoAnalysisSessionService.getSessionsByMatch(matchId);
    } else if (playerId) {
      sessions = await videoAnalysisSessionService.getSessionsByPlayer(playerId);
    } else {
      sessions = [];
    }
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video analysis sessions' });
  }
});

router.get('/video-analysis/sessions/:id', async (req, res) => {
  try {
    const session = await videoAnalysisSessionService.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Video analysis session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video analysis session' });
  }
});

router.post('/video-analysis/sessions', async (req, res) => {
  try {
    const input: VideoAnalysisSessionCreateInput = req.body;
    const session = await videoAnalysisSessionService.createSession(input);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create video analysis session' });
  }
});

router.patch('/video-analysis/sessions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const session = await videoAnalysisSessionService.updateSessionStatus(req.params.id, status);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update video analysis session status' });
  }
});

router.post('/video-analysis/sessions/:id/complete', async (req, res) => {
  try {
    const { resultUrl, confidenceScore, duration } = req.body;
    const session = await videoAnalysisSessionService.completeSession(req.params.id, resultUrl, confidenceScore, duration);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete video analysis session' });
  }
});

router.delete('/video-analysis/sessions/:id', async (req, res) => {
  try {
    const deleted = await videoAnalysisSessionService.deleteSession(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Video analysis session not found' });
    }
    res.json({ success: true, message: 'Video analysis session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete video analysis session' });
  }
});

// Video Analysis Result routes
router.get('/video-analysis/sessions/:sessionId/results', async (req, res) => {
  try {
    const results = await videoAnalysisResultService.getResultsBySession(req.params.sessionId);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video analysis results' });
  }
});

router.get('/video-analysis/results/:id', async (req, res) => {
  try {
    const result = await videoAnalysisResultService.getResultById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Video analysis result not found' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video analysis result' });
  }
});

router.post('/video-analysis/sessions/:sessionId/results', async (req, res) => {
  try {
    const input: VideoAnalysisResultCreateInput = { ...req.body, sessionId: req.params.sessionId };
    const result = await videoAnalysisResultService.createResult(input);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create video analysis result' });
  }
});

router.delete('/video-analysis/results/:id', async (req, res) => {
  try {
    const deleted = await videoAnalysisResultService.deleteResult(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Video analysis result not found' });
    }
    res.json({ success: true, message: 'Video analysis result deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete video analysis result' });
  }
});

// Video Annotation routes
router.get('/video-analysis/sessions/:sessionId/annotations', async (req, res) => {
  try {
    const annotations = await videoAnnotationService.getAnnotationsBySession(req.params.sessionId);
    res.json({ success: true, data: annotations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video annotations' });
  }
});

router.get('/video-analysis/annotations/:id', async (req, res) => {
  try {
    const annotation = await videoAnnotationService.getAnnotationById(req.params.id);
    if (!annotation) {
      return res.status(404).json({ success: false, error: 'Video annotation not found' });
    }
    res.json({ success: true, data: annotation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video annotation' });
  }
});

router.post('/video-analysis/sessions/:sessionId/annotations', async (req, res) => {
  try {
    const input: VideoAnnotationCreateInput = { ...req.body, sessionId: req.params.sessionId };
    const annotation = await videoAnnotationService.createAnnotation(input);
    res.status(201).json({ success: true, data: annotation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create video annotation' });
  }
});

router.delete('/video-analysis/annotations/:id', async (req, res) => {
  try {
    const deleted = await videoAnnotationService.deleteAnnotation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Video annotation not found' });
    }
    res.json({ success: true, message: 'Video annotation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete video annotation' });
  }
});

// Video Highlight routes
router.get('/video-analysis/sessions/:sessionId/highlights', async (req, res) => {
  try {
    const highlights = await videoHighlightService.getHighlightsBySession(req.params.sessionId);
    res.json({ success: true, data: highlights });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video highlights' });
  }
});

router.get('/video-analysis/sessions/:sessionId/highlights/featured', async (req, res) => {
  try {
    const highlights = await videoHighlightService.getFeaturedHighlights(req.params.sessionId);
    res.json({ success: true, data: highlights });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch featured video highlights' });
  }
});

router.get('/video-analysis/highlights/:id', async (req, res) => {
  try {
    const highlight = await videoHighlightService.getHighlightById(req.params.id);
    if (!highlight) {
      return res.status(404).json({ success: false, error: 'Video highlight not found' });
    }
    res.json({ success: true, data: highlight });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video highlight' });
  }
});

router.post('/video-analysis/sessions/:sessionId/highlights', async (req, res) => {
  try {
    const input: VideoHighlightCreateInput = { ...req.body, sessionId: req.params.sessionId };
    const highlight = await videoHighlightService.createHighlight(input);
    res.status(201).json({ success: true, data: highlight });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create video highlight' });
  }
});

router.put('/video-analysis/highlights/:id', async (req, res) => {
  try {
    const highlight = await videoHighlightService.updateHighlight(req.params.id, req.body);
    res.json({ success: true, data: highlight });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update video highlight' });
  }
});

router.delete('/video-analysis/highlights/:id', async (req, res) => {
  try {
    const deleted = await videoHighlightService.deleteHighlight(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Video highlight not found' });
    }
    res.json({ success: true, message: 'Video highlight deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete video highlight' });
  }
});

// Video Tag routes
router.get('/video-analysis/sessions/:sessionId/tags', async (req, res) => {
  try {
    const tags = await videoTagService.getTagsBySession(req.params.sessionId);
    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video tags' });
  }
});

router.get('/video-analysis/tags/:id', async (req, res) => {
  try {
    const tag = await videoTagService.getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Video tag not found' });
    }
    res.json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video tag' });
  }
});

router.post('/video-analysis/sessions/:sessionId/tags', async (req, res) => {
  try {
    const input: VideoTagCreateInput = { ...req.body, sessionId: req.params.sessionId };
    const tag = await videoTagService.createTag(input);
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create video tag' });
  }
});

router.delete('/video-analysis/tags/:id', async (req, res) => {
  try {
    const deleted = await videoTagService.deleteTag(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Video tag not found' });
    }
    res.json({ success: true, message: 'Video tag deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete video tag' });
  }
});

export default router;
