// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueCookie from 'vue-cookie'
import router from './router'
import store from './store/store'
import Firebase from 'firebase'
import vueFire from 'vuefire'
import firebaseApi from './api/firebaseApi'
import EventBus from './lib/eventBus.js'

Vue.use(vueFire)
Vue.use(VueCookie)

Vue.prototype.$bus = EventBus
/* eslint-disable no-new */
const app = new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App },
	// created() {
	// 	Firebase.auth().onAuthStateChanged((user) => {
	// 		this.$store.commit('setUser', user || false);
	// 		if (!user || this.$cookie.get('session') != "true") {
	// 			this.$router.push('/login');
	// 		}
	// 	});
	// },
	mounted() {
		// this.checkLogin();
		let bodyHeight = document.body.clientHeight;
		let leftHeight = document.body.querySelector(".left_col") ? document.body.querySelector(".left_col").clientHeight : 0;
		let footerHeight = document.body.querySelector("footer") ? document.body.querySelector("footer").clientHeight : 0 ;
		let windowHeight = window.document.documentElement.clientHeight;
		let contentHeight = bodyHeight < leftHeight ? leftHeight : bodyHeight;
		contentHeight -= footerHeight;
		if (document.body.querySelector(".right_col")) {
			document.body.querySelector(".right_col").style.minHeight = windowHeight + "px";
		}
	}
})
global._App = app