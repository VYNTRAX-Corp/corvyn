export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  redisUrl: string;
}

export function configuration(): AppConfiguration {
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.API_PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL ?? '',
    redisUrl: process.env.REDIS_URL ?? '',
  };
}
