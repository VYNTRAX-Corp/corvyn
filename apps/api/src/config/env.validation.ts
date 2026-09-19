import * as Joi from 'joi';

export const environmentValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  API_PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
  REDIS_URL: Joi.string().uri({ scheme: ['redis', 'rediss'] }).required(),
  S3_ENDPOINT: Joi.string().uri().required(),
  S3_REGION: Joi.string().required(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().min(1).required(),
  S3_BUCKET_QUARANTINE: Joi.string().min(1).required(),
  S3_BUCKET_PUBLIC: Joi.string().min(1).required(),
});
