import firebase from "firebase/app";
import "firebase/firestore";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBj2YUoWj2fBtK64xDe3rqa6crY6OwYK54",
  authDomain: "crudfirestore-eb48e.firebaseapp.com",
  databaseURL: "https://crudfirestore-eb48e.firebaseio.com",
  projectId: "crudfirestore-eb48e",
  storageBucket: "crudfirestore-eb48e.appspot.com",
  messagingSenderId: "905692946521",
  appId: "1:905692946521:web:aa1d277b11253986655148",
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig); // Save initialization
export const db = fb.firestore(); // Export database shortcut
