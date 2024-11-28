  export const name=firebase
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCVY2Qw-wpqh_FyLISMD1umS9eKEGpXTlg",
    authDomain: "pearlsigns-fa9e0.firebaseapp.com",
    projectId: "pearlsigns-fa9e0",
    storageBucket: "pearlsigns-fa9e0.firebasestorage.app",
    messagingSenderId: "1045211295371",
    appId: "1:1045211295371:web:c91ebe369a0815e08c6e8e",
    measurementId: "G-95CQZWP1TQ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getDatabase(app);


function sendInquiry()  {
	
	console.log("Making inquiry")
} 
