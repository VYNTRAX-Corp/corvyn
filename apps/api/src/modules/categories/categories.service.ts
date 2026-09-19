import { Injectable } from '@nestjs/common';
import { ReportCategory } from './category.types';

const MVP_CATEGORIES: readonly ReportCategory[] = [
  {
    code: 'road_hazard',
    labelKey: 'categories.roadHazard',
    threatLevel: 'low',
    requiresEmergencyDisclaimer: false,
    requiresModeratorReview: false,
  },
  {
    code: 'fire_or_accident',
    labelKey: 'categories.fireOrAccident',
    threatLevel: 'high',
    requiresEmergencyDisclaimer: true,
    requiresModeratorReview: false,
  },
  {
    code: 'environmental_hazard',
    labelKey: 'categories.environmentalHazard',
    threatLevel: 'high',
    requiresEmergencyDisclaimer: false,
    requiresModeratorReview: false,
  },
  {
    code: 'named_person_or_organization',
    labelKey: 'categories.namedPersonOrOrganization',
    threatLevel: 'high',
    requiresEmergencyDisclaimer: false,
    requiresModeratorReview: true,
  },
];

@Injectable()
export class CategoriesService {
  listEnabled(): readonly ReportCategory[] {
    return MVP_CATEGORIES;
  }

  findByCode(code: string): ReportCategory | undefined {
    return MVP_CATEGORIES.find((category) => category.code === code);
  }
}
