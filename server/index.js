import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;

// Resolve a place name to coordinates, then fetch weather for the top match.
async function geocoding(placename) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${placename}&limit=5&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    // OpenWeather geocoding returns a list of matches; use the first result.
    const { lat, lon } = data[0];
    getWeatherData(lat, lon);
  } catch {
    // Ignore fetch/parse errors so failed lookups do not break the app.
  }
}

// Fetch One Call weather data and pass it to the forecast renderer.
async function getWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

app.get("/weather", (req, res) => {
  console.log(req.query);
  const { placename } = req.query;
  geocoding(placename);
  res.send({ messag: "weather API" });
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port} `);
});
