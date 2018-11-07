<template>
    <section class="login">
        <div>
            <h2>{{ title }}</h2>
            <div>
                <button @click.prevent="login()" :disabled="isLoading" :class="{ 'is-loading': isLoading }">{{ buttonText }}</button>
            </div>
        </div>
    </section>
</template>

<script>
import { auth, provider } from '../firebaseConfig.js'

export default {
    name: 'GoalieLogin',
    props: {
        title: String,
        buttonText: String
    },
    data() {
        return {
            user: null,
            isNewUser: true,
            isLoading: false,
            loginStatus: false
        }
    },
    methods: {
        handleLoginStatus(value) {
           this.$emit('update-login-status', value);
        },
        login() {
            let self = this
            
            self.isLoading = true

            auth.signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // let token = result.credential.accessToken;
                // this.$store.commit('setCurrentUser', result.user)
                // this.$store.dispatch('fetchUserProfile')
                localStorage.setItem('goalie_usertoken', result.credential.accessToken)
                self.handleLoginStatus(true)
                self.loginStatus = true
                self.user = result.user
                self.isNewUser = result.additionalUserInfo.isNewUser
                self.isLoading = false
            }).catch(function(error) {
                console.log(error)
                localStorage.removeItem('goalie_usertoken')
                self.loginStatus = false
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