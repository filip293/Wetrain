// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuT3vlvLVdOuBZk3dR7tAPvTGF7O5WAEk",
  authDomain: "weatherstation-bbcb.firebaseapp.com",
  databaseURL: "https://weatherstation-bbcb-default-rtdb.firebaseio.com",
  projectId: "weatherstation-bbcb",
  storageBucket: "weatherstation-bbcb.appspot.com",
  messagingSenderId: "481270771926",
  appId: "1:481270771926:web:d7df43fb95f82a872f1977"
};

const app = initializeApp(firebaseConfig);

let progressCircle = document.getElementById('progressCircle');
let radius = progressCircle.getAttribute('r');
let circumference = 2 * Math.PI * radius;

// Reference to your data in the database for Temperature
var temperatureRef = ref(getDatabase(), "Temperature1");
var himidityRef = ref(getDatabase(), "Humidity1");

// Get the HTML element to update
var temperatureElement = document.getElementById("temperatureValue");
var humidityElement = document.getElementById("humidityValue");

// Listen for changes in the Temperature data
onValue(temperatureRef, (snapshot) => {
  const temperatureValue = snapshot.val();
  temperatureElement.textContent = temperatureValue; // Update the HTML with the new temperature value

  // Set progress based on temperature value
  setProgress(temperatureValue + 15);
});

function setProgress(temperatureValue) {
  // Assuming temperatureValue is a percentage between 0 and 100
  let offset = circumference - (temperatureValue / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

onValue(himidityRef, (snapshot) => {
  const humidityValue = snapshot.val();
  humidityElement.textContent = humidityValue + '%'; // Update the HTML with the new temperature value
});
