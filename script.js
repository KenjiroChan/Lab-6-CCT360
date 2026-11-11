// Grab the elements we will update
const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const iconEl = document.getElementById("icon");
const detailsEl = document.getElementById("details");
const updatedEl = document.getElementById("updated");
const buttons = document.querySelectorAll("button");

// Turn Open-Meteo's weather code into an emoji and a word
function describeWeather(code) {
  if (code === 0) return ["☀️", "Clear"];
  if (code <= 3) return ["⛅", "Cloudy"];
  if (code <= 48) return ["🌫️", "Foggy"];
  if (code <= 67) return ["🌧️", "Rainy"];
  if (code <= 77) return ["❄️", "Snowy"];
  if (code <= 82) return ["🌦️", "Showers"];
  return ["⛈️", "Stormy"];
}

// Pick a background colour based on the temperature
function colourForTemp(temp) {
  if (temp < 0) return "#7fb3ff";   // freezing = blue
  if (temp < 10) return "#a8d8ea";  // cold = light blue
  if (temp < 20) return "#b8e0a8";  // mild = green
  if (temp < 30) return "#ffd27f";  // warm = yellow
  return "#ff8a65";                 // hot = orange-red
}

// Fetch live weather and update the page
async function getWeather(lat, lon, name) {
  cityEl.textContent = "Loading...";

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,is_day`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const now = data.current;

    const [emoji, label] = describeWeather(now.weather_code);

    // Update content
    cityEl.textContent = name;
    tempEl.textContent = `${Math.round(now.temperature_2m)}°C`;
    iconEl.textContent = emoji;
    detailsEl.textContent = `${label} · Wind ${now.wind_speed_10m} km/h`;
    updatedEl.textContent = `Local time of reading: ${now.time.replace("T", " ")}`;

    // Update visuals: temperature sets the colour, day/night sets the mode
    const colour = colourForTemp(now.temperature_2m);
    if (now.is_day === 1) {
      document.body.classList.remove("night");
      document.body.style.background = colour;
    } else {
      document.body.classList.add("night");
      document.body.style.background = `linear-gradient(#1b1f3a, ${colour})`;
    }
  } catch (error) {
    cityEl.textContent = "Couldn't load the weather.";
    console.error(error);
  }
}

// Each button loads its own city
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    getWeather(button.dataset.lat, button.dataset.lon, button.dataset.name);
  });
});

// Load Toronto when the page opens
getWeather(43.65, -79.38, "Toronto");
