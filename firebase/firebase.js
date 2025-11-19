const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, ref, set, onValue, get } = require("firebase/database");
const { sendEmail } = require("./sendEmail")
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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const authentication = getAuth(app);

// Function to sign in a user
const signInUser = async (email, password) => {
  try {
    console.log('started');
    const uc = await signInWithEmailAndPassword(authentication, email, password);
    return uc.user.uid;
  } catch (error) {
    console.error('Auth error:', error.message);
  }
};

// Function to update visits in the database
const updateVisits = () => {
  let currentVisits = 0
  try {
    const visitsRef = ref(database, 'visits');
    onValue(visitsRef, (snapshot) => {
      currentVisits = snapshot.val();
    });
    set(visitsRef, currentVisits + 1)
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;
  }
};

const requestQuoteOld = (name, phone, service, message) => {
  try {
    const now = new Date().toString();
    const quotesRef = ref(database, 'requests/' + now);
    var entry = { "name": name, "phone": phone, "service": service, "message": message };
    set(quotesRef, entry)
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;
  }
};

// ✅ UPDATED requestQuote function
const requestQuote = async (name, phone, service, message) => {
  try {
    const now = new Date().toString();
    const quotesRef = ref(database, 'requests/' + now);
    const entry = { name, phone, service, message };

    // Save to Firebase
    await set(quotesRef, entry);

    // Send email notification
    const emailBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; 
            background: #f7f9fc; padding: 20px; border-radius: 10px;
            border: 1px solid #e1e5ee;">

  <h2 style="text-align: center; background: #4a90e2; color: white; 
             padding: 12px 0; border-radius: 8px;">
    New Quote Request
  </h2>

  <table style="width: 100%; border-collapse: collapse; margin-top: 20px; 
                 background: white; border-radius: 8px; overflow: hidden;">
    <tr style="background: #eef3fb;">
      <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Name</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold; background: #eef3fb; border-bottom: 1px solid #ddd;">Phone</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone}</td>
    </tr>
    <tr style="background: #eef3fb;">
      <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Service</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${service}</td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold; background: #eef3fb; border-bottom: 1px solid #ddd;">Message</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${message}</td>
    </tr>
  </table>

  <p style="text-align: center; margin-top: 20px; color: #555; font-size: 13px;">
    <em>Received at ${now}</em>
  </p>
</div>
    `;

    // change recipient as needed
    await sendEmail(
      `New Quote Request from ${name}`,
      emailBody
    );

  } catch (error) {
    console.error('Database or Email error:', error.message);
    throw error;
  }
};
const fetchData = async () => {
  if (authentication.currentUser != null) {
    const quotesRef = ref(database, 'requests');
    const snapshot = await get(quotesRef)
    return snapshot.val();
  } else return '';
}

// Export the functions
module.exports = { signInUser, updateVisits, requestQuote, fetchData };
