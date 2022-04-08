import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// add firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3cPBhCO6Kuprrb-KTVuLroxMGF6AbiMU",
  authDomain: "fir-expo-demo.firebaseapp.com",
  projectId: "fir-expo-demo",
  storageBucket: "fir-expo-demo.appspot.com",
  messagingSenderId: "480663487823",
  appId: "1:480663487823:web:04bff60ff2c0f67234b13a"
};

// initialize firebase
initializeApp(firebaseConfig);

// initialize auth
const auth = getAuth();

export { auth };
