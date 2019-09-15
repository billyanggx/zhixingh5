// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import multiCascader from 'multi-cascader-base-ele'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.css'
import './Util/Layout.js'
import store from './store/store.js'
import VueBus from 'vue-bus'
import { server } from './Util/Server.js'
import HappyScroll from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
import Echarts from 'echarts'

// 引入组件
import locationOne from './components/common/location_one'
import locationSearch from './components/common/location_search'
import organizationSearch from './components/common/organization_search'
import searchNull from './components/common/search_null'
import * as common from './Util/common.js'
import mqtt from './Util/mqtt.js'

Vue.use(ElementUI)
Vue.use(multiCascader)
Vue.use(VueBus)
Vue.use(HappyScroll)
Vue.config.productionTip = false
Vue.prototype.$EventBus = new Vue()
Vue.prototype.$post = server.post
Vue.prototype.$get = server.get
Vue.prototype.$common = common
Vue.prototype.$mqtt = mqtt
Vue.prototype.$echarts = Echarts
Vue.use(locationOne)
// 公用组件
Vue.component('locationOne', locationOne)
Vue.component('locationSearch', locationSearch)
Vue.component('organizationSearch', organizationSearch)
Vue.component('searchNull', searchNull)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
