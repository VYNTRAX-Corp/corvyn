import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CategoriesService } from '../categories/categories.service';
import { canSubmitReport } from '../../common/auth/actor-policy';
import { Actor } from '../../common/auth/actor.types';
import { CreateReportInput, Report, ReportBounds } from './report.types';
import { ReportsRepository } from './reports.repository';

const PUBLIC_LOCATION_RADIUS_METERS = 250;

export interface ReportSubmission {
  categoryCode: string;
  latitude: number;
  longitude: number;
  description: string;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject('REPORTS_REPOSITORY') private readonly reportsRepository: ReportsRepository,
  ) {}

  async create(actor: Actor | undefined, submission: ReportSubmission): Promise<Report> {
    if (!canSubmitReport(actor)) {
      throw new UnprocessableEntityException('An anonymous or account actor is required.');
    }
    if (!actor) {
      throw new UnprocessableEntityException('An anonymous or account actor is required.');
    }

    const category = this.categoriesService.findByCode(submission.categoryCode);
    if (!category) {
      throw new UnprocessableEntityException('Unknown report category.');
    }

    const input: CreateReportInput = {
      ...submission,
      latitude: this.approximateCoordinate(submission.latitude),
      longitude: this.approximateCoordinate(submission.longitude),
      authorType: actor.type,
    };

    return this.reportsRepository.create(input);
  }

  async findById(id: string): Promise<Report> {
    const report = await this.reportsRepository.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    return report;
  }

  async findNearby(bounds: ReportBounds): Promise<Report[]> {
    if (
      bounds.minLatitude >= bounds.maxLatitude ||
      bounds.minLongitude >= bounds.maxLongitude ||
      bounds.maxLatitude - bounds.minLatitude > 2 ||
      bounds.maxLongitude - bounds.minLongitude > 2
    ) {
      throw new BadRequestException('Map bounds are invalid or too large.');
    }

    return this.reportsRepository.findNearby(bounds, 100);
  }

  getPublicLocationRadiusMeters(): number {
    return PUBLIC_LOCATION_RADIUS_METERS;
  }

  createAnonymousActor(): Actor {
    return { type: 'anonymous', id: randomUUID() };
  }

  private approximateCoordinate(value: number): number {
    return Number(value.toFixed(3));
  }
}
