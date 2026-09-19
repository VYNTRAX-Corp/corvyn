import { Controller, Post } from '@nestjs/common';
import { ReportsService } from '../reports/reports.service';

@Controller('anonymous')
export class AnonymousController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('session')
  createSession(): { sessionId: string; actorType: 'anonymous' } {
    const actor = this.reportsService.createAnonymousActor();
    return { sessionId: actor.id, actorType: 'anonymous' };
  }
}
