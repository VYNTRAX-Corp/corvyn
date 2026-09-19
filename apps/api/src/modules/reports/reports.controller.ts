import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { IsLatitude, IsLongitude, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ReportsService } from './reports.service';

class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  categoryCode!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  description!: string;
}

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() body: CreateReportDto, @Headers('x-anonymous-session') sessionId?: string) {
    const actor = sessionId
      ? { type: 'anonymous' as const, id: sessionId }
      : this.reportsService.createAnonymousActor();

    return this.reportsService.create(actor, body);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }
}
