import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from './firebaseConfig.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        cards: [],
        relations: []
    },
    getters: {
        getUser: state => {
            return state.user;
        }
    },
    mutations: {
        setUser: state => {
            state.user = auth.currentUser;
        }
    },
    actions: {
        setUser: context => {
            context.commit('setUser');
        }
    }
});

// handle page reload
// auth.onAuthStateChanged(user => {
//     if (user) {
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
//     }
// })

