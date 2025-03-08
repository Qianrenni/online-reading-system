import Vue from 'vue'
import App from './App'
import store from '@/store'
import uView from "uview-ui";
import VerticalList from "@/components/verticalList/index.vue" 
import CardBox from "@/components/cardBox/index.vue" 
import ListBox from "@/components/listBox/index.vue" 
Vue.component('vertical-list', VerticalList)
Vue.component('card-box', CardBox)
Vue.component('list-box', ListBox)
Vue.use(uView);
let vuexStore = require('@/store/$u.mixin.js')
Vue.mixin(vuexStore)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
