import {
  subHours,
  startOfHour,
  compareAsc,
  addMinutes,
  startOfMinute,
  format,
  endOfHour
} from 'date-fns';
import { Changes } from './changes.type';

import { ChartSeries } from './chart-series.interface';
import { Status } from './status.enum';

export interface DynamicChartOptions {
  series: ChartSeries[];
  title: { text: string };
  xaxis: {
    categories: string[];
  };
}

export function getDynamicChartOptions(
  lastCheck: Date,
  changes: Changes,
  startDate: Date
): DynamicChartOptions {
  const categories = getCategories(startDate);
  const series = getSeries(categories, lastCheck, changes);
  const dateFormat = 'dd.MM.yyyy HH:mm';
  const text = `${format(new Date(categories[0]), dateFormat)} – ${format(
    endOfHour(new Date(categories[categories.length - 1])),
    dateFormat
  )}`;
  const options: DynamicChartOptions = {
    title: { text },
    series,
    xaxis: { categories }
  };
  return options;
}

function getCategories(startDate: Date, amount = 24): string[] {
  const categories: string[] = [];
  startDate = startOfHour(startDate);
  for (let i = 0; i < amount; i++) {
    categories.unshift(subHours(startDate, i).toISOString());
  }
  return categories;
}

function getSeries(
  categories: string[],
  lastCheck: Date,
  changes: Changes
): ChartSeries[] {
  const series: ChartSeries[] = [];
  for (let i = 0; i < 60; i++) {
    series.push({
      name: i < 10 ? `0${i}` : `${i}`,
      data: categories.map(x => {
        const status = getStatus(
          addMinutes(new Date(x), i),
          lastCheck,
          changes
        );
        return { x, y: statusToNumber(status) };
      })
    });
  }
  return series;
}

function getStatus(date: Date, lastCheck: Date, changes: Changes): Status {
  if (
    compareAsc(date, startOfMinute(lastCheck)) === 1 ||
    compareAsc(startOfMinute(changes[changes.length - 1].date), date) === 1
  ) {
    return Status.Unknown;
  }
  let i = 0;
  while (
    i < changes.length - 1 &&
    changes[i] &&
    compareAsc(startOfMinute(changes[i].date), date) === 1
  ) {
    i++;
  }
  return changes[i].status;
}

function statusToNumber(status: Status): number {
  return Object.values(Status).findIndex(value => value === status);
}
