// ThingSpeak Configuration
const thingSpeakChannelId = "2768180";
const thingSpeakReadApiKey = "5T1IE0FVCBNL3HA0";

// UI Elements
const temperatureElement = document.getElementById("temperatureValue");
const humidityElementPC = document.getElementById("humidityValuePC");
const humidityElementPhone = document.getElementById("humidityValuePhone");
const pressureElement = document.getElementById("pressureValue");
const pressureElementMobile = document.getElementById("pressureValueMobile");
const feelsLikeElement = document.getElementById("feelsLikeValue");
const feelsLikeElementMobile = document.getElementById("feelsLikeValueMobile");
const batteryElement = document.getElementById("batteryValueContent");
const hourElement = document.getElementById("hourValueContent");
const minuteElement = document.getElementById("minuteValueContent");
const voltageElement = document.getElementById("voltageValueContent");
const sunriseTimeElement = document.getElementById("sunrise-time");
const sunsetTimeElement = document.getElementById("sunset-time");
const sunriseTimeElementMobile = document.getElementById("sunrise-time-mobile");
const sunsetTimeElementMobile = document.getElementById("sunset-time-mobile");

let lastHumidityValue = null;

// Update humidity styles for responsiveness
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
    if (T < 27) {
        return Math.round(T);
    }

    var T_F = (T * 9 / 5) + 32;
    var c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127, c4 = -0.22475541;
    var c5 = -6.83783e-3, c6 = -5.481717e-2, c7 = 1.22874e-3, c8 = 8.5282e-4, c9 = -1.99e-6;

    var HI_F = c1 + (c2 * T_F) + (c3 * RH) + (c4 * T_F * RH) +
        (c5 * T_F * T_F) + (c6 * RH * RH) +
        (c7 * T_F * T_F * RH) + (c8 * T_F * RH * RH) +
        (c9 * T_F * T_F * RH * RH);

    var HI_C = (HI_F - 32) * 5 / 9;

    return Math.round(HI_C);
}

// Fetch data from ThingSpeak
async function fetchDataFromThingSpeak() {
    const url = `https://api.thingspeak.com/channels/${thingSpeakChannelId}/feeds.json?api_key=${thingSpeakReadApiKey}&results=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.feeds && data.feeds.length > 0) {
        const latestData = data.feeds[0];
        updateUI(latestData);
    }
}

// Update UI with fetched data
function updateUI(data) {
    const temperature = parseFloat(data.field3);
    const humidity = parseFloat(data.field5);
    const pressure = Math.round(parseFloat(data.field4));
    const voltage = parseFloat(data.field2);
    const time = data.field1;

    temperatureElement.innerHTML = `${temperature}<sup>°C</sup>`;
    humidityElementPC.textContent = `${humidity}%`;
    humidityElementPhone.textContent = `${humidity}%`;
    pressureElement.textContent = pressure;
    pressureElementMobile.textContent = pressure;
    voltageElement.textContent = voltage;
    batteryElement.textContent = `${Math.round(voltage * 10)}%`;
    hourElement.textContent = `Last Updated: ${time}`;

    if (humidity !== lastHumidityValue) {
        lastHumidityValue = humidity;
        updateHumidityStyles();
    }

    if (!isNaN(temperature) && !isNaN(humidity)) {
        const feelsLike = calculateFeelsLike(temperature, humidity);
        feelsLikeElement.innerHTML = `${feelsLike}<sup>°C</sup>`;
        feelsLikeElementMobile.innerHTML = `${feelsLike}<sup>°C</sup>`;
    }
}

const apiKey = "763c113d8dc10a307631d99b3c8b52ef";
const city = "Skopje";

const weatherDescriptionContainer = document.getElementById("weather-description");
const chanceOfRainContainer = document.getElementById("chanceOfRain");
const weatherImage = document.getElementById("weather-image");

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        const weatherDescription = data.weather[0].description;
        const sunriseTimestamp = data.sys.sunrise * 1000;
        const sunsetTimestamp = data.sys.sunset * 1000;
        const chanceOfRain = data.rain ? data.rain["1h"] : 0;
        const options = { hour: '2-digit', minute: '2-digit' };
        const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString([], options);
        const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString([], options);

        weatherDescriptionContainer.innerHTML = `Weather: ${weatherDescription}`;
        sunriseTimeElement.innerHTML = `${sunriseTime}`;
        sunsetTimeElement.innerHTML = `${sunsetTime}`;
        sunriseTimeElementMobile.innerHTML = `${sunriseTime}`;
        sunsetTimeElementMobile.innerHTML = `${sunsetTime}`;
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
            const totalNighttime = moment(sunriseTimestamp + 86400000).diff(sunset);
            const elapsedNighttime = now.isBefore(sunrise) ? now.diff(sunset.clone().subtract(1, 'days')) : now.diff(sunset);
            nightPercentage = (elapsedNighttime / totalNighttime) * 100;
        }

        const sunElement = document.querySelector('.sun');
        const moonElement = document.querySelector('.moon');
        const sunElement2 = document.querySelector('.sun2');
        const moonElement2 = document.querySelector('.moon2');
        
        sunElement.style.left = `${dayPercentage.toFixed(2)}%`;
        moonElement.style.left = `${nightPercentage.toFixed(2)}%`;
        sunElement2.style.left = `${dayPercentage.toFixed(2)}%`;
        moonElement2.style.left = `${nightPercentage.toFixed(2)}%`;
        
        if (dayPercentage.toFixed(2) == 0.00) {
            sunElement.style.display = "none";
            moonElement.style.display = "block";
            moonElement2.style.display = "block";
            sunElement2.style.display = "none";
        } else {
            sunElement.style.display = "block";
            moonElement.style.display = "none";
            moonElement2.style.display = "none";
            sunElement2.style.display = "block";
        }
        

    })
    .catch(error => console.error("Error fetching weather data:", error));

// Fetch ThingSpeak data every minute
setInterval(fetchDataFromThingSpeak, 60000);
fetchDataFromThingSpeak();
