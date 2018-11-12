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
auth.useDeviceLanguage()
const usersRef = db.ref('users')
const cardsRef = db.ref('cards')
const relationsRef = db.ref('relations')
const provider = new firebase.auth.GoogleAuthProvider()

export {
    db,
    auth,
    usersRef,
    cardsRef,
    relationsRef,
    provider
}

/* Ideas:

boards
    /bid
        id: bid
        /cards ?
            /cid
            …

cards
    /cid
        id: cid
        column: int
        content: text

users
    /uid
        created: date
        name: name
        email: email
        …

relations
    /rid
        from: cid
        to: cid

userboards:
    /uid
        id: bid

*/