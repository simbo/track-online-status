<script lang="ts">
import Vue from 'vue';
import { Status } from '../lib/status.enum';

export default Vue.extend({
  props: {
    status: {
      type: String,
      default: Status.Unknown
    },
    statusSince: {
      type: String,
      default: null
    },
    checkedAgo: {
      type: String,
      default: null
    }
  }
});
</script>

<template lang="pug">
.status
  .status__state {{ status }}
  .status__since {{ statusSince ? `since ${statusSince}` : '' }}
  .status__ago {{ checkedAgo ? `last checked ${checkedAgo} ago` : '' }}
</template>

<style lang="scss"></style>
