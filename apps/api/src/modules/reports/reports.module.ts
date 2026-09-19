import { Module } from '@nestjs/common';
import { DATABASE_POOL } from '../../infrastructure/database/database.module';
import { CategoriesModule } from '../categories/categories.module';
import { ReportsController } from './reports.controller';
import { PostgresReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';

@Module({
  imports: [CategoriesModule],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    {
      provide: PostgresReportsRepository,
      inject: [DATABASE_POOL],
      useFactory: (pool: ConstructorParameters<typeof PostgresReportsRepository>[0]) =>
        new PostgresReportsRepository(pool),
    },
    {
      provide: 'REPORTS_REPOSITORY',
      inject: [PostgresReportsRepository],
      useFactory: (repository: PostgresReportsRepository) => repository,
    },
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
