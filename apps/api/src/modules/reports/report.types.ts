export type ReportStatus =
  | 'unverified'
  | 'community_confirmed'
  | 'debunked'
  | 'outdated'
  | 'removed';

export interface Report {
  id: string;
  categoryCode: string;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  locationRadiusMeters: number;
  description: string;
  authorType: 'anonymous' | 'user';
  createdAt: string;
}

export interface CreateReportInput {
  categoryCode: string;
  latitude: number;
  longitude: number;
  description: string;
  authorType: 'anonymous' | 'user';
}
