import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const DATABASE_POOL = Symbol('DATABASE_POOL');

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Pool =>
        new Pool({
          connectionString: configService.getOrThrow<string>('databaseUrl'),
        }),
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
