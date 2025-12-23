import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, doc, deleteDoc, query, where 
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { 
    getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// CONFIGURATION
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Global variable to track the current user
let currentUser = null; 

// AUTH LOGIC
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

// Login Function
loginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login failed", error);
    }
});

// Logout Function
logoutBtn.addEventListener('click', () => {
    signOut(auth);
    alert("Logged out!");
});

// Auth State Observer (The "Security Guard")
// This runs automatically whenever someone logs in or out
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        loginScreen.style.display = 'none';      // Hide login
        dashboardScreen.style.display = 'block'; // Show app
        console.log("User logged in:", user.email);
        
        // Fetch ONLY this user's jobs
        fetchJobs(user.uid); 
    } else {
        // User is signed out
        currentUser = null;
        loginScreen.style.display = 'block';     // Show login
        dashboardScreen.style.display = 'none';  // Hide app
        document.getElementById('job-list').innerHTML = ""; // Clear table for security
    }
});


// APP LOGIC
// Add Job (Updated to include User ID)
const jobForm = document.getElementById('job-form');

jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) return; // Stop if not logged in

    const company = document.getElementById('company').value;
    const role = document.getElementById('role').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;

    try {
        await addDoc(collection(db, "applications"), {
            uid: currentUser.uid,
            company: company,
            role: role,
            date: date,
            status: status,
            createdAt: new Date()
        });

        jobForm.reset();
        fetchJobs(currentUser.uid); // Refresh list
        
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});


// Fetch Jobs (Updated to filter by User ID)
async function fetchJobs(userId) {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = ""; 

    try {
        // Create a query: "Give me jobs WHERE the uid matches the logged-in user"
        const q = query(collection(db, "applications"), where("uid", "==", userId));
        
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            const job = doc.data();
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${job.company}</td>
                <td>${job.role}</td>
                <td>${job.date}</td>
                <td><span class="status ${job.status.toLowerCase()}">${job.status}</span></td>
                <td><button class="delete-btn" onclick="deleteJob('${doc.id}')">X</button></td>
            `;
            jobList.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}


// Delete Job
window.deleteJob = async (id) => {
    if(confirm("Delete this application?")) {
        await deleteDoc(doc(db, "applications", id));
        fetchJobs(currentUser.uid);
    }
};