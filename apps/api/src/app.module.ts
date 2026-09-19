import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { DatabaseModule } from './infrastructure/database/database.module';
import { configuration } from './config/configuration';
import { environmentValidationSchema } from './config/env.validation';
import { CategoriesModule } from './modules/categories/categories.module';
import { HealthModule } from './modules/health/health.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AnonymousModule } from './modules/anonymous/anonymous.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: resolve(__dirname, '../../../.env'),
      load: [configuration],
      validationSchema: environmentValidationSchema,
    }),
    DatabaseModule,
    CategoriesModule,
    HealthModule,
    ReportsModule,
    AnonymousModule,
  ],
})
export class AppModule {}
