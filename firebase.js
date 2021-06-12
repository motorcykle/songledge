import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDXY5dirGvjNpg8hRrX7dgui6RNoKy5iJ8",
  authDomain: "songledge.firebaseapp.com",
  projectId: "songledge",
  storageBucket: "songledge.appspot.com",
  messagingSenderId: "909624078121",
  appId: "1:909624078121:web:14113dd0c1ba72bc075138"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();

export default db