import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyArjSHV7N7qF4ydHqbxQeqXhsfiTleZKd0",
  authDomain: "seppiaaaaaaaaa.firebaseapp.com",
  projectId: "seppiaaaaaaaaa",
  storageBucket: "seppiaaaaaaaaa.appspot.com",
  messagingSenderId: "76711007943",
  appId: "1:76711007943:web:e32c9d28687ed208fc90e2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
// FIXME: 認証状態はいつまで保持する？
// auth.setPersistence(browserLocalPersistence);

export { auth };