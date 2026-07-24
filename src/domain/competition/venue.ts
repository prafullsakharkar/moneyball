import { Identifiable, Timestamped, Nameable, Descriptionable } from '../shared';

// Venue types
export type VenueType = 'outdoor' | 'indoor' | 'mixed';
export type SurfaceType = 'grass' | 'dirt' | 'clay' | 'artificial' | 'wood' | 'mat';
export type RoofType = 'open' | 'retractable' | 'fixed' | 'none';

export interface Venue extends Identifiable, Timestamped, Nameable, Descriptionable {
  shortName: string;
  type: VenueType;
  status: 'active' | 'closed' | 'under_construction';
  
  // Location
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  timezone: string;
  coordinates?: GeoCoordinates;
  
  // Capacity
  capacity: number;
  standingCapacity?: number;
  seatedCapacity: number;
  
  // Dimensions
  pitchDimensions?: PitchDimensions;
  boundaryDistances?: BoundaryDistances;
  roofType: RoofType;
  surface: SurfaceType;
  
  // Facilities
  floodlights: boolean;
  dressingRooms: number;
  mediaCenter: boolean;
  broadcastFacilities: boolean;
  parkingCapacity?: number;
  accessibilityFeatures: string[];
  
  // Contact
  managerId?: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // Image
  imageUrl?: string;
  virtualTourUrl?: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface PitchDimensions {
  lengthMeters: number; // 20.12m standard
  widthMeters: number; // 3.05m standard
  creasePositions?: CreasePositions;
}

export interface CreasePositions {
  poppingCrease: number; // from bowler's wicket
  bowlingCrease: number;
  returnCrease: number;
}

export interface BoundaryDistances {
  straight: number;
  squareLeg: number;
  point: number;
  thirdMan: number;
  cover: number;
  fineLeg: number;
  minDistance: number;
  maxDistance: number;
}