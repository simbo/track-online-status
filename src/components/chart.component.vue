<script lang="ts">
import Vue from 'vue';
import { PropValidator } from 'vue/types/options';
import ApexChart from 'apexcharts';
import { addDays, compareAsc, endOfHour, startOfHour, subDays } from 'date-fns';
import { recursive } from 'merge';

import { Changes } from '../lib/changes.type';
import { globalChartOptions } from '../lib/global-chart-options';
import { getDynamicChartOptions } from '../lib/dynamic-chart-options';
import { addHours } from 'date-fns/esm/fp';

export default Vue.extend({
  props: {
    changes: {
      type: Array,
      default: []
    } as PropValidator<Changes>,
    lastCheck: {
      type: Date,
      default: null
    } as PropValidator<Date>
  },
  updated() {
    this.updateChart();
  },
  created() {
    this.$options.startDate = new Date();
  },
  mounted() {
    this.$options.chartOptions = recursive(
      true,
      globalChartOptions,
      getDynamicChartOptions(
        this.lastCheck,
        this.changes,
        this.$options.startDate
      ),
      {
        chart: {
          events: {
            dataPointSelection: (
              event: Event,
              ctx,
              { seriesIndex, dataPointIndex }
            ) => {
              if (event) {
                this.$options.chart.toggleDataPointSelection(
                  seriesIndex,
                  dataPointIndex
                );
              }
            }
          }
        }
      }
    );
    this.$options.chart = new ApexChart(
      this.$refs.chart,
      this.$options.chartOptions
    );
    this.$options.chart.render();
  },
  methods: {
    prevDay(): void {
      this.$options.startDate = subDays(this.$options.startDate, 1);
      this.$forceUpdate();
    },
    nextDay(): void {
      this.$options.startDate = addDays(this.$options.startDate, 1);
      this.$forceUpdate();
    },
    updateChart(): void {
      this.$options.chart.updateOptions(
        getDynamicChartOptions(
          this.lastCheck,
          this.changes,
          this.$options.startDate
        ),
        true,
        false
      );
    },
    canGoPrevDay(): boolean {
      return (
        compareAsc(
          startOfHour(subDays(this.$options.startDate, 1)),
          this.changes[this.changes.length - 1].date
        ) === 1
      );
    },
    canGoNextDay(): boolean {
      return (
        compareAsc(this.lastCheck, endOfHour(this.$options.startDate)) === 1
      );
    }
  }
});
</script>

<template lang="pug">
.chart
  .chart__canvas(ref="chart")
  button.chart__button.chart__button--prev(v-if="canGoPrevDay()", @click="prevDay()") ←
  button.chart__button.chart__button--next(v-if="canGoNextDay()", @click="nextDay()") →
</template>

<style lang="scss">
.chart {
  position: relative;
  max-width: 900px;
  margin: 0 auto;

  &__button {
    position: absolute;
    top: 0;
    cursor: pointer;
    color: $colorTextSecondary;

    &:hover {
      color: $colorText;
    }

    &--prev {
      left: 22px;
    }

    &--next {
      right: 21px;
    }
  }

  &-tooltip {
    background: rgba($colorBg, 0.65);
    padding: 0.2em 0.4em;

    &__label {
      color: $colorTextSecondary;
      padding-left: 0.6em;
    }

    &__value--offline {
      color: $colorOffline;
    }

    &__value--online {
      color: $colorOnline;
    }

    &__value--unknown {
      color: $colorTextSecondary;
    }
  }

  .apexcharts-tooltip {
    border-radius: 0.1em;
  }

  .apexcharts-heatmap {
    cursor: crosshair;
  }
}
</style>
