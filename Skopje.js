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
const database = getDatabase(app);

const temperatureRef = ref(database, "Temperature1");
const humidityRef = ref(database, "Humidity1");
const pressureRef = ref(database, "Pressure1");

const temperatureElement = document.getElementById("temperatureValue");
const humidityElementPC = document.getElementById("humidityValuePC");
const humidityElementPhone = document.getElementById("humidityValuePhone");
const pressureElement = document.getElementById("pressureValue");

function updateHumidityStyles() {
    const isPhone = window.innerWidth <= 600;

    if (isPhone) {
        humidityElementPC.style.display = "none";
        humidityElementPhone.style.display = "block";
        humidityElementPhone.style.position = "absolute";
        humidityElementPhone.style.left = "50%";
        humidityElementPhone.style.transform = "translateX(-50%)";
    } else {
        humidityElementPC.style.display = "block";
        humidityElementPhone.style.display = "none";
        humidityElementPC.style.position = "absolute";
        humidityElementPC.style.left = "16.5%";
        humidityElementPC.style.transform = "translateX(-50%)";
    }
}

onValue(temperatureRef, (snapshot) => {
    const temperatureValue = snapshot.val();
    temperatureElement.innerHTML = `${temperatureValue}<sup>°</sup>`;
});

onValue(humidityRef, (snapshot) => {
    let humidityValue = snapshot.val();
    humidityValue = Math.min(humidityValue, 100);
    humidityElementPC.textContent = humidityValue + '%';
    humidityElementPhone.textContent = humidityValue + '%';
    updateHumidityStyles();
});

onValue(pressureRef, (snapshot) => {
    const pressureValue = snapshot.val();
    let pressure = parseInt(pressureValue / 100);
    pressureElement.textContent = pressure;
});

window.addEventListener("resize", updateHumidityStyles);
updateHumidityStyles();

const apiKey = "763c113d8dc10a307631d99b3c8b52ef";
const city = "Skopje";

const weatherDescriptionContainer = document.getElementById("weather-description");
const sunriseTimeContainer = document.getElementById("sunrise-time");
const sunsetTimeContainer = document.getElementById("sunset-time");
const chanceOfRainContainer = document.getElementById("chanceOfRain");
const weatherImage = document.getElementById("weather-image");

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        const weatherDescription = data.weather[0].description;
        const sunriseTimestamp = data.sys.sunrise * 1000;
        const sunsetTimestamp = data.sys.sunset * 1000;
        const chanceOfRain = data.rain ? data.rain["1h"] : 0;

        const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString();
        const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString();

        weatherDescriptionContainer.innerHTML = `Weather: ${weatherDescription}`;
        sunriseTimeContainer.innerHTML = `Sunrise: ${sunriseTime}`;
        sunsetTimeContainer.innerHTML = `Sunset: ${sunsetTime}`;
        chanceOfRainContainer.innerHTML += `<br>Chance of Rain: ${chanceOfRain}%`;

        const currentTime = new Date().getTime();
        const isDaytime = currentTime > sunriseTimestamp && currentTime < sunsetTimestamp;
        const isNight = !isDaytime;

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

        weatherImage.src = svgPath;
    })
    .catch(error => console.error("Error fetching weather data:", error));
