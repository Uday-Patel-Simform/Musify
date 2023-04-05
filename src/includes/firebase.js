import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyArnYHAaj25jLGDMgDE8PUinYqTRfQWi4M",
    authDomain: "musify-4c090.firebaseapp.com",
    projectId: "musify-4c090",
    storageBucket: "musify-4c090.appspot.com",
    messagingSenderId: "777099663504",
    appId: "1:777099663504:web:3583303e1212d243652015"
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const users_collection = db.collection('users')
const songs_collection = db.collection('songs')
const comments_collection = db.collection('comments')

export {
    auth,
    db,
    users_collection,
    songs_collection,
    comments_collection,
    storage,
}