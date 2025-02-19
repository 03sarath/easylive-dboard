import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import {
  applyPolyfills,
  defineCustomElements,
} from '@aws-amplify/ui-components/loader';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

applyPolyfills().then(() => {
  defineCustomElements(window);
});
Vue.config.ignoredElements = [/amplify-\w*/];



Vue.config.productionTip = false
Vue.use(ElementUI);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
