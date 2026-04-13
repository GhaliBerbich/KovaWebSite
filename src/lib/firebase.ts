import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBH8DMtlY6o44Glq4ML2sldFTflBT1G_dI",
	authDomain: "kova-ad7c9.firebaseapp.com",
	projectId: "kova-ad7c9",
	storageBucket: "kova-ad7c9.firebasestorage.app",
	messagingSenderId: "498395930882",
	appId: "1:498395930882:web:2d2a6ab51d081fd95fe21b",
	measurementId: "G-GZWP3GZZF0",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);