// Models for Media Service

export interface MediaFile {
  id: string;
  entityType: MediaType;
  entityId: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  fileFormat: string;
  storageProvider: StorageProvider;
  bucketName?: string;
  objectKey?: string;
  thumbnailUrl?: string;
  duration?: number;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAlbum {
  id: string;
  name: string;
  description?: string;
  entityType: MediaType;
  entityId: string;
  coverImageId?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAlbumItem {
  id: string;
  albumId: string;
  mediaFileId: string;
  sortOrder: number;
  createdAt: string;
}

export interface MediaTag {
  id: string;
  mediaFileId: string;
  tag: string;
  createdAt: string;
}

export interface MediaAnalytics {
  id: string;
  mediaFileId: string;
  views: number;
  downloads: number;
  likes: number;
  shares: number;
  lastViewedAt?: string;
  lastDownloadedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Enums
export enum MediaType {
  Player = 'Player',
  Team = 'Team',
  Match = 'Match',
  Tournament = 'Tournament',
  Venue = 'Venue',
  Organization = 'Organization',
  User = 'User'
}

export enum StorageProvider {
  S3 = 's3',
  MinIO = 'minio',
  Local = 'local',
  Azure = 'azure',
  GCS = 'gcs'
}

export enum FileType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Document = 'document'
}

// Input types
export interface MediaFileCreateInput {
  entityType: MediaType;
  entityId: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  fileFormat: string;
  storageProvider?: StorageProvider;
  bucketName?: string;
  objectKey?: string;
  thumbnailUrl?: string;
  duration?: number;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
  isPrimary?: boolean;
}

export interface MediaFileUpdateInput {
  fileName?: string;
  filePath?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface MediaAlbumCreateInput {
  name: string;
  description?: string;
  entityType: MediaType;
  entityId: string;
  coverImageId?: string;
  isPrivate?: boolean;
}

export interface MediaAlbumUpdateInput {
  name?: string;
  description?: string;
  coverImageId?: string;
  isPrivate?: boolean;
}

export interface MediaAlbumItemCreateInput {
  albumId: string;
  mediaFileId: string;
  sortOrder?: number;
}

export interface MediaTagCreateInput {
  mediaFileId: string;
  tag: string;
}

export interface MediaAnalyticsUpdateInput {
  views?: number;
  downloads?: number;
  likes?: number;
  shares?: number;
}
