//simple express server with get route to fetch weather data from openweathermap api
//import express and node-fetch modules
import express from "express";
import fetch from "node-fetch";
//import environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

//create express app and set port number
const app = express();
const port = 3000;

async function getWeatherData(lat, lon, apiKey) {
  // apiKey must be passed in from caller to avoid relying on an undefined global
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

//define get route to fetch weather data from openweathermap api
app.get("/weather", async (req, res) => {
  const apiKey = process.env.API_KEY;
  console.log("/weather called", req.method, req.url, req.query);
  if (!apiKey) {
    console.error("Missing API_KEY environment variable");
    return res.status(500).json({ error: "Server missing API key" });
  }

  //get placename or coordinates from query parameters
  const { placename, lat, lon } = req.query;
  if (placename && !lat && !lon) {
    console.log("Received query parameters:", placename);

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${placename}&limit=5&appid=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("geocoding returned no results for", placename);
        return res.status(404).json({ error: "Location not found" });
      }
      const { lat: realLat, lon: realLon } = data[0];
      const weatherData = await getWeatherData(realLat, realLon, apiKey);
      res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather data (placename):", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  } else if (lat && lon) {
    try {
      const weatherData = await getWeatherData(lat, lon, apiKey);
      res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather data (coords):", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  } else {
    console.error("Bad request to /weather, missing parameters", req.query);
    res
      .status(400)
      .json({ error: "Must provide either placename or lat and lon" });
  }
});

//start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
