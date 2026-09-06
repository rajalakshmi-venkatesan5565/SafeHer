// =============================
// SAFEHER - PART 1
// Registration + Permissions + Home
// =============================
import { auth, db } from "./firebase/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
const startBtn = document.getElementById("startBtn");

if (startBtn) {
    startBtn.addEventListener("click", showRegister);
}

// =============================
// REGISTER PAGE
// =============================

// =============================
// REGISTER PAGE
// =============================
function showRegister() {

    document.querySelector(".mobile").innerHTML = `
    <div class="register-page">

        <img src="images/logo.png" class="small-logo">

        <h2>Create Account</h2>

        <p>Your safety starts here</p>

        <div class="profile-circle">
            <i class="fa-solid fa-user"></i>
        </div>

        <input type="text"
               id="fullName"
               placeholder="Full Name">

        <input type="tel"
               id="phone"
               placeholder="Phone Number">

        <input type="email"
               id="email"
               placeholder="Email Address">

        <input type="password"
               id="password"
               placeholder="Create Password">

        <input type="text"
               id="emergencyName1"
               placeholder="Emergency Contact 1 Name">

        <input type="tel"
               id="emergencyNumber1"
               placeholder="Emergency Contact 1 Number">

        <input type="text"
               id="emergencyName2"
               placeholder="Emergency Contact 2 Name">

        <input type="tel"
               id="emergencyNumber2"
               placeholder="Emergency Contact 2 Number">

        <input type="text"
               id="emergencyName3"
               placeholder="Emergency Contact 3 Name">

        <input type="tel"
               id="emergencyNumber3"
               placeholder="Emergency Contact 3 Number">

        <button id="continueBtn" class="continue-btn">
            Continue
        </button>

    </div>
    `;

    document
        .getElementById("continueBtn")
        .addEventListener("click", saveUserDetails);

}

// =============================
// SAVE USER DETAILS
// =============================

// =============================
// SAVE USER DETAILS
// =============================
async function saveUserDetails() {

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!fullName || !phone || !email || !password) {
        alert("Please fill all required fields.");
        return;
    }

    const contacts = [];

    for (let i = 1; i <= 3; i++) {

        const name = document.getElementById("emergencyName" + i).value.trim();
        const number = document.getElementById("emergencyNumber" + i).value.trim();

        if (name !== "" && number !== "") {

            contacts.push({
                name: name,
                number: number
            });

        }

    }

    if (contacts.length === 0) {
        alert("Please add at least one emergency contact.");
        return;
    }

    try {

        // Create Firebase Authentication account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Save extra details in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {

            fullName: fullName,
            phone: phone,
            email: email,
            emergencyContacts: contacts,
            createdAt: new Date()

        });

        alert("Registration Successful!");

        showPermission();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}
// =============================
// PERMISSION PAGE
// =============================

function showPermission() {

    document.querySelector(".mobile").innerHTML = `
    <div class="permission-page">

        <img src="images/logo.png" class="small-logo">

        <h2>Allow Permissions</h2>

        <p>These permissions help keep you safe.</p>

        <div class="permission-card">
            📍 <b>Location</b><br>
            <span>Share live location during emergencies.</span>
        </div>

        <div class="permission-card">
            📱 <b>SMS</b><br>
            <span>Send SOS alerts to trusted contacts.</span>
        </div>

        <div class="permission-card">
            📞 <b>Phone</b><br>
            <span>Call emergency contacts quickly.</span>
        </div>

        <button id="allowBtn">
            Allow Permissions
        </button>

    </div>
    `;

    document
        .getElementById("allowBtn")
        .addEventListener("click", function () {

            window.location.href = "home.html";

        });

}

// =============================
// HOME PAGE
// =============================

function showHome() {

    document.querySelector(".mobile").innerHTML = `
    <div class="home-page">

        <div class="top">

            <div class="profile">

                <i class="fa-solid fa-user"></i>

            </div>

        </div>

        <h3>Hello 👋</h3>

        <h2 id="homeUserName">Loading...</h2>

        <div class="sos-btn">
            🚨
        </div>

        <button class="journey-btn">
            🛡️ Start Safe Journey
        </button>

        <button class="profile-btn">
            ⚙️ Profile
        </button>

    </div>
    `;

    onAuthStateChanged(auth, async (user) => {

        if (user) {

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                document.getElementById("homeUserName").textContent =
                    docSnap.data().fullName;

            }

        }

    });

}
// =============================
// PART 2
// Journey Details + Active Journey
// =============================

// Save Journey Details
function startJourney() {

    const destination = document.getElementById("destination").value.trim();
    const duration = document.getElementById("duration").value.trim();

    if (destination === "") {
        alert("Please enter destination.");
        return;
    }

    if (duration === "") {
        alert("Please enter journey duration.");
        return;
    }

    localStorage.setItem("destination", destination);

    // Convert minutes to seconds
    localStorage.setItem("remainingSeconds", parseInt(duration) * 60);

    window.location.href = "active.html";
}
// =============================
// ACTIVE PAGE
// =============================

window.addEventListener("load", function () {

    onAuthStateChanged(auth, async (user) => {

        if (user) {

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                const data = docSnap.data();

                const userName = document.getElementById("userName");

                if (userName) {

                    userName.textContent = data.fullName;

                }

            }

        }

    });

    const destination = document.getElementById("destinationName");

    if (destination) {

        destination.textContent =
            localStorage.getItem("destination") || "Destination";

    }

});
// =============================
// PART 3
// Extend Timer + Countdown Timer
// =============================

let selectedTime = 0;

// -----------------------------
// Select Preset Time
// -----------------------------
function selectTime(button) {

    document.querySelectorAll(".time-options button").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    selectedTime = parseInt(button.innerText);

    const custom = document.getElementById("customTime");

    if (custom) {
        custom.value = "";
    }
}

// -----------------------------
// Extend Journey
// -----------------------------
function extendJourney() {

    let extraMinutes = selectedTime;

    const custom = document.getElementById("customTime");

    if (custom && custom.value.trim() !== "") {
        extraMinutes = parseInt(custom.value);
    }

    if (isNaN(extraMinutes) || extraMinutes <= 0) {
        alert("Please select or enter extra time.");
        return;
    }

    let remaining = parseInt(localStorage.getItem("remainingSeconds"));

    if (isNaN(remaining)) {
        remaining = 45 * 60 + 30;
    }

    remaining += extraMinutes * 60;

    localStorage.setItem("remainingSeconds", remaining);

    window.location.href = "active.html";
}

// -----------------------------
// Active Page
// -----------------------------
window.addEventListener("load", function () {

    // Dynamic User Name
    const user = document.getElementById("userName");

    if (user) {
        user.innerText =
            localStorage.getItem("userName") || "User";
    }

    // Dynamic Destination
    const destination = document.getElementById("destinationName");

    if (destination) {
        destination.innerText =
            localStorage.getItem("destination") || "Destination";
    }
   onAuthStateChanged(auth, (user) => {

    if (user) {

        loadEmergencyContacts();

    } else {

        console.log("Waiting for Firebase login...");

    }

});

    // Timer
    const timer = document.getElementById("timer");

    if (!timer) return;

    let totalSeconds = parseInt(localStorage.getItem("remainingSeconds"));

    if (isNaN(totalSeconds)) {

        const mins = parseInt(localStorage.getItem("journeyTime"));

        if (isNaN(mins)) {
            totalSeconds = 45 * 60 + 30;
        } else {
            totalSeconds = mins * 60;
        }
    }

    function updateTimer() {

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        timer.innerHTML =
            String(hrs).padStart(2, "0") + " : " +
            String(mins).padStart(2, "0") + " : " +
            String(secs).padStart(2, "0");

        localStorage.setItem("remainingSeconds", totalSeconds);

        if (totalSeconds <= 0) {

    clearInterval(interval);

    localStorage.removeItem("remainingSeconds");

    localStorage.setItem("autoSOS", "true");

    window.location.href = "sos.html";

    return;
}

        totalSeconds--;
    }

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

});

// -----------------------------
// Journey Completed
// -----------------------------
function journeyCompleted() {

    localStorage.removeItem("remainingSeconds");
    localStorage.removeItem("journeyTime");
    localStorage.removeItem("destination");

    alert("Glad you reached safely!");

    window.location.href = "home.html";
}

window.journeyCompleted = journeyCompleted;
// =========================
// SOS FUNCTIONS
// =========================

function callWomenHelpline() {

    alert("Calling Women Helpline (1091)...");

    window.location.href = "tel:1091";

}

function callPolice() {

    alert("Calling Police (100)...");

    window.location.href = "tel:100";

}

function cancelSOS() {

    alert("Emergency Cancelled Successfully.");

    window.location.href = "home.html";

}
// =============================
// DISPLAY EMERGENCY CONTACTS
// =============================

// =========================
// LOAD EMERGENCY CONTACTS
// =========================

function loadEmergencyContacts() {

    const container = document.getElementById("emergencyContacts");

    if (!container) return;

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            container.innerHTML = "<p>User not logged in.</p>";
            return;
        }

        try {

            const docSnap = await getDoc(doc(db, "users", user.uid));

            if (!docSnap.exists()) {

                container.innerHTML = "<p>No user data found.</p>";
                return;

            }

            const data = docSnap.data();
            const contacts = data.emergencyContacts || [];

            container.innerHTML = "";

            if (contacts.length === 0) {

                container.innerHTML = "<p>No Emergency Contacts Found.</p>";
                return;

            }

            contacts.forEach((contact, index) => {

                container.innerHTML += `
                    <div class="contact-card">

                        <div>
                            <h4>${contact.name}</h4>
                            <span>${contact.number}</span>
                        </div>

                        <button class="send-btn" onclick="sendWhatsApp(${index})">
                            <i class="fa-brands fa-whatsapp"></i>
                            Send
                        </button>

                    </div>
                `;

            });

        } catch (error) {

            console.error(error);
            container.innerHTML = "<p>Error loading contacts.</p>";

        }

    });

}

// =============================
// SEND WHATSAPP
// =============================

// =========================
// SEND WHATSAPP
// =========================

function sendWhatsApp(index) {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            alert("Please login first.");
            return;
        }

        try {

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                alert("User data not found.");
                return;
            }

            const data = docSnap.data();

            const contacts = data.emergencyContacts || [];
            const userName = data.fullName;

            if (index >= contacts.length) return;

            navigator.geolocation.getCurrentPosition(function(position) {

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const message = `🚨 SOS ALERT!

${userName} needs immediate help.

📍 Live Location:
https://maps.google.com/?q=${lat},${lng}

Please help me immediately.`;

                const url =
                    `https://wa.me/91${contacts[index].number}?text=${encodeURIComponent(message)}`;

                window.open(url, "_blank");

            }, function() {

                alert("Unable to fetch location.");

            });

        } catch (error) {

            console.error(error);
            alert(error.message);

        }

    });

}
// Make functions available to HTML onclick buttons
window.sendWhatsApp = sendWhatsApp;
window.callWomenHelpline = callWomenHelpline;
window.callPolice = callPolice;
window.cancelSOS = cancelSOS;
window.startJourney = startJourney;
window.selectTime = selectTime;
window.extendJourney = extendJourney;