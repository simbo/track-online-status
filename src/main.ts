import Vue from 'vue';
import { formatDistance } from 'date-fns';

import { components } from './components/index';
import { Changes } from './lib/changes.type';
import { Status } from './lib/status.enum';

Object.entries(components).forEach(([componentName, component]) => {
  Vue.component(componentName, component);
});

let loadingTimeout: number;
let faviconElement: HTMLLinkElement;

new Vue({
  el: '.view',

  data: {
    status: Status.Unknown as Status,
    lastChange: null as Date,
    lastCheck: null as Date,
    statusSince: null as String,
    checkedAgo: null as String,
    changes: null as Changes
  },

  updated() {
    this.setFavicon();
  },

  created() {
    this.loadLog();
    this.setFavicon();
  },

  beforeDestroy() {
    window.clearTimeout(loadingTimeout);
  },

  methods: {
    loadLog(): void {
      fetch('/online-status/log.json')
        .then(response => response.json())
        .then(logObj => {
          const now = new Date();
          this.lastCheck = logObj.lastCheck ? new Date(logObj.lastCheck) : null;
          this.changes = logObj.changes.map(([statusRaw, dateRaw]) => ({
            status: statusRaw ? Status.Online : Status.Offline,
            date: new Date(dateRaw)
          }));
          this.status = this.changes[0].status;
          this.lastChange = this.changes[0].date;
          this.statusSince = formatDistance(now, new Date(this.lastChange));
          this.checkedAgo = formatDistance(now, new Date(this.lastCheck));
        })
        .catch(console.error)
        .finally(() => {
          if (loadingTimeout) {
            window.clearTimeout(loadingTimeout);
          }
          loadingTimeout = window.setTimeout(() => this.loadLog(), 60000);
        });
    },

    setFavicon(): void {
      if (!faviconElement) {
        faviconElement = document.createElement('link');
        faviconElement.rel = 'shortcut icon';
        faviconElement.type = 'image/png';
        document.head.appendChild(faviconElement);
      }
      faviconElement.href = `/online-status/assets/status-${this.status}.png`;
    }
  }
});
