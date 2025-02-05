import { Repository } from 'src/repository/repository';

export abstract class AdapterDb {
  abstract makeTransaction<T>(
    operacao: (context: unknown) => Promise<T>,
    repositories: Repository[],
    config?: any,
  ): Promise<T>;
}
