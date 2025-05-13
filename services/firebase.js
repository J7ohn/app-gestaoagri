import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDi50jcToGCNpCBvQVNA8FpvF3OP3V04mk",
  authDomain: "gestaoagri.firebaseapp.com",
  projectId: "gestaoagri",
  storageBucket: "gestaoagri.firebasestorage.app",
  messagingSenderId: "657425185675",
  appId: "1:657425185675:web:aec092e620eb698efd4d8e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore
export const db = getFirestore(app);
