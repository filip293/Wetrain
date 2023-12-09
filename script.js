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



// Reference to your data in the database
// Reference to your data in the database for Humidity 3x1 and Humidity 4x1
var humidity3x1Ref = ref(getDatabase(), "Humidity1");
var humidity4x1Ref = ref(getDatabase(), "Temperature1");

// Get the data and update the HTML for Humidity 3x1
onValue(humidity3x1Ref, function(snapshot) {
    var dataValue = snapshot.val();
    var pathElement = document.querySelector(".circular-chart.orange .circle");
    var textElement = document.querySelector(".circular-chart.orange .percentage");
    
    // Update the circular chart and percentage text
    updateCircularChart(pathElement, textElement, dataValue);
});

// Get the data and update the HTML for Humidity 4x1
onValue(humidity4x1Ref, function(snapshot) {
    var dataValue = snapshot.val();
    var pathElement = document.querySelector(".circular-chart.green .circle");
    var textElement = document.querySelector(".circular-chart.green .percentage");
    
    // Update the circular chart and percentage text
    updateCircularChart(pathElement, textElement, dataValue);
});

// Function to update circular chart and percentage text
function updateCircularChart(pathElement, textElement, dataValue) {
    pathElement.setAttribute("stroke-dasharray", `${dataValue}, 100`);
    textElement.textContent = `${dataValue}%`;
}
