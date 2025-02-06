export type Log = {
  id: string;
  message: string;
  details: any;
  action: string;
  type: LogType;
  createdAt: Date;
};

export type LogType = 'INFO' | 'ERROR' | 'WARN';
