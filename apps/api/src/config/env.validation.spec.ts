import { environmentValidationSchema } from './env.validation';

describe('environmentValidationSchema', () => {
  const validEnvironment = {
    DATABASE_URL: 'postgresql://corvyn:corvyn@localhost:5432/corvyn',
    REDIS_URL: 'redis://localhost:6379',
    S3_ENDPOINT: 'http://localhost:9000',
    S3_REGION: 'eu-central-1',
    S3_ACCESS_KEY: 'minio',
    S3_SECRET_KEY: 'local-secret',
    S3_BUCKET_QUARANTINE: 'quarantine',
    S3_BUCKET_PUBLIC: 'public',
  };

  it('accepts a complete environment', () => {
    const result = environmentValidationSchema.validate(validEnvironment);

    expect(result.error).toBeUndefined();
  });

  it('rejects an environment without database configuration', () => {
    const { error } = environmentValidationSchema.validate({
      ...validEnvironment,
      DATABASE_URL: undefined,
    });

    expect(error?.details[0].path).toEqual(['DATABASE_URL']);
  });
});
