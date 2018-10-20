import Vue from 'vue';
import VCalendar from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';
import AsyncComputed from 'vue-async-computed';
import Croppa from 'vue-croppa';

if (process.browser) {
  Vue.use(VCalendar, {
    firstDayOfWeek: 2,  // Monday
  });
  const VueOnsen = require('vue-onsenui');
  Vue.use(VueOnsen);
  Vue.use(AsyncComputed);
  Vue.use(Croppa);
}
