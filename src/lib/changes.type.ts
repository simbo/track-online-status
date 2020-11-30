import { Status } from './status.enum';

export interface ChangesEntry {
  status: Status;
  date: Date;
}

export type Changes = ChangesEntry[];
