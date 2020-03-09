import { distanceInWordsStrict, differenceInCalendarDays } from "date-fns";

export const formatPastDate = (date: Date) =>
  distanceInWordsStrict(date, new Date());

export const formatFutureDate = (date: Date) =>
  differenceInCalendarDays(date, new Date());
