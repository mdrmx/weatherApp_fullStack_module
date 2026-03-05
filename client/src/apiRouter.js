import { dailyForecast } from "./components/ui_components/weatherTile.js";

// call the local express API rather than hitting OpenWeather directly
export async function fetchWeather({ placename }) {
  // build query string based on what was provided
  const params = new URLSearchParams();
  if (placename) params.set("placename", placename);
  // if (lat && lon) {
  //   params.set("lat", lat);
  //   params.set("lon", lon);
  // }

  // make request to our own server
  console.log(params.toString());
  const url = `/weather?${params.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error ${response.status} – ${text}`);
    }
    const data = await response.json();
    dailyForecast(data.current, data.daily);
  } catch (err) {
    console.error("fetchWeather failed:", err);
    // optionally show an error to user
  }
}
