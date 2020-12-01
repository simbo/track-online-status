export interface ChartSeries {
  name: string;
  data: ChartSeriesItem[];
}

export interface ChartSeriesItem {
  x: string;
  y: number;
}
