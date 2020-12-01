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

// export function changesToChartData(
//   lastCheck: Date,
//   changes: Changes,
//   firstDate: Date = new Date(),
//   lastDate?: Date
// ): ChartSeries[] {
//   const dataset: ChartSeries[] = [];
//   const firstMinute = floorMinute(firstDate);
//   const lastMinute = floorMinute(lastDate || changes[changes.length - 1].date);
//   let minute = ceilHour(new Date());
//   let hour = subHours(ceilHour(new Date()), 1);
//   let series: ChartSeries;
//   while (minute > lastMinute) {
//     minute = subMinutes(minute, 1);
//     if (minute.getHours() <= hour.getHours()) {
//       if (series) {
//         dataset.push(series);
//       }
//       hour = subHours(hour, 1);
//       series = {
//         name: format(hour, 'HH'),
//         data: []
//       };
//     }
//     if (lastCheck < minute) {
//       series.data.push(StatusNumber.offline);
//       continue;
//     }
//   }
//   console.log(dataset);
//   return dataset;
// }

// const data = {
//   labels: [],
//   datasets: [
//     {
//       label: Status.Offline,
//       backgroundColor: '#bd0e0e',
//       data: []
//     },
//     {
//       label: Status.Online,
//       backgroundColor: '#32cd32',
//       data: []
//     },
//     {
//       label: Status.Unknown,
//       backgroundColor: '#454545',
//       data: []
//     }
//   ]
// };
// if (!changes.length) {
//   return data;
// }
// lastDate = floorDateToNextMinute(
//   lastDate || changes[changes.length - 1].date
// );
// let entryIndex = 0;
// let entryDate = floorDateToNextMinute(changes[entryIndex].date);
// let date = floorDateToNextMinute(firstDate);
// let currentHour: Date = null;
// let i = -1;
// while (date >= lastDate) {
//   if (!currentHour || date.getHours() !== currentHour.getHours()) {
//     currentHour = subMinutes(date, date.getMinutes());
//     data.labels.push(currentHour);
//     i++;
//   }
//   if (date < floorDateToNextMinute(changes[entryIndex].date)) {
//     entryIndex++;
//   }
//   const datasetIndex = {
//     [Status.Offline]: 0,
//     [Status.Online]: 1,
//     [Status.Unknown]: 2
//   }[changes[entryIndex].status];
//   const dataset = data.datasets[datasetIndex].data;
//   dataset[i] = (dataset[i] || 0) + 1;
//   date = subMinutes(date, 1);
// }
// console.log(data);
// return data;
