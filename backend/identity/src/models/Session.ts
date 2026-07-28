// Session model for Identity Service

export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface SessionCreateInput {
  userId: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionRevokeInput {
  sessionId: string;
  revokedBy: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  isRevoked: boolean;
}
