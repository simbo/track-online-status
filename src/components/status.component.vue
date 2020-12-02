<script lang="ts">
import Vue from 'vue';
import { formatDistance, format } from 'date-fns';

import { Status } from '../lib/status.enum';

export default Vue.extend({
  props: {
    status: {
      type: String,
      default: Status.Unknown
    },
    lastCheck: {
      type: Date,
      default: null
    },
    lastChange: {
      type: Date,
      default: null
    }
  },
  methods: {
    diff(date: Date) {
      return formatDistance(new Date(), date);
    },
    date(date: Date) {
      return format(date, 'dd.MM.yyyy HH:mm:ss');
    }
  }
});
</script>

<template lang="pug">
.status
  .status__state.font--serif(:class="`status__state--${status}`") Status:
    span.status__state-value {{ status }}
  .status__info
    span.status__last-change(v-if="lastChange", :title="date(lastChange)") since {{ diff(lastChange) }}
    span.status__last-check(v-if="lastCheck", :title="date(lastCheck)") last checked {{ diff(lastCheck) }} ago
</template>

<style lang="scss">
.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3em;
  cursor: default;

  &__state {
    font-size: 4em;
    margin: 0 0 0.5rem;

    &-value {
      text-transform: capitalize;
      text-shadow: 0 0 0.25em rgba(255, 255, 255, 0.35);

      &::before {
        content: ' ';
      }
    }

    &--online,
    &--offline,
    &--unknown {
      &::before {
        content: '';
        display: inline-block;
        border-radius: 50%;
        position: relative;
        top: 0.15em;
        margin-right: 0.4em;
        width: 1em;
        height: 1em;
        border: 0.025em solid rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 1em rgba(255, 255, 255, 0.35);
      }
    }

    &--online {
      .status__state-value {
        color: $colorOnline;
      }
      &::before {
        background: $colorOnline;
      }
    }

    &--offline {
      .status__state-value {
        color: $colorOffline;
      }
      &::before {
        background: $colorOffline;
      }
    }

    &--unknown {
      .status__state-value {
        opacity: 0.25;
      }
      &::before {
        background: $colorUnknown;
        opacity: 0.25;
      }
    }
  }

  &__info {
    display: flex;
    width: 100%;
    justify-content: center;
    color: $colorTextSecondary;
  }

  &__last-change + &__last-check {
    &::before {
      content: ' — ';
    }
  }
}
</style>
