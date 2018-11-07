import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
    apiKey: "AIzaSyCT900isGo3TbCbBwm5VhHnI1OlMEFRE7Y",
    authDomain: "goalie-914e1.firebaseapp.com",
    databaseURL: "https://goalie-914e1.firebaseio.com",
    projectId: "goalie-914e1",
    storageBucket: "goalie-914e1.appspot.com",
    messagingSenderId: "251007656582"
}

const firebaseApp = firebase.initializeApp(config)
const db = firebaseApp.database()
const auth = firebase.auth()
auth.useDeviceLanguage();
const currentUser = auth.currentUser
const usersRef = db.ref('users')
const cardsRef = db.ref('cards')
const connectionsRef = db.ref('connections')
const provider = new firebase.auth.GoogleAuthProvider()

export {
    db,
    auth,
    currentUser,
    usersRef,
    cardsRef,
    connectionsRef,
    provider
}
