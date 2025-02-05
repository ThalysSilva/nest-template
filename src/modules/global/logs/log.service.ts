import { Injectable, Logger } from '@nestjs/common';
import { Log } from 'src/@types/entities/log';
import { LogsRepository } from 'src/repository/logsRepository';
import { normalizeKeys, removeLoops } from 'src/utils/functions/objects';
import { OptionalNullable } from 'src/utils/types';
import * as moment from 'moment-timezone';

type LogProps = Omit<OptionalNullable<Log>, 'id' | 'createdAt' | 'details'> &
  Partial<{
    details: Record<string, unknown>;
    detailsFormat?: 'json' | 'string';
    displayOnConsole?: boolean;
  }>;

@Injectable()
export class LogService {
  private readonly logger = new Logger('LogService');
  constructor(private readonly logsRepository: LogsRepository) {}

  async log({
    displayOnConsole = false,
    detailsFormat = 'json',
    ...log
  }: LogProps) {
    const normalizedDetails = normalizeKeys(removeLoops(log.details));
    const createdAt = moment().tz('America/Sao_Paulo').format();
    const keepFormat = detailsFormat === 'json';
    const details = keepFormat
      ? normalizedDetails
      : JSON.stringify(normalizedDetails);
    const payload = {
      ...log,
      createdAt,
      details,
    };
    if (displayOnConsole) this.logger.log(payload.message);
    await this.logsRepository.createLog(payload);
  }

  async info(log: Omit<LogProps, 'type'>) {
    await this.log({
      type: 'INFO',
      ...log,
    });
  }

  async error(log: Omit<LogProps, 'type'>) {
    await this.log({
      type: 'ERROR',
      displayOnConsole: true,
      ...log,
    });
  }

  async warn(log: Omit<LogProps, 'type'>) {
    await this.log({
      type: 'WARN',
      displayOnConsole: true,
      ...log,
    });
  }
}
