
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAjPrswV9KlKNCT8cj9rO9d2oe6MZhzl5g",
    authDomain: "treasure-hunt-2025-c7969.firebaseapp.com",
    projectId: "treasure-hunt-2025-c7969",
    storageBucket: "treasure-hunt-2025-c7969.firebasestorage.app",
    messagingSenderId: "202818500872",
    appId: "1:202818500872:web:36b7c0ed49030772af14bd",
    measurementId: "G-M906K7Z1WR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;