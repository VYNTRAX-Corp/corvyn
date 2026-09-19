import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    service = new CategoriesService();
  });

  it('returns the configured MVP categories', () => {
    expect(service.listEnabled().map((category) => category.code)).toEqual([
      'road_hazard',
      'fire_or_accident',
      'environmental_hazard',
      'named_person_or_organization',
    ]);
  });

  it('marks named-person reports for moderator review', () => {
    expect(service.findByCode('named_person_or_organization')).toMatchObject({
      requiresModeratorReview: true,
    });
  });

  it('returns undefined for an unknown category', () => {
    expect(service.findByCode('unknown')).toBeUndefined();
  });
});
