const { response } = require("express");
const firebase = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getDatabase, ref, set, onValue } = require("firebase/database");



// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCVY2Qw-wpqh_FyLISMD1umS9eKEGpXTlg",
  authDomain: "pearlsigns-fa9e0.firebaseapp.com",
  databaseURL: "https://pearlsigns-fa9e0-default-rtdb.firebaseio.com",
  projectId: "pearlsigns-fa9e0",
  storageBucket: "pearlsigns-fa9e0.firebasestorage.app",
  messagingSenderId: "1045211295371",
  appId: "1:1045211295371:web:c91ebe369a0815e08c6e8e",
  measurementId: "G-95CQZWP1TQ"
};

const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);
const authentication = getAuth(app);

// Function to sign in a user
const signInUser = async (email, password) => {
  try {
    const userCredential = await authentication.signInWithEmailAndPassword(email, password);
    console.log('Signed in as:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('Auth error:', error.message);
    throw error;
  }
};

// Function to update visits in the database
const updateVisits = () => {
  let currentVisits = 0
  try {
    console.log("This is the start")
    const visitsRef = ref(database, 'visits');
    onValue(visitsRef, (snapshot) => {
      currentVisits = snapshot.val() || 0;
    });
    set(visitsRef, currentVisits + 1)
    console.log("This is the end")
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;
  }
};

const requestQuote = () => {
  let currentVisits = 0
  try {
    console.log("This is the start")
    const visitsRef = ref(database, 'visits');
    onValue(visitsRef, (snapshot) => {
      currentVisits = snapshot.val() || 0;
    });
    set(visitsRef, currentVisits + 1)
    console.log("This is the end")
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;
  }
};

// Export the functions
module.exports = { signInUser, updateVisits };
