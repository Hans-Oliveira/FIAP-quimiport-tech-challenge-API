import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MetricsService } from './metrics.service.js';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpMetricsMiddleware.name);

  constructor(private readonly metrics: MetricsService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const startedAt = process.hrtime.bigint();
    this.logger.log(
      `request_received method=${request.method} path=${request.originalUrl}`,
    );

    response.on('finish', () => {
      const durationSeconds =
        Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
      const route = request.route?.path ?? request.path;
      const labels = {
        method: request.method,
        route,
        status_code: String(response.statusCode),
      };

      this.metrics.httpRequestsTotal.inc(labels);
      this.metrics.httpRequestDurationSeconds.observe(labels, durationSeconds);

      if (response.statusCode >= 500) {
        this.metrics.httpErrorsTotal.inc({ type: 'internal', ...labels });
        this.logger.error(
          `internal_error method=${request.method} path=${request.originalUrl} status=${response.statusCode}`,
        );
      }

      this.logger.log(
        `request_completed method=${request.method} path=${request.originalUrl} status=${response.statusCode} duration_ms=${Math.round(durationSeconds * 1000)}`,
      );
    });

    next();
  }
}
