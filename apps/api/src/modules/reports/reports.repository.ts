import { Pool } from 'pg';
import { CreateReportInput, Report, ReportBounds, ReportStatus } from './report.types';

export interface ReportsRepository {
  create(input: CreateReportInput): Promise<Report>;
  findById(id: string): Promise<Report | undefined>;
  findNearby(bounds: ReportBounds, limit: number): Promise<Report[]>;
}

interface ReportRow {
  id: string;
  category_code: string;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  location_radius_meters: number;
  description: string;
  author_type: 'anonymous' | 'user';
  created_at: Date;
}

function toReport(row: ReportRow): Report {
  return {
    id: row.id,
    categoryCode: row.category_code,
    status: row.status,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    locationRadiusMeters: row.location_radius_meters,
    description: row.description,
    authorType: row.author_type,
    createdAt: row.created_at.toISOString(),
  };
}

export class PostgresReportsRepository implements ReportsRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateReportInput): Promise<Report> {
    const result = await this.pool.query<ReportRow>(
      `INSERT INTO reports (
        category_code,
        status,
        latitude,
        longitude,
        location_radius_meters,
        description,
        author_type
      )
      VALUES ($1, 'unverified', $2, $3, 250, $4, $5)
      RETURNING *`,
      [
        input.categoryCode,
        input.latitude,
        input.longitude,
        input.description,
        input.authorType,
      ],
    );

    return toReport(result.rows[0]);
  }

  async findById(id: string): Promise<Report | undefined> {
    const result = await this.pool.query<ReportRow>(
      'SELECT * FROM reports WHERE id = $1 AND status <> $2',
      [id, 'removed'],
    );

    return result.rows[0] ? toReport(result.rows[0]) : undefined;
  }

  async findNearby(bounds: ReportBounds, limit: number): Promise<Report[]> {
    const result = await this.pool.query<ReportRow>(
      `SELECT *
       FROM reports
       WHERE status <> $1
         AND latitude BETWEEN $2 AND $3
         AND longitude BETWEEN $4 AND $5
       ORDER BY created_at DESC
       LIMIT $6`,
      [
        'removed',
        bounds.minLatitude,
        bounds.maxLatitude,
        bounds.minLongitude,
        bounds.maxLongitude,
        limit,
      ],
    );

    return result.rows.map(toReport);
  }
}
