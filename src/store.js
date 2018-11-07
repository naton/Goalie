import Vue from 'vue'
import Vuex from 'vuex'
import './firebaseConfig.js'

Vue.use(Vuex)

// handle page reload
auth.onAuthStateChanged(user => {
    if (user) {
        store.commit('setCurrentUser', user)
        store.dispatch('fetchUserProfile')

        // usersRef.doc(user.uid).onSnapshot(doc => {
        //     store.commit('setUserProfile', doc.data())
        // })

        // // realtime updates from our cards collection
        // cardsRef.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
        //     // check if created by currentUser
        //     let createdByCurrentUser

        //     if (querySnapshot.docs.length) {
        //         createdByCurrentUser = store.state.currentUser.uid == querySnapshot.docChanges[0].doc.data().userId ? true : false
        //     }

        //     let cardsArray = []

        //     querySnapshot.forEach(doc => {
        //         let card = doc.data()
        //         card.id = doc.id
        //         cardsArray.push(card)
        //     })

        //     store.commit('setCards', cardsArray)
        // })
    }
})

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        cards: [],
        connections: []
    },
    actions: {
        clearData({ commit }) {
            commit('setCurrentUser', null)
            commit('setUserProfile', {})
            commit('setCards', null)
            commit('setConnections', null)
        },
        fetchUserProfile({ commit, state }) {
            // usersRef.doc(state.currentUser.uid).get().then(res => {
            //     commit('setUserProfile', res.data())
            // }).catch(err => {
            //     console.log(err)
            // })
        }
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setCards(state, val) {
            if (val) {
                state.cards = val
            } else {
                state.cards = []
            }
        },
        setConnections(state, val) {
            if (val) {
                state.connections = val
            } else {
                state.connections = []
            }
        }
    }
})