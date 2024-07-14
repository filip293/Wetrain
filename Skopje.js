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
const batteryRef = ref(database, "Battery1");
const hourRef = ref(database, "Hours1");
const minuteRef = ref(database, "Minutes1");
const voltageRef = ref(database, "Voltage1");

const temperatureElement = document.getElementById("temperatureValue");
const humidityElementPC = document.getElementById("humidityValuePC");
const humidityElementPhone = document.getElementById("humidityValuePhone");
const pressureElement = document.getElementById("pressureValue");
const feelsLikeElement = document.getElementById("feelsLikeValue");
const batteryElement = document.getElementById("batteryValueContent");
const hourElement = document.getElementById("hourValueContent");
const minuteElement = document.getElementById("minuteValueContent");
const voltageElement = document.getElementById("voltageValueContent");

let lastHumidityValue = null;

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

function calculateFeelsLike(T, RH) {
    var T_F = (T * 9/5) + 32;
    var c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127, c4 = -0.22475541;
    var c5 = -6.83783e-3, c6 = -5.481717e-2, c7 = 1.22874e-3, c8 = 8.5282e-4, c9 = -1.99e-6;

    var HI_F = c1 + (c2 * T_F) + (c3 * RH) + (c4 * T_F * RH) +
               (c5 * T_F * T_F) + (c6 * RH * RH) +
               (c7 * T_F * T_F * RH) + (c8 * T_F * RH * RH) +
               (c9 * T_F * T_F * RH * RH);

    var HI_C = (HI_F - 32) * 5/9;

    return Math.round(HI_C);
}

onValue(temperatureRef, (snapshot) => {
    const temperatureValue = snapshot.val();
    temperatureElement.innerHTML = `${temperatureValue}<sup>°C</sup>`;
    calculateAndDisplayFeelsLike();
});

onValue(humidityRef, (snapshot) => {
    let humidityValue = snapshot.val();
    
    humidityValue = Math.min(humidityValue, 100);

    if (lastHumidityValue !== null && lastHumidityValue < 90 && humidityValue >= 100) {
        return;
    }

    lastHumidityValue = humidityValue;

    humidityElementPC.textContent = humidityValue + '%';
    humidityElementPhone.textContent = humidityValue + '%';
    updateHumidityStyles();
    calculateAndDisplayFeelsLike();
});

function calculateAndDisplayFeelsLike() {
    const temperatureValue = parseFloat(temperatureElement.textContent);
    const humidityValue = parseFloat(humidityElementPC.textContent);

    if (!isNaN(temperatureValue) && !isNaN(humidityValue)) {
        const feelsLike = calculateFeelsLike(temperatureValue, humidityValue);
        feelsLikeElement.innerHTML = `${feelsLike}<sup>°C</sup>`;
    }
}

onValue(pressureRef, (snapshot) => {
    const pressureValue = snapshot.val();
    let pressure = parseInt(pressureValue / 100);
    pressureElement.textContent = pressure;
});

onValue(batteryRef, (snapshot) => {
    const batteryValue = snapshot.val();
    batteryElement.textContent = batteryValue;
});

onValue(hourRef, (snapshot) => {
    const hourValue = snapshot.val();
    hourElement.textContent = hourValue;
});

onValue(minuteRef, (snapshot) => {
    const minuteValue = snapshot.val();
    minuteElement.textContent = minuteValue;
});

onValue(voltageRef, (snapshot) => {
    const voltageValue = snapshot.val();
    voltageElement.textContent = voltageValue;
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
        sunriseTimeContainer.innerHTML = `${sunriseTime}`;
        sunsetTimeContainer.innerHTML = `${sunsetTime}`;
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

        // Calculate percentage of day and night passed
        const sunrise = moment(sunriseTimestamp);
        const sunset = moment(sunsetTimestamp);
        const now = moment();

        let dayPercentage = 0;
        let nightPercentage = 0;

        if (isDaytime) {
            const totalDaytime = sunset.diff(sunrise);
            const elapsedDaytime = now.diff(sunrise);
            dayPercentage = (elapsedDaytime / totalDaytime) * 100;
        } else {
            const totalNighttime = moment(sunriseTimestamp + 86400000).diff(sunset); // Next day's sunrise
            const elapsedNighttime = now.isBefore(sunrise) ? now.diff(sunset.clone().subtract(1, 'days')) : now.diff(sunset);
            nightPercentage = (elapsedNighttime / totalNighttime) * 100;
        }
        const sunElement = document.querySelector('.sun');
        const moonElement = document.querySelector('.moon');
        sunElement.style.left = `${dayPercentage.toFixed(2)}%`;
        moonElement.style.left = `${nightPercentage.toFixed(2)}%`;
        console.log(`${dayPercentage.toFixed(2)}`)

        if(`${dayPercentage.toFixed(2)}` == 0.00){
            sunElement.style.display = "none";
            moonElement.style.display = "block";
        }else{
            sunElement.style.display = "block";
            moonElement.style.display = "none";
        }

    })
    .catch(error => console.error("Error fetching weather data:", error));
