// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAekvFo7H9_OqywMvJPvmm4CDVS2UxX7PI',
  authDomain: 'live-laugh-zot.firebaseapp.com',
  projectId: 'live-laugh-zot',
  storageBucket: 'live-laugh-zot.firebasestorage.app',
  messagingSenderId: '272615171979',
  appId: '1:272615171979:web:d43981a85d0e1e65a8f18e',
  measurementId: 'G-XB3XGM2SE7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };
