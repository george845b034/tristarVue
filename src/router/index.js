import Vue from 'vue'
import Router from 'vue-router'
import Main from 'pages/Main'
import ManagamentImages from 'pages/ManagamentImages'
import Login from 'pages/Login'
import Index from 'pages/Index'
import leftMenu from '../components/leftMenu'
import topNavigation from '../components/topNavigation'
import footerComponent from '../components/footer'
import CryptoJS from 'crypto-js'

Vue.use(Router)

var guardRoute = (to, from, next) => {

	var bytes  = CryptoJS.AES.decrypt(_Router.app.$cookie.get('session').toString(), process.env.SECRET_KEY)
	var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
	if (decryptedData != true) {
		next('/')
	}else{
		next()
	}
}

const _Router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'index',
			components: {
				content: Index
			}
		},
		{
			path: '/login',
			name: 'login',
			components: {
				content: Login
			}
		},
		{
			path: '/main',
			name: 'main',
			components: {
				leftMenu: leftMenu,
				topNavigation: topNavigation,
				content: Main,
				footer: footerComponent,
			},
			beforeEnter: guardRoute
		},
		{
			path: '/managamentImages',
			name: 'managamentImages',
			components: {
				leftMenu: leftMenu,
				topNavigation: topNavigation,
				content: ManagamentImages,
				footer: footerComponent,
			},
			beforeEnter: guardRoute
		},
		{ path: '/login', redirect: '/' },
		{ path: '*', redirect: '/' }
	],
  	linkActiveClass: 'active'
})

export default _Router