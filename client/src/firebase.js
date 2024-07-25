import firebase from "firebase/compat/app"
import { initializeApp } from "firebase/app";
import "firebase/compat/auth"


const app = firebase.initializeApp({
    apiKey: "AIzaSyBxgdVN8Td4IxM-BIHkChFzDONyYJmEWkQ",
    authDomain: "auth-development-c699e.firebaseapp.com",
    projectId: "auth-development-c699e",
    storageBucket: "auth-development-c699e.appspot.com",
    messagingSenderId: "674407717901",
    appId: "1:674407717901:web:afad4af77509f94f95c944"
})


export const auth = app.auth()
export default app