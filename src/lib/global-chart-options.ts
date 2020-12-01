import { format } from 'date-fns';
import { Status } from './status.enum';

export const globalChartOptions = {
  chart: {
    animations: {
      enabled: false
    },
    selection: {
      enabled: false
    },
    type: 'heatmap',
    height: 700,
    fontFamily:
      'Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, Arial, sans-serif',
    foreColor: '#8b8b8b',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    show: false
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['rgba(0,0,0,.1)']
  },
  title: {
    text: '',
    floating: true,
    align: 'center',
    margin: 0,
    offsetX: 0,
    offsetY: 0,
    style: {
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#8b8b8b'
    }
  },
  tooltip: {
    enabled: true,
    theme: null,
    custom: ({ series, seriesIndex, dataPointIndex, w: { config } }) => {
      const date = new Date(config.xaxis.categories[dataPointIndex]);
      const dateString = format(date, 'dd.MM.yyyy HH');
      const label = `${dateString}:${config.series[seriesIndex].name}`;
      const value = Object.keys(Status)[series[seriesIndex][dataPointIndex]];
      return `
        <div class="chart-tooltip">
          <span class="chart-tooltip__date">${label}</span>
          <span class="chart-tooltip__label">Status:</span>
          <span class="chart-tooltip__value chart-tooltip__value--${value.toLowerCase()}">${value}</span
        </div>
      `;
    }
  },
  plotOptions: {
    heatmap: {
      radius: 0,
      enableShades: false,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 0,
            color: '#bd0e0e'
          },
          {
            from: 1,
            to: 1,
            color: '#32cd32'
          },
          {
            from: 2,
            to: 2,
            color: '#454545'
          }
        ]
      }
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      hideOverlappingLabels: false,
      rotate: -45,
      rotateAlways: true,
      style: {
        fontSize: '10px'
      },
      formatter: value => format(new Date(value), 'HH:mm')
    },
    axisBorder: {
      color: '#8b8b8b'
    },
    axisTicks: {
      color: '#8b8b8b'
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    labels: {
      show: false
    }
  }
};
