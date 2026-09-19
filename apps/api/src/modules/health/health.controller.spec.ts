import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns an API health response', () => {
    const controller = new HealthController();

    expect(controller.getHealth()).toEqual({
      status: 'ok',
      service: 'api',
    });
  });
});
