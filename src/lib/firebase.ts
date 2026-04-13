import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "REMOVED_FIREBASE_API_KEY",
	authDomain: "REMOVED_AUTH_DOMAIN",
	projectId: "REMOVED_PROJECT_ID",
	storageBucket: "REMOVED_PROJECT_ID.firebasestorage.app",
	messagingSenderId: "REMOVED_SENDER_ID",
	appId: "1:REMOVED_SENDER_ID:web:2d2a6ab51d081fd95fe21b",
	measurementId: "REMOVED_MEASUREMENT_ID",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);