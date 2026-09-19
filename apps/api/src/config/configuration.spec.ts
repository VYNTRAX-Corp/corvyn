import { configuration } from './configuration';

describe('configuration', () => {
  const originalEnvironment = process.env;

  beforeEach(() => {
    process.env = {
      NODE_ENV: 'test',
      API_PORT: '3100',
      DATABASE_URL: 'postgresql://test',
      REDIS_URL: 'redis://test',
    };
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  it('maps environment variables to typed application settings', () => {
    expect(configuration()).toEqual({
      nodeEnv: 'test',
      port: 3100,
      databaseUrl: 'postgresql://test',
      redisUrl: 'redis://test',
    });
  });

  it('uses the development port when API_PORT is absent', () => {
    delete process.env.API_PORT;

    expect(configuration().port).toBe(3000);
  });
});
