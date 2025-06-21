// app/lib/firebase.js
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBpRfzASXv6W35IxLxe_2yjnyygfsts-VY",
  authDomain: "loginkomunitas.firebaseapp.com",
  projectId: "loginkomunitas",
  storageBucket: "loginkomunitas.appspot.com",
  messagingSenderId: "199696207986",
  appId: "1:199696207986:web:6235952846399a57c432eb"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export { db }
