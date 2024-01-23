import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

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



var temperatureRef = ref(getDatabase(), "Temperature1");
var himidityRef = ref(getDatabase(), "Humidity1");
var pressureRef = ref(getDatabase(), "Pressure1");


var temperatureElement = document.getElementById("temperatureValue");
var humidityElement = document.getElementById("humidityValue");
var pressureElement = document.getElementById("pressureValue");


onValue(temperatureRef, (snapshot) => {
  const temperatureValue = snapshot.val();
  temperatureElement.innerHTML = `${temperatureValue}<sup>°</sup>`; // Update the HTML with the new temperature value
});

onValue(himidityRef, (snapshot) => {
  let humidityValue = snapshot.val();
  humidityValue = Math.min(humidityValue, 100);
  humidityElement.textContent = humidityValue + '%'; // Update the HTML with the new humidity value
});



onValue(pressureRef, (snapshot) => {
  const pressureValue = snapshot.val();
  let pressure = parseInt(pressureValue / 100);
  pressureElement.textContent = pressure; // Update the HTML with the new humidity value
});




const apiKey = "763c113d8dc10a307631d99b3c8b52ef";
const city = "Skopje"; // Replace with the city name

// Create three separate divs to display information
const weatherDescriptionContainer = document.getElementById("weather-description");
const sunriseTimeContainer = document.getElementById("sunrise-time");
const sunsetTimeContainer = document.getElementById("sunset-time");
const chanceOfRainContainer = document.getElementById("chanceOfRain");
const weatherImage = document.getElementById("weather-image");



// Fetch weather information from OpenWeatherMap API
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        // Extract relevant information from the API response
        const weatherDescription = data.weather[0].description;
        const sunriseTimestamp = data.sys.sunrise * 1000; // Convert to milliseconds
        const sunsetTimestamp = data.sys.sunset * 1000; // Convert to milliseconds
        const chanceOfRain = data.rain ? data.rain["1h"] : 0;

        // Format sunrise and sunset times
        const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString();
        const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString();

        // Display weather information in respective containers
        weatherDescriptionContainer.innerHTML = `Weather: ${weatherDescription}`;
        sunriseTimeContainer.innerHTML = `Sunrise: ${sunriseTime}`;
        sunsetTimeContainer.innerHTML = `Sunset: ${sunsetTime}`;
        chanceOfRainContainer.innerHTML += `<br>Chance of Rain: ${chanceOfRain}%`;

        // Determine the time of day (morning, afternoon, evening, night)
        const currentTime = new Date().getTime();
        const isDaytime = currentTime > sunriseTimestamp && currentTime < sunsetTimestamp;
        const isNight = !isDaytime;

        // Determine the appropriate SVG based on weather condition and time of day
        let svgPath;

        if (weatherDescription.toLowerCase().includes("clear") && isDaytime) {
            svgPath = "animated/day.svg";
        } else if (weatherDescription.toLowerCase().includes("clear") && isNight) {
            svgPath = "animated/night.svg";
        } else if ((weatherDescription.toLowerCase().includes("clouds") && isNight)) {
            svgPath = "animated/cloudy-night-3.svg";
        } else if (weatherDescription.toLowerCase().includes("rain") && chanceOfRain < 50) {
            svgPath = "animated/rainy-5.svg";
        } else if (weatherDescription.toLowerCase().includes("rain") && chanceOfRain >= 50) {
            svgPath = "animated/rainy-6.svg";
        } else if (weatherDescription.toLowerCase().includes("thunderstorm")) {
            svgPath = "animated/thunder.svg";
        } else if (weatherDescription.toLowerCase().includes("snow")) {
            svgPath = "animated/snowy-5.svg";
        } else if (weatherDescription.toLowerCase().includes("clouds") && !weatherDescription.toLowerCase().includes("broken")) {
            svgPath = "animated/cloudy-day-3.svg";
        } else if (weatherDescription.toLowerCase().includes("clouds") && weatherDescription.toLowerCase().includes("broken")) {
            svgPath = "animated/cloudy.svg";
        } else {
            svgPath = "animated/cloudy.svg";
        }

        // Update the src attribute of the weather image with the chosen SVG
        weatherImage.src = svgPath;
    })
    .catch(error => console.error("Error fetching weather data:", error));