
<template>
    <div class="leftMenu">
        <div class="col-md-3 left_col">
            <div class="left_col scroll-view">
                <div class="navbar nav_title" style="border: 0;">
                    <a href="index.html" class="site_title"><i class="fa fa-paw"></i> <span>Gentellela Alela!</span></a>
                </div>

                <div class="clearfix"></div>

                <!-- menu profile quick info -->
                <div class="profile">
                    <div class="profile_pic">
                        <img src="static/images/img.jpg" alt="..." class="img-circle profile_img">
                    </div>
                <div class="profile_info">
                    <span>Welcome,</span>
                    <h2>{{getEMail}}</h2>
                </div>
                </div>
                <!-- /menu profile quick info -->

                <br />

                <!-- sidebar menu -->
                <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                    <div class="menu_section">
                        <h3>General</h3>
                        <ul class="nav side-menu sidebar-menu">
                            <li v-for="data in treeData">
                                <router-link @click="menuClick" :to="(data.url) ? data.url : '' ">
                                        <i class="fa" v-bind:class="data.icon"></i> {{data.title}} <span class="fa fa-chevron-down"></span>
                                </router-link>
                                <ul class="nav child_menu">
                                    <li v-for="child in data.children"><a v-bind:href="child.url">{{child.title}}</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- /sidebar menu -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'leftMenu',
    data () {
        return {
            treeData: [
                {
                    title: "Home",
                    url: "main",
                    icon: "fa-home",
                    children: []
                },
                {
                    title: "Forms",
                    url: false,
                    icon: "fa-bug",
                    children: [
                        {
                            title: "General Form",
                            url:"Dashboard"
                        },
                        {
                            title: "Advanced Components",
                            url:"Dashboard2"
                        },
                        {
                            title: "Form Wizard",
                            url:"Dashboard3"
                        },
                        {
                            title: "Form Upload",
                            url:"Dashboard3"
                        },
                        {
                            title: "Form Buttons",
                            url:"Dashboard3"
                        }
                    ]
                },
                {
                    title: "Management Images",
                    url: "managamentImages",
                    icon: "fa-windows",
                    children: []
                }
            ]
        }
    },
    methods: {
        menuClick(event) {
            let li = event.target.parentNode
            let sidebar = document.body.querySelector("#sidebar-menu");
            if (li.classList.contains("active")) {
                li.classList.remove("active");
                li.classList.remove("active-sm");
            }else{
                let selectLi = sidebar.querySelectorAll("li.active");
                for (var index in selectLi) {
                    if (selectLi[index].classList) {
                        selectLi[index].classList.remove("active");
                    }
                }

                li.classList.add("active");
            }
        }
    },
    computed: {
        getEMail() {
            let emailFirstName = (this.$store.getters.getUserData.email) ? this.$store.getters.getUserData.email.split("@")[0] : 'gust' ;
            return this.$store.getters.getUserData.displayName || emailFirstName
        }
    }
}
</script>

<style scoped>
.sidebar-menu li.active > .child_menu {
    display: block;
}
.sidebar-menu .child_menu {
    display: none;
}
</style>
