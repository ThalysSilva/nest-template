import { ObjectId } from 'mongodb';
import { LogTipo } from 'src/@types/entities/log';

export type LogsModel = {
  _id?: ObjectId;
  message: string;
  details: string;
  action: string;
  type: LogTipo;
  createdAt: Date;
};
