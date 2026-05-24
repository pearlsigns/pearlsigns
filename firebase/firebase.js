const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, ref, set, onValue, get } = require("firebase/database");
const { sendEmail } = require("./sendEmail")
const { v4: uuidv4 } = require('uuid'); // Import UUID at the top
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
    const date = new Date().toString();
    const quotesRef = ref(database, 'requests/' + uuidv4());
    const entry = { name, phone, service, message, date };

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
// === Realtime Database Career Management Functions ===

const getCareers = async () => {
  try {
    const careersRef = ref(database, 'careers');
    const snapshot = await get(careersRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    // Convert Firebase's object-of-objects structure into a clean array containing IDs
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).sort((a, b) => b.createdAt - a.createdAt); // Sorts newest first
  } catch (error) {
    console.error('Error reading careers node:', error.message);
    throw error;
  }
};

const createCareer = async (title, description, status) => {
  try {
    const customId = uuidv4();
    const careersRef = ref(database, 'careers/' + customId);
    // Generates a unique push ID under the 'careers' node
    await set(careersRef, {
      id: customId,
      title,
      description,
      status: status || 'open',
      createdAt: Date.now()
    });
  } catch (error) {
    console.error('Error creating career item:', error.message);
    throw error;
  }
};

const updateCareer = async (id, title, description, status) => {
  try {
    const jobRef = ref(database, "careers/" + id);
    await update(jobRef, { id, title, description, status });
  } catch (error) {
    console.error('Error updating career item:', error.message);
    throw error;
  }
};

const deleteAllCareers = async () => {
  try {
    const jobRef = ref(database, "careers");
    await set(jobRef, {});
  } catch (error) {
    console.error('Error removing career item:', error.message);
    throw error;
  }
};
const deleteCareer = async (id) => {
  try {
    const jobRef = ref(database, "careers/" + id);
    await set(jobRef, {});
  } catch (error) {
    console.error('Error removing career item:', error.message);
    throw error;
  }
};
// Export the functions
module.exports = {
  signInUser, updateVisits, requestQuote, fetchData, getCareers, createCareer, updateCareer, deleteCareer, deleteAllCareers
};
