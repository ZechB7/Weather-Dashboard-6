var apiKey = '10fea8a70db9f779fce2e63944bde911';
var baseURL = 'https://api.openweathermap.org';

var searchInput = document.getElementById('search-input')
var searchButton = document.getElementById('search-button')
var todayWeatherElm = document.getElementById('today')
var forecastElm = document.getElementById("forecast")

dayjs.extend(window.dayjs_plugin_utc);

// get user cords
//weather api geocode
function getCoords(searchTerm = '') {
  console.log('getting coords', searchTerm)
  var apiUrl = `${baseURL}/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`;
  fetch(apiUrl)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (!data[0]) {
        alert('not found')
      } else {
        console.log(data)
        getForecast(data[0]);
        // return data
      }
    })
    .catch((err) => console.log(err))
}

//use geocode to get weather
function getForecast(coords) {
  console.log('getting todays weather')
  var { lat } = coords;
  var { lon } = coords;
  var city = coords.name;

  var apiUrl = `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      renderForecast(city, data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function displayTodaysWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  // Store response data from our fetch request in variables
  var tempF = weather.main.temp;
  var windMph = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  heading.setAttribute('class', 'h3 card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
  cardBody.append(heading, tempEl, windEl, humidityEl);

  todayWeatherElm.innerHTML = '';
  todayWeatherElm.append(card);
}

function display1Forecast(forecast) {
  // variables for data from api
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var tempF = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var windMph = forecast.wind.speed;

  // Create elements for a card
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.setAttribute('class', 'col-md');
  col.classList.add('five-day-card');
  card.setAttribute('class', 'card bg-primary h-100 text-white');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  // Add content to elements
  cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastElm.append(col);
}

function displayXForecast(forecast){
  var startDt = dayjs().add(1, 'day').startOf('day').unix();
  var endDt = dayjs().add(6, 'day').startOf('day').unix();

  var headingCol = document.createElement('div');
  var heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  forecastElm.innerHTML = '';
  forecastElm.append(headingCol);

  for (var i = 0; i < forecast.length; i++) {

    // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
    if (forecast[i].dt >= startDt && forecast[i].dt < endDt) {

      // Then filters through the data and returns only data captured at noon for each day.
      if (forecast[i].dt_txt.slice(11, 13) == "12") {
        display1Forecast(forecast[i]);
      }
    }
  }
}

function renderForecast(city, data) {
  displayTodaysWeather(city, data.list[0], data.city);
  displayXForecast(data.list);
}

function handleSearch(event){
  if (!searchInput.value) {
    return;
  }

  event.preventDefault();
  var search = searchInput.value.trim();
  getCoords(search);
  searchInput.value = '';}

searchButton.addEventListener('click', handleSearch);