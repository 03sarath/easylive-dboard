import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import {
  applyPolyfills,
  defineCustomElements,
} from '@aws-amplify/ui-components/loader';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import post_AWS_API from "./api-aws"
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import '@mdi/font/css/materialdesignicons.css'
import VeeValidate from 'vee-validate'





// Make it available globally
Vue.prototype.$post_AWS_API = post_AWS_API 

Amplify.configure(awsconfig);

applyPolyfills().then(() => {
  defineCustomElements(window);
});
Vue.config.ignoredElements = [/amplify-\w*/];



Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VeeValidate)
Vue.use(Buefy, {
  defaultIconPack: 'mdi'
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
