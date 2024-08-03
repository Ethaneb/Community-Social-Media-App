import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyA8rE_-Cbo5ryifWiafVo_4i91JQ5qz1Uo",
    authDomain: "node-social-9ca82.firebaseapp.com",
    projectId: "node-social-9ca82",
    storageBucket: "node-social-9ca82.appspot.com",
    messagingSenderId: "1066439698464",
    appId: "1:1066439698464:web:fb43240db0c10ad6113445",
    measurementId: "G-49M7C6GHQY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics, onAuthStateChanged };