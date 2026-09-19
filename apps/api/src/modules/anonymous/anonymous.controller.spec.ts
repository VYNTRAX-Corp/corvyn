import { AnonymousController } from './anonymous.controller';
import { ReportsService } from '../reports/reports.service';

describe('AnonymousController', () => {
  it('creates an anonymous session identifier', () => {
    const service = {
      createAnonymousActor: jest.fn().mockReturnValue({
        type: 'anonymous',
        id: 'session-1',
      }),
    } as unknown as ReportsService;
    const controller = new AnonymousController(service);

    expect(controller.createSession()).toEqual({
      sessionId: 'session-1',
      actorType: 'anonymous',
    });
  });
});
