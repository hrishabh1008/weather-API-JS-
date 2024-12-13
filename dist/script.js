const apiKey = "98cddcc8f3f3d1a4403704658bf2ec11"; // Replace with your OpenWeatherMap API key
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/";

async function fetchWeatherData(city) {
  try {
    const response = await fetch(`${weatherBaseUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function fetchForecastData(city) {
  try {
    const response = await fetch(`${weatherBaseUrl}forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}








document.getElementById("searchBtn").addEventListener("click", async () => {
    const city = document.getElementById("cityInput").value.trim();
    const weatherCard = document.getElementById("weatherCard");
  
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
  
    try {
      const weatherData = await fetchWeatherData(city);
  
      // Update the UI
      document.getElementById("cityName").textContent = weatherData.name;
      document.getElementById("weatherDescription").textContent = weatherData.weather[0].description;
      document.getElementById("temperature").textContent = `Temp: ${weatherData.main.temp}°C`;
      document.getElementById("humidity").textContent = `Humidity: ${weatherData.main.humidity}%`;
      document.getElementById("windSpeed").textContent = `Wind: ${weatherData.wind.speed} m/s`;
  
      weatherCard.classList.remove("hidden");
    } catch (error) {
      alert(error.message);
      weatherCard.classList.add("hidden");
    }
  });
  









  async function displayForecast(city) {
    try {
      const forecastData = await fetchForecastData(city);
      const forecastSection = document.getElementById("forecastSection");
      const forecastCards = document.getElementById("forecastCards");
  
      // Clear previous forecasts
      forecastCards.innerHTML = "";
  
      // Filter data for 5-day forecast (1 forecast per day)
      const dailyForecasts = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
  
      // Generate forecast cards
      dailyForecasts.forEach((day) => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const temp = `${day.main.temp}°C`;
        const wind = `Wind: ${day.wind.speed} m/s`;
        const humidity = `Humidity: ${day.main.humidity}%`;
  
        // Create a card
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-lg shadow-lg flex flex-col items-center";
  
        card.innerHTML = `
          <h3 class="font-bold">${date}</h3>
          <img src="${icon}" alt="Weather Icon" class="my-2">
          <p>${temp}</p>
          <p>${wind}</p>
          <p>${humidity}</p>
        `;
  
        forecastCards.appendChild(card);
      });
  
      forecastSection.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  }
  
  // Modify search button logic to include forecast
  document.getElementById("searchBtn").addEventListener("click", async () => {
    const city = document.getElementById("cityInput").value.trim();
    const weatherCard = document.getElementById("weatherCard");
  
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
  
    try {
      const weatherData = await fetchWeatherData(city);
  
      // Update current weather UI
      document.getElementById("cityName").textContent = weatherData.name;
      document.getElementById("weatherDescription").textContent = weatherData.weather[0].description;
      document.getElementById("temperature").textContent = `Temp: ${weatherData.main.temp}°C`;
      document.getElementById("humidity").textContent = `Humidity: ${weatherData.main.humidity}%`;
      document.getElementById("windSpeed").textContent = `Wind: ${weatherData.wind.speed} m/s`;
  
      weatherCard.classList.remove("hidden");
  
      // Fetch and display forecast
      await displayForecast(city);
    } catch (error) {
      alert(error.message);
      weatherCard.classList.add("hidden");
      document.getElementById("forecastSection").classList.add("hidden");
    }
  });
  



















  document.getElementById("locationBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
  
      try {
        // Fetch weather data for current location
        const response = await fetch(`${weatherBaseUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const weatherData = await response.json();
  
        // Update UI with current weather
        document.getElementById("cityName").textContent = weatherData.name;
        document.getElementById("weatherDescription").textContent = weatherData.weather[0].description;
        document.getElementById("temperature").textContent = `Temp: ${weatherData.main.temp}°C`;
        document.getElementById("humidity").textContent = `Humidity: ${weatherData.main.humidity}%`;
        document.getElementById("windSpeed").textContent = `Wind: ${weatherData.wind.speed} m/s`;
  
        document.getElementById("weatherCard").classList.remove("hidden");
  
        // Fetch and display forecast
        await displayForecast(weatherData.name);
      } catch (error) {
        alert("Failed to fetch weather data for your location.");
        console.error(error);
      }
    }, (error) => {
      alert("Unable to retrieve your location.");
      console.error(error);
    });
  });
  
