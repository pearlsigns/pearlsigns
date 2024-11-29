const firebase = require("firebase/app");
const { getAuth, confirmPasswordReset } = require("firebase/auth");
const { getDatabase, ref, set, onValue } = require("firebase/database");



// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
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
    const visitsRef = ref(database, 'visits');
    onValue(visitsRef, (snapshot) => {
      currentVisits = snapshot.val() || 0;
    });
    set(visitsRef, currentVisits + 1)
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;
  }
};

const requestQuote = (name, phone, service, message) => {
  try {
    const now = new Date().toString();
    const quotesRef = ref(database, 'requests/'+ now);
    var entry = {"name" : name, "phone": phone, "service":service, "message": message};
    set(quotesRef, entry)
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;
  }
};

// Export the functions
module.exports = { signInUser, updateVisits, requestQuote };
