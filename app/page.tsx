"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString());
  }, []);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setWeather({
        city: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
      });

      setHistory((prev) => {
        const updated = [
          data.name,
          ...prev.filter(
            (item) =>
              item.toLowerCase() !== data.name.toLowerCase()
          ),
        ];

        return updated.slice(0, 5);
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">

        <h1 className="text-5xl font-bold text-white text-center">
          Weather App
        </h1>

        <p className="text-center text-slate-300 mt-3">
          Search weather by city
        </p>

        <p className="text-center text-slate-400 mt-2 text-sm">
          {today}
        </p>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full p-4 rounded-xl bg-white/10 border border-slate-600 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full mt-4 p-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
        >
          Search Weather
        </button>

        {loading && (
          <p className="text-center text-white mt-6 animate-pulse">
            ⏳ Fetching weather...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 mt-4">
            {error}
          </p>
        )}

        {weather && (
          <div className="mt-6 p-5 rounded-2xl bg-white/10 border border-white/10 text-white">

            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Weather Icon"
              className="mx-auto"
            />

            <h2 className="text-3xl font-bold text-center">
              📍 {weather.city}
            </h2>

            <div className="mt-5 space-y-3 text-lg">
              <p>🌡 Temperature: {weather.temperature}°C</p>
              <p>💧 Humidity: {weather.humidity}%</p>
              <p>💨 Wind Speed: {weather.windSpeed} m/s</p>
              <p>☁ Condition: {weather.condition}</p>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6 bg-white/5 p-4 rounded-xl">
            <h3 className="text-white font-semibold mb-2">
              Recent Searches
            </h3>

            {history.map((item, index) => (
              <p
                key={index}
                className="text-slate-300 text-sm py-1"
              >
                📍 {item}
              </p>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}