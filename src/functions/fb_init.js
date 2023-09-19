import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { firebaseConfig } from "./fb_config";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
import { getFunctions } from "firebase/functions"

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
export const db = getFirestore(app)
export const storage = getStorage(app);
export const functions = getFunctions(app);