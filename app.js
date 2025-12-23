// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// (Paste the config object from the Firebase Console here)
const firebaseConfig = {
  apiKey: "AIzaSyBRjSG14pCYqMsZ48mdAAn_wnKUjPlckgI",
  authDomain: "student-job-tracker-3ccf7.firebaseapp.com",
  projectId: "student-job-tracker-3ccf7",
  storageBucket: "student-job-tracker-3ccf7.firebasestorage.app",
  messagingSenderId: "985417577644",
  appId: "1:985417577644:web:b84fd60752de8b489b5b09",
  measurementId: "G-BZ6KE5KZ8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Log to console to check connection
console.log("Firebase Connected 🚀");

// Select the job form
const jobForm = document.getElementById('job-form');

// Listen for the "Submit" event
jobForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // STOP the page from refreshing (very important!)

    // Grab the data from the input boxes
    const company = document.getElementById('company').value;
    const role = document.getElementById('role').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;

    console.log("Saving to Firebase...", company, role);

    try {
        // Send the data to Firestore
        // "applications" is the name of the folder (collection) in your database
        await addDoc(collection(db, "applications"), {
            company: company,
            role: role,
            date: date,
            status: status,
            createdAt: new Date() // Helpful for sorting later
        });

        console.log("Success! Job added.");
        
        // 5. Clear the form so it's ready for the next one
        jobForm.reset();
        alert("Job added successfully!");

    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Something went wrong. Check the console.");
    }
});