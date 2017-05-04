<template>
    <div class="login">
        <div>
            <a class="hiddenanchor" id="signup"></a> <a class="hiddenanchor" id="signin"></a>

            <div class="login_wrapper">
                <div class="animate form login_form">
                    <section class="login_content">
                        <form @submit.prevent="login">
                            <h1>Syntrend後台管理</h1>
                            <div v-if="isError" class="alert alert-danger alert-dismissible fade in" role="alert">
                                <button @click="closeError" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Error!</strong> {{errorMsg}}
                            </div>
                            <div>
                                <input v-model="account" type="text" name="login_string" class="form-control" placeholder="使用者名稱" required="" autocomplete="off"/>
                            </div>
                            <div>
                                <input v-model="password" type="password" name="login_pass" class="form-control" placeholder="使用者密碼" required="" autocomplete="off"/>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-default submit">登入後台管理</button>
                            </div>

                            <div class="clearfix"></div>
                            <div class="separator">
                                <br/>
                                <div>
                                    <h1><i class="fa fa-paw"></i> SYNTREND</h1>
                                    <p>Syntrend版權所有 COPYRIGHT©2017</p>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import firebaseApi from '../api/firebaseApi'
import CryptoJS from 'crypto-js'

export default {
    name: 'login',
    data () {
        return {
            account: '',
            password: '',
            token: '',
            isError: false,
            errorMsg: ""
        }
    },
    methods: {
        closeError(event) {
            this.isError = false;
        },
        login () {
            firebaseApi.login(this.account, this.password).then((res)=>{
                let encryptCookie = CryptoJS.AES.encrypt(JSON.stringify(true), process.env.SECRET_KEY)
                this.$store.commit('setUser', res);
                this.$store.commit('login', encryptCookie.toString());
                this.$router.push('main');
                // window.location.href = window.location.href + 'main'
            }).catch((error)=>{
                this.$store.commit('setUser', false);
                this.errorMsg = error.message;
                this.isError = true;
            });


            return false;


            const loginData = new FormData();
            loginData.append('login_string', this.account);
            loginData.append('login_pass', this.password);
            loginData.append('login_token', this.token);
            
            axios({
                method: 'post',
                url: 'http://new.syntrend.com.tw/api/login',
                data: loginData
            })
            // myApi.post('http://new.syntrend.com.tw/api/login', { 
            //     login_string: this.account,
            //     login_pass: this.password,
            //     login_token: this.token,
            //     max_allowed_attempts: 5,
            //     mins_on_hold: 600/60,
            // })
            .then((response) => {
                console.log(response);
                this.token = response.data.token;
            }).catch(function (error) {
                console.log(error);
            });
            // auth.login(this.email, this.pass, loggedIn => {
            //     if (!loggedIn) {
            //         this.error = true
            //     } else {
            //         this.$router.replace(this.$route.query.redirect || '/')
            //     }
            // })
        }
    },
    created: function() {
        var el = document.getElementsByTagName("body");
        el[0].className = 'login';
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .login {
        margin: 60px;
    }
    .login_content {
        text-shadow: none;
    }
</style>
