// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABi0c8O9VpquBEkuiWZAJYzxEiHy9vDM8",
  authDomain: "fir-cert.firebaseapp.com",
  projectId: "fir-cert",
  storageBucket: "fir-cert.appspot.com",
  messagingSenderId: "104443888495",
  appId: "1:104443888495:web:b1b678fd7b493b48b8de9a"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);



export default firebaseApp;