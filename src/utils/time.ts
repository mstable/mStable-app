import { format } from 'date-fns'

export const fromUnix = (unixTime: number): Date => new Date(unixTime * 1e3)

export const formatUnix = (unixTime: number, dateFormat = 'dd-MM-yyyy'): string => format(fromUnix(unixTime), dateFormat)
