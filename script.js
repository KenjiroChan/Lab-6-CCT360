const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const detailsEl = document.getElementById("details");
const buttons = document.querySelectorAll("button");

function describeWeather(code) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Showers";
  return "Stormy";
}

function colourForTemp(temp) {
  if (temp < 10) return "lightblue";  
  if (temp < 25) return "lightgreen"; 
  return "orange";                 
}

async function getWeather(lat, lon, name) {
  cityEl.textContent = "Loading...";

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const now = data.current;

    cityEl.textContent = name;
    tempEl.textContent = `${Math.round(now.temperature_2m)}°C`;
    detailsEl.textContent = describeWeather(now.weather_code);

    document.body.style.backgroundColor = colourForTemp(now.temperature_2m);
  } catch (error) {
    cityEl.textContent = "Couldn't load the weather.";
    console.error(error);
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    getWeather(button.dataset.lat, button.dataset.lon, button.dataset.name);
  });
});

getWeather(43.65, -79.38, "Toronto");
