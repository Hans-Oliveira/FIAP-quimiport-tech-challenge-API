import { Injectable, Logger } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';

const requestLabels = ['method', 'route', 'status_code'] as const;

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly registry = new Registry();

  readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total de HTTP requests processed by the API',
    labelNames: requestLabels,
    registers: [this.registry],
  });

  readonly httpRequestDurationSeconds = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: requestLabels,
    registers: [this.registry],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  });

  readonly httpErrorsTotal = new Counter({
    name: 'http_errors_total',
    help: 'Total of HTTP errors grouped by type',
    labelNames: ['type', ...requestLabels],
    registers: [this.registry],
  });

  readonly validationErrorsTotal = new Counter({
    name: 'validation_errors_total',
    help: 'Total of request validation failures',
    labelNames: ['field_count'],
    registers: [this.registry],
  });

  constructor() {
    collectDefaultMetrics({ register: this.registry });
  }

  recordValidationError(fieldCount: number): void {
    this.validationErrorsTotal.inc({ field_count: String(fieldCount) });
    this.logger.warn(`validation_error field_count=${fieldCount}`);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  get contentType(): string {
    return this.registry.contentType;
  }
}
