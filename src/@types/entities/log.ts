export type Log = {
  id: string;
  message: string;
  details: any;
  action: string;
  type: LogTipo;
  createdAt: Date;
};

export type LogTipo = 'INFO' | 'ERROR' | 'WARN';
