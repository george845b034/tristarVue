import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    user: {
        loggedIn: false,
        uid: '',
        name: '',
        profilePicUrl: ''
    },
    userData: {},
    menuSetting: {
        isActive: true
    }
}

const getters = {
    getUser: state => state.user,
    getUserData: state => state.userData,
    getMenuSetting: state => state.menuSetting
}

const mutations = {
    setUser (state, payload) {
        if (!payload) {
            state.userData = {};
        }else{
            state.userData = payload;
        }
    },
    setMenuSetting (state, isBool) {
        state.menuSetting.isActive = isBool;
    },
    login (state, payload) {
        state.user.loggedIn = payload;
        _App.$cookie.set('session', payload, { expires: '6h' });
    },
    logout (state) {
        _App.$cookie.delete('session');
        state.user.loggedIn = false;
    }
}

export default new Vuex.Store({
    name: 'store',
    state,
    getters,
    mutations
});