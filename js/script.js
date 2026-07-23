const apiKey = "814e965f227845f827603ea8a80ca70f";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const animationContainer = document.getElementById("weatherAnimation");

let animation;

function loadAnimation(file) {

    if (animation) {
        animation.destroy();
    }

    animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: `assets/gifs/${file}`
    });

}

searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value.trim());
});

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        getWeather(cityInput.value.trim());
    }

});

async function getWeather(city) {

    if (city === "") {
        alert("Please enter a city.");
        return;
    }

    loadAnimation("loading.json");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        if (data.cod != 200) {
            showCityNotFound();
            return;
        }

        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        condition.textContent = data.weather[0].description;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} km/h`;

        changeAnimation(data.weather[0].main);

    }

    catch (error) {

        console.error(error);
        alert("Unable to fetch weather.");

    }

}

function changeAnimation(weather) {

    switch (weather) {

        case "Clear":
            loadAnimation("clear.json");
            break;

        case "Clouds":
            loadAnimation("cloudy.json");
            break;

        case "Rain":
        case "Drizzle":
            loadAnimation("rainy.json");
            break;

        case "Thunderstorm":
            loadAnimation("thunderstorm.json");
            break;

        case "Snow":
            loadAnimation("snow.json");
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            loadAnimation("mist.json");
            break;

        default:
            loadAnimation("clear.json");

    }

}

function showCityNotFound() {

    cityName.textContent = "City Not Found";
    temperature.textContent = "--°C";
    condition.textContent = "Try another city";
    humidity.textContent = "--%";
    wind.textContent = "-- km/h";

    loadAnimation("city-not-found.json");

}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";

} else {

    themeToggle.textContent = "🌙";

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";

    } else {

        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";

    }

});