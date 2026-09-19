import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  it('creates an anonymous report using the supplied session', async () => {
    const service = {
      create: jest.fn().mockResolvedValue({ id: 'report-1' }),
      createAnonymousActor: jest.fn(),
      findById: jest.fn(),
    } as unknown as ReportsService;
    const controller = new ReportsController(service);

    await controller.create(
      {
        categoryCode: 'road_hazard',
        latitude: 54.687,
        longitude: 25.279,
        description: 'A fallen tree blocks the road.',
      },
      'session-1',
    );

    expect(service.create).toHaveBeenCalledWith(
      { type: 'anonymous', id: 'session-1' },
      expect.objectContaining({ categoryCode: 'road_hazard' }),
    );
  });

  it('gets a report by id', async () => {
    const service = {
      create: jest.fn(),
      createAnonymousActor: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: 'report-1' }),
    } as unknown as ReportsService;
    const controller = new ReportsController(service);

    await expect(controller.findById('report-1')).resolves.toEqual({ id: 'report-1' });
  });
});
