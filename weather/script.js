const API_KEY = '98cddcc8f3f3d1a4403704658bf2ec11';               //OpenWeatherMap API key
const API_URL = 'https://api.openweathermap.org/data/3.0/onecall?';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherData = document.getElementById('weatherData');
const recentCities = document.getElementById('recentCities');
const currentLocation = document.getElementById('currentLocation');
const mapContainer = document.getElementById('map');

let recentSearches = JSON.parse(localStorage.getItem('recentCities')) || [];

searchBtn.addEventListener("click",()=>{
  const city = cityInput.value.trim();
  console.log(city);

// GeoCoding Api for location details
async function geoCoding() {
  try {
  let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
  // console.log(response)
  if (!response.ok) throw new Error('City not found');
  let data = await response.json();
  // console.log(data);
  console.log(data[0].name)
  return data
} catch (error) {
  console.error('Error fetching data:', error);
}
}


async function fetchWeatherByCoordinates(lat, lon) {
  try {
      const response = await fetch(
          `${API_URL}lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error('Unable to fetch location data');
      const data = await response.json();

      // displayWeather(data);
      fetchForecast(lat, lon); // Fetch forecast using coordinates
  } catch (error) {
      weatherData.innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}


// console.log(resp)
  // fetchWeather(city);
  // fetchWeatherByCoordinates()
 
  
})




  // Get current weather information and forecast data
  async function fetchWeather(lat,lon) {
    try {
    let response = await fetch(`${API_URL}lat=${lat}&lon=${lon}&exclude={part}&appid=${API_KEY}`);
    console.log(response)
    if (!response.ok) throw new Error('City not found');
    let data = await response.json();
    console.log(data);
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  }
  






