export type ThreatLevel = 'low' | 'high';

export interface ReportCategory {
  code: string;
  labelKey: string;
  threatLevel: ThreatLevel;
  requiresEmergencyDisclaimer: boolean;
  requiresModeratorReview: boolean;
}
