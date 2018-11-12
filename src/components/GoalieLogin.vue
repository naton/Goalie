<template>
    <section class="login" v-show="!loginStatus">
        <div>
            <h2>{{ title }}</h2>
            <div>
                <button @click.prevent="login()" :disabled="isLoading" :class="{ 'is-loading': isLoading }">{{ buttonText }}</button>
            </div>
        </div>
    </section>
</template>

<script>
import { db, auth, provider } from '../firebaseConfig.js'

export default {
    name: 'GoalieLogin',
    props: {
        title: String,
        buttonText: String,
        initialLoginStatus: Boolean
    },
    data() {
        return {
            user: null,
            isNewUser: true,
            isLoading: false,
            loginStatus: this.initialLoginStatus
        }
    },
    methods: {
        handleLoginStatus(bool, user) {
           this.loginStatus = bool;
           this.$emit('update-login-status', user)
        },
        login() {
            let self = this
            
            self.isLoading = true

            auth.signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                localStorage.setItem('goalie_usertoken', result.credential.accessToken)
                self.user = result.user
                self.handleLoginStatus(true, self.user)
                self.isNewUser = result.additionalUserInfo.isNewUser
                self.isLoading = false
            }).catch(function(error) {
                console.log(error)
                localStorage.removeItem('goalie_usertoken')
                self.handleLoginStatus(false, null)
                self.isLoading = false
            });
        }
    }
}
</script>

<style>
.login {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.is-loading {
    background: yellow
}
</style>