const API_KEY = '98cddcc8f3f3d1a4403704658bf2ec11'; // Replace with your OpenWeatherMap API key
const API_URL = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherData = document.getElementById('weatherData');
const recentCities = document.getElementById('recentCities');
const mapContainer = document.getElementById('map');

let recentSearches = JSON.parse(localStorage.getItem('recentCities')) || [];

// Initialize Leaflet map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Update UI with weather data
function displayWeather(data) {
  const { name, coord, main, weather, wind } = data;
  weatherData.innerHTML = `
    <h2 class="text-2xl font-bold">${name}</h2>
    <p>Temperature: ${main.temp}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
    <p>Conditions: ${weather[0].description}</p>
  `;

  // Update map with city location
  map.setView([coord.lat, coord.lon], 10);
  L.marker([coord.lat, coord.lon]).addTo(map).bindPopup(`${name}`).openPopup();
}

// Display recent searches
function updateRecentCities() {
  recentCities.innerHTML = '<h3 class="font-bold">Recent Cities</h3>';
  recentSearches.forEach((city) => {
    const button = document.createElement('button');
    button.textContent = city;
    button.className = 'recent-city bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300';
    button.addEventListener('click', () => fetchWeather(city));
    recentCities.appendChild(button);
  });
}

// Fetch weather data for a city
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `${API_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();

    // Add to recent searches
    if (!recentSearches.includes(city)) {
      recentSearches.push(city);
      if (recentSearches.length > 5) recentSearches.shift();
      localStorage.setItem('recentCities', JSON.stringify(recentSearches));
      updateRecentCities();
    }

    displayWeather(data);
  } catch (error) {
    weatherData.innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}

// Fetch weather data for coordinates (current location)
async function fetchWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(
      `${API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('Unable to fetch location data');
    const data = await response.json();

    displayWeather(data);
  } catch (error) {
    weatherData.innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}

// Get user's current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        weatherData.innerHTML = `<p class="text-red-500">Unable to access location: ${error.message}</p>`;
      }
    );
  } else {
    weatherData.innerHTML = `<p class="text-red-500">Geolocation is not supported by your browser</p>`;
  }
}

// Event listener for the search button
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    cityInput.value = '';
  } else {
    weatherData.innerHTML = `<p class="text-red-500">Please enter a city name</p>`;
  }
});

// Initialize recent searches and fetch weather for the current location on page load
updateRecentCities();
getCurrentLocation();
