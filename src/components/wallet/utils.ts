import { format } from 'date-fns';

export const fromUnix = (unixTime: number): Date => {
  return new Date(unixTime * 1e3);
};

export const formatUnix = (
  unixTime: number,
  dateFormat = 'dd-MM-yyyy',
): string => {
  return format(fromUnix(unixTime), dateFormat);
};
