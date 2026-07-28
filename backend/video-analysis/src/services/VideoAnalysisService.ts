// Video Analysis Service with CRUD operations and video analysis management

import { pool } from '../config/database';
import {
  VideoAnalysisSession,
  VideoAnalysisResult,
  VideoAnnotation,
  VideoHighlight,
  VideoTag,
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

// Video Analysis Session Service
export class VideoAnalysisSessionService {
  // Get sessions by match
  async getSessionsByMatch(matchId: string): Promise<VideoAnalysisSession[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM video_analysis_sessions WHERE match_id = $1 ORDER BY created_at DESC',
        [matchId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get sessions by player
  async getSessionsByPlayer(playerId: string): Promise<VideoAnalysisSession[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM video_analysis_sessions WHERE player_id = $1 ORDER BY created_at DESC',
        [playerId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get session by ID
  async getSessionById(id: string): Promise<VideoAnalysisSession | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM video_analysis_sessions WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create session
  async createSession(input: VideoAnalysisSessionCreateInput): Promise<VideoAnalysisSession> {
    const client = await pool.connect();
    try {
      const {
        matchId,
        playerId,
        videoUrl,
        analysisType,
        metadata
      } = input;

      const result = await client.query(
        `
        INSERT INTO video_analysis_sessions (
          id, match_id, player_id, video_url, analysis_type, status, metadata
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, 'Pending', $5
        )
        RETURNING *
        `,
        [matchId, playerId, videoUrl, analysisType, metadata ? JSON.stringify(metadata) : null]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update session status
  async updateSessionStatus(id: string, status: SessionStatus): Promise<VideoAnalysisSession> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE video_analysis_sessions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Complete session
  async completeSession(id: string, resultUrl: string, confidenceScore: number, duration: number): Promise<VideoAnalysisSession> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        UPDATE video_analysis_sessions
        SET status = 'Completed', result_url = $1, confidence_score = $2, duration = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
        `,
        [resultUrl, confidenceScore, duration, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete session
  async deleteSession(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM video_analysis_sessions WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Video Analysis Result Service
export class VideoAnalysisResultService {
  // Get results by session
  async getResultsBySession(sessionId: string): Promise<VideoAnalysisResult[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM video_analysis_results WHERE session_id = $1 ORDER BY created_at DESC',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get result by ID
  async getResultById(id: string): Promise<VideoAnalysisResult | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM video_analysis_results WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create result
  async createResult(input: VideoAnalysisResultCreateInput): Promise<VideoAnalysisResult> {
    const client = await pool.connect();
    try {
      const {
        sessionId,
        analysisType,
        metricName,
        metricValue,
        metricUnit,
        confidenceScore,
        timestampRange,
        insights = [],
        recommendations = []
      } = input;

      const result = await client.query(
        `
        INSERT INTO video_analysis_results (
          id, session_id, analysis_type, metric_name, metric_value, metric_unit,
          confidence_score, timestamp_range, insights, recommendations
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
        RETURNING *
        `,
        [
          sessionId, analysisType, metricName, metricValue, metricUnit,
          confidenceScore, timestampRange ? JSON.stringify(timestampRange) : null,
          insights.length > 0 ? JSON.stringify(insights) : null,
          recommendations.length > 0 ? JSON.stringify(recommendations) : null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete result
  async deleteResult(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM video_analysis_results WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Video Annotation Service
export class VideoAnnotationService {
  // Get annotations by session
  async getAnnotationsBySession(sessionId: string): Promise<VideoAnnotation[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM video_annotations WHERE session_id = $1 ORDER BY timestamp_start',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get annotation by ID
  async getAnnotationById(id: string): Promise<VideoAnnotation | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM video_annotations WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create annotation
  async createAnnotation(input: VideoAnnotationCreateInput): Promise<VideoAnnotation> {
    const client = await pool.connect();
    try {
      const {
        sessionId,
        annotationType,
        timestampStart,
        timestampEnd,
        description,
        tags = [],
        metadata
      } = input;

      const result = await client.query(
        `
        INSERT INTO video_annotations (
          id, session_id, annotation_type, timestamp_start, timestamp_end,
          description, tags, metadata
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING *
        `,
        [
          sessionId, annotationType, timestampStart, timestampEnd,
          description, tags.length > 0 ? JSON.stringify(tags) : null,
          metadata ? JSON.stringify(metadata) : null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete annotation
  async deleteAnnotation(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM video_annotations WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Video Highlight Service
export class VideoHighlightService {
  // Get highlights by session
  async getHighlightsBySession(sessionId: string): Promise<VideoHighlight[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM video_highlights WHERE session_id = $1 ORDER BY timestamp_start',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get featured highlights
  async getFeaturedHighlights(sessionId: string): Promise<VideoHighlight[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM video_highlights WHERE session_id = $1 AND is_featured = true ORDER BY timestamp_start',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get highlight by ID
  async getHighlightById(id: string): Promise<VideoHighlight | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM video_highlights WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create highlight
  async createHighlight(input: VideoHighlightCreateInput): Promise<VideoHighlight> {
    const client = await pool.connect();
    try {
      const {
        sessionId,
        highlightType,
        timestampStart,
        timestampEnd,
        title,
        description,
        isFeatured = false
      } = input;

      const result = await client.query(
        `
        INSERT INTO video_highlights (
          id, session_id, highlight_type, timestamp_start, timestamp_end,
          title, description, is_featured
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING *
        `,
        [sessionId, highlightType, timestampStart, timestampEnd, title, description, isFeatured]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update highlight
  async updateHighlight(id: string, input: Partial<VideoHighlight>): Promise<VideoHighlight> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.title) {
        updates.push(`title = $${paramIndex++}`);
        values.push(input.title);
      }
      if (input.description) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.isFeatured !== undefined) {
        updates.push(`is_featured = $${paramIndex++}`);
        values.push(input.isFeatured);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM video_highlights WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE video_highlights SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete highlight
  async deleteHighlight(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM video_highlights WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Video Tag Service
export class VideoTagService {
  // Get tags by session
  async getTagsBySession(sessionId: string): Promise<VideoTag[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM video_tags WHERE session_id = $1 ORDER BY confidence DESC',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get tag by ID
  async getTagById(id: string): Promise<VideoTag | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM video_tags WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create tag
  async createTag(input: VideoTagCreateInput): Promise<VideoTag> {
    const client = await pool.connect();
    try {
      const { sessionId, tag, confidence } = input;

      const result = await client.query(
        `
        INSERT INTO video_tags (id, session_id, tag, confidence)
        VALUES (gen_random_uuid(), $1, $2, $3)
        ON CONFLICT (session_id, tag) DO UPDATE SET
          confidence = EXCLUDED.confidence,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [sessionId, tag, confidence]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete tag
  async deleteTag(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM video_tags WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Export all services
export const videoAnalysisSessionService = new VideoAnalysisSessionService();
export const videoAnalysisResultService = new VideoAnalysisResultService();
export const videoAnnotationService = new VideoAnnotationService();
export const videoHighlightService = new VideoHighlightService();
export const videoTagService = new VideoTagService();
