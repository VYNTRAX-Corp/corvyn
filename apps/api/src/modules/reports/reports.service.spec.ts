import { CategoriesService } from '../categories/categories.service';
import { Actor } from '../../common/auth/actor.types';
import { Report } from './report.types';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: jest.Mocked<ReportsRepository>;
  const anonymousActor: Actor = { type: 'anonymous', id: 'session-1' };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findNearby: jest.fn(),
    };
    service = new ReportsService(new CategoriesService(), repository);
  });

  it('approximates coordinates before persistence', async () => {
    const report = {
      id: 'report-1',
      categoryCode: 'road_hazard',
      status: 'unverified',
      latitude: 54.687,
      longitude: 25.279,
      locationRadiusMeters: 250,
      description: 'A fallen tree blocks the road.',
      authorType: 'anonymous',
      createdAt: new Date().toISOString(),
    } satisfies Report;
    repository.create.mockResolvedValue(report);

    await service.create(anonymousActor, {
      categoryCode: 'road_hazard',
      latitude: 54.687654,
      longitude: 25.279876,
      description: 'A fallen tree blocks the road.',
    });

    expect(repository.create).toHaveBeenCalledWith({
      categoryCode: 'road_hazard',
      latitude: 54.688,
      longitude: 25.28,
      description: 'A fallen tree blocks the road.',
      authorType: 'anonymous',
    });
  });

  it('rejects unknown categories', async () => {
    await expect(
      service.create(anonymousActor, {
        categoryCode: 'unknown',
        latitude: 54.687,
        longitude: 25.279,
        description: 'A report with enough text.',
      }),
    ).rejects.toThrow('Unknown report category.');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects missing actors', async () => {
    await expect(
      service.create(undefined, {
        categoryCode: 'road_hazard',
        latitude: 54.687,
        longitude: 25.279,
        description: 'A report with enough text.',
      }),
    ).rejects.toThrow('An anonymous or account actor is required.');
  });

  it('returns a stored report by id', async () => {
    const report = { id: 'report-1' } as Report;
    repository.findById.mockResolvedValue(report);

    await expect(service.findById('report-1')).resolves.toBe(report);
  });

  it('returns nearby reports using the repository bounds', async () => {
    repository.findNearby.mockResolvedValue([]);
    const bounds = {
      minLatitude: 54.6,
      maxLatitude: 54.7,
      minLongitude: 25.2,
      maxLongitude: 25.3,
    };

    await expect(service.findNearby(bounds)).resolves.toEqual([]);
    expect(repository.findNearby).toHaveBeenCalledWith(bounds, 100);
  });

  it('rejects an oversized map viewport', async () => {
    await expect(
      service.findNearby({
        minLatitude: 0,
        maxLatitude: 3,
        minLongitude: 25,
        maxLongitude: 26,
      }),
    ).rejects.toThrow('Map bounds are invalid or too large.');
    expect(repository.findNearby).not.toHaveBeenCalled();
  });
});
