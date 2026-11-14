// OpenWeatherMap current conditions and 3-day forecast for Lagos, Nigeria.
// Get an API key from https://openweathermap.org/api and replace the placeholder.
const OPEN_WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const WEATHER_CITY = "Lagos";
const WEATHER_COUNTRY = "NG";

const currentWeatherContainer = document.querySelector("#weather-current");
const forecastContainer = document.querySelector("#weather-forecast");

function titleCase(value = "") {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDay(dateString) {
  return new Intl.DateTimeFormat("en-NG", { weekday: "short" }).format(new Date(`${dateString}T12:00:00`));
}

async function loadWeather() {
  if (!currentWeatherContainer || !forecastContainer) return;

  if (OPEN_WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    currentWeatherContainer.textContent = "Add your OpenWeatherMap API key in scripts/weather.js to display live weather.";
    forecastContainer.textContent = "The three-day forecast will appear here after the API key is added.";
    return;
  }

  const query = `q=${encodeURIComponent(`${WEATHER_CITY},${WEATHER_COUNTRY}`)}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?${query}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${query}`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Weather service request failed. Check your API key and try again.");
    }

    const [current, forecast] = await Promise.all([currentResponse.json(), forecastResponse.json()]);
    const iconCode = current.weather?.[0]?.icon;
    const icon = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : "";

    currentWeatherContainer.replaceChildren();
    if (icon) {
      const weatherIcon = document.createElement("img");
      weatherIcon.src = icon;
      weatherIcon.alt = current.weather?.[0]?.description || "Current weather";
      weatherIcon.width = 90;
      weatherIcon.height = 90;
      currentWeatherContainer.append(weatherIcon);
    }

    const currentDetails = document.createElement("div");
    const temperature = document.createElement("p");
    temperature.className = "current-temperature";
    temperature.textContent = `${Math.round(current.main.temp)}°C`;
    const description = document.createElement("p");
    description.textContent = titleCase(current.weather?.[0]?.description || "Conditions unavailable");
    const feelsLike = document.createElement("p");
    feelsLike.textContent = `Feels like ${Math.round(current.main.feels_like)}°C`;
    currentDetails.append(temperature, description, feelsLike);
    currentWeatherContainer.append(currentDetails);

    // The forecast API returns readings every three hours. Use the reading nearest 12:00 for each day.
    const grouped = new Map();
    forecast.list.forEach((item) => {
      const date = item.dt_txt.slice(0, 10);
      if (!grouped.has(date)) grouped.set(date, []);
      grouped.get(date).push(item);
    });

    const forecastDays = [...grouped.entries()].slice(1, 4);
    forecastContainer.replaceChildren();

    forecastDays.forEach(([date, readings]) => {
      const midday = readings.reduce((closest, reading) => {
        const readingHour = Number(reading.dt_txt.slice(11, 13));
        const closestHour = Number(closest.dt_txt.slice(11, 13));
        return Math.abs(readingHour - 12) < Math.abs(closestHour - 12) ? reading : closest;
      }, readings[0]);

      const dayCard = document.createElement("article");
      dayCard.className = "forecast-card";
      const day = document.createElement("h4");
      day.textContent = formatDay(date);
      const iconImage = document.createElement("img");
      const forecastIcon = midday.weather?.[0]?.icon;
      iconImage.src = forecastIcon ? `https://openweathermap.org/img/wn/${forecastIcon}.png` : "";
      iconImage.alt = midday.weather?.[0]?.description || "Forecast conditions";
      iconImage.width = 50;
      iconImage.height = 50;
      const temp = document.createElement("p");
      temp.className = "forecast-temperature";
      temp.textContent = `${Math.round(midday.main.temp)}°C`;
      const condition = document.createElement("p");
      condition.textContent = titleCase(midday.weather?.[0]?.description || "Unavailable");
      dayCard.append(day, iconImage, temp, condition);
      forecastContainer.append(dayCard);
    });
  } catch (error) {
    currentWeatherContainer.textContent = "Weather information is temporarily unavailable.";
    forecastContainer.textContent = "The forecast could not be loaded.";
    console.error("Weather error:", error);
  }
}

loadWeather();
