import firebase from 'firebase';

const app = firebase.initializeApp({
  apiKey: "AIzaSyDhGuzj7gn66zn8RepfDhphdPjsZmx8xHM",
  authDomain: "notes-app-23725.firebaseapp.com",
  projectId: "notes-app-23725",
  storageBucket: "notes-app-23725.appspot.com",
  messagingSenderId: "352532882906",
  appId: "1:352532882906:web:fbc92e2ed0ad1bf28ccce3",
  measurementId: "G-6FJB28RYJ4"
})

export const auth = app.auth();
export const db = app.firestore();