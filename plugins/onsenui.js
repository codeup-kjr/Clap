
import Vue from 'vue'
import VCalendar from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';

if (process.browser) {
  Vue.use(VCalendar, {
    firstDayOfWeek: 2,  // Monday
  })
  const VueOnsen = require('vue-onsenui')
  Vue.use(VueOnsen)
}
// this.$ons.platform.select('android')
// Vue.prototype.md = this.$ons.platform.isAndroid()