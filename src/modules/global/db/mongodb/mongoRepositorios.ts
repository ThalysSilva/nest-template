import { LogsRepository } from '@/repository/logsRepository';

import { MongoLogsRepository } from '@/modules/global/db/mongodb/repositories/mongoLogsRepository';
import { Provider } from '@nestjs/common';

export const mongoRepositories = [
  {
    provide: LogsRepository,
    useClass: MongoLogsRepository,
  },
] as Provider[];
