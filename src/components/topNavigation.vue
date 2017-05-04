
<template>
    <div class="topNavigationmain">
        <div class="top_nav">
            <div class="nav_menu">
                <nav>
                    <div class="nav toggle">
                        <a id="menu_toggle" @click="leftMenuClick"><i class="fa fa-bars"></i></a>
                    </div>
                    <ul class="nav navbar-nav navbar-right">
                        <li @click="profileClick">
                            <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <img src="static/images/img.jpg" alt="">John Doe
                                <span class=" fa fa-angle-down"></span>
                            </a>
                            <ul class="dropdown-menu dropdown-usermenu pull-right">
                                <li @click="logoutClick"><a href="javascript:;"><i class="fa fa-sign-out pull-right"></i> Log Out</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
          </div>
        </div>
    </div>
</template>

<script>
import firebaseApi from '../api/firebaseApi';

export default {
    name: 'topNavigation',
    data () {
        return {
            msg: ''
        }
    },
    methods: {
        leftMenuClick(event) {
            let myBody = document.body;
            myBody.classList.toggle('nav-md');
            myBody.classList.toggle('nav-sm');
        },
        profileClick(event) {
            event.currentTarget.classList.toggle('open');
        },
        logoutClick(event) {
            firebaseApi.logout();
            this.$store.commit('logout', false);
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
</style>
