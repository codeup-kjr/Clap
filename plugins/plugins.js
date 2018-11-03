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

  function vCompositionModelUpdate (el, { value, expression }, vnode) {
    // data書き換え
    vnode.context[expression] = el.value
  }
  
  Vue.directive('composition-model', {
    bind: function (el, binding, vnode) {
      el.value = binding.value
      el.addEventListener('keyup', () => vCompositionModelUpdate(el, binding, vnode))
      el.addEventListener('compositionend', () => vCompositionModelUpdate(el, binding, vnode))
    },
    // dataが直接書き換わったときの対応
    update: function (el, { value }) {
      el.value = value
    }
  });

}
