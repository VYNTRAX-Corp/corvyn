import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { AnonymousController } from './anonymous.controller';

@Module({
  imports: [ReportsModule],
  controllers: [AnonymousController],
})
export class AnonymousModule {}
