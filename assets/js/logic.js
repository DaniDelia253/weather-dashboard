const cityFormEl = document.querySelector("#city-form");
const cityInputEl = document.querySelector("#city-input");
const weatherOutputContainerEl = document.querySelector("#right-container");
const historyButtonsEl = document.querySelector(".history-buttons")
let today = new Date();

let searchHistory = []

var loadSearchHistory = function () {

    historyButtonsEl.innerHTML = ""

    if (localStorage.getItem('weatherSearches')) {
        searchHistory = JSON.parse(localStorage.getItem('weatherSearches'))
    } else {
        searchHistory = []
    }

    for (var i = 0; i < searchHistory.length; i++) {
        var historyButton = document.createElement('button')
        historyButton.textContent = searchHistory[i].name
        historyButton.classList = 'btn btn-secondary col-10'
        historyButtonsEl.appendChild(historyButton)
    }
}


var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim()

    if (city) {
        getCoordinates(city);
        cityInputEl.value = "";
    } else {
        alert('Please enter a city name.')
    }


}

var getCoordinates = function (city) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=e4105c0f0de9939b70a043b6810d01fe")
        .then(function (response) {
            //request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    const cityInfo = {
                        name: data[0].name,
                        lat: data[0].lat,
                        lon: data[0].lon
                    };
                    searchHistory.push(cityInfo)
                    localStorage.setItem('weatherSearches', JSON.stringify(searchHistory))
                    getWeather(cityInfo)
                });
            } else {
                alert("Error, please try again");
            }
        })
}

var getWeather = function (cityInfo) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityInfo.lat + "&lon=" + cityInfo.lon + "&units=imperial&exclude=minutely,hourly&appid=e4105c0f0de9939b70a043b6810d01fe")
        .then(function (response) {
            //request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    const weather = {
                        city: cityInfo.name,
                        lat: data.lat,
                        lon: data.lon,
                        currentWeatherArr: data.current,
                        dailyWeatherArr: data.daily
                    };
                    displayWeather(weather)
                    loadSearchHistory()
                });
            } else {
                alert("Error, please try again");
            }
        })
}

const displayWeather = function (weather) {

    while (weatherOutputContainerEl.firstChild) {
        weatherOutputContainerEl.removeChild(weatherOutputContainerEl.firstChild);
    }
    const currentWeatherContainerEl = document.createElement('div')
    currentWeatherContainerEl.classList = '.container'
    currentWeatherContainerEl.id = 'current-weather-container'
    const currentWeatherTitleEl = document.createElement('div')
    currentWeatherTitleEl.classList = '.row'
    const currentWeatherCityEl = document.createElement('h2')
    currentWeatherCityEl.classList = '.col-auto d-inline px-1'
    currentWeatherCityEl.textContent = weather.city
    const currentWeatherDateEl = document.createElement('h2')
    currentWeatherDateEl.classList = '.col-auto d-inline px-1'
    currentWeatherDateEl.textContent = '(' + (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + ')'
    const currentWeatherIconEl = document.createElement('img')
    currentWeatherIconEl.classList = '.col-auto d-inline px-1'
    currentWeatherIconEl.src = 'https://openweathermap.org/img/wn/' + weather.currentWeatherArr.weather[0].icon + '@2x.png'
    currentWeatherIconEl.alt = 'weather icon'
    const currentWeatherInfoEl = document.createElement('div')
    currentWeatherInfoEl.classList = ''
    const currentWeatherTempEl = document.createElement('p')
    currentWeatherTempEl.textContent = 'Temp: ' + weather.currentWeatherArr.temp + ' \u00B0F'
    const currentWeatherWindEl = document.createElement('p')
    currentWeatherWindEl.textContent = 'Wind: ' + weather.currentWeatherArr.wind_speed + ' MPH'
    const currentWeatherHumidityEl = document.createElement('p')
    currentWeatherHumidityEl.textContent = 'Humidity: ' + weather.currentWeatherArr.humidity + '%'
    const currentWeatherUVRowEl = document.createElement('div')
    currentWeatherUVRowEl.classList = 'mb-2'
    const currentWeatherUVEl = document.createElement('p')
    currentWeatherUVEl.textContent = 'UV Index: '
    currentWeatherUVEl.classList = 'd-inline'
    const currentWeatherUVBadgeEl = document.createElement('span')
    let uvIndex = weather.currentWeatherArr.uvi
    currentWeatherUVBadgeEl.textContent = uvIndex
    if (uvIndex < 2.01) {
        currentWeatherUVBadgeEl.classList = 'badge bg-success d-inline'
    } else if (uvIndex > 5.99) {
        currentWeatherUVBadgeEl.classList = 'badge bg-danger d-inline'
    } else {
        currentWeatherUVBadgeEl.classList = 'badge bg-warning text-dark d-inline'
    }
    const FutureWeatherContainerEl = document.createElement('div')
    FutureWeatherContainerEl.classList = 'container'
    const futureWeatherTitleEl = document.createElement('div')
    futureWeatherTitleEl.classList = 'row h3 p-4'
    futureWeatherTitleEl.textContent = '5-Day Forecast:'
    const futureWeatherBoxesEl = document.createElement('div')
    futureWeatherBoxesEl.classList = 'row justify-content-around'

    weatherOutputContainerEl.appendChild(currentWeatherContainerEl)
    currentWeatherContainerEl.appendChild(currentWeatherTitleEl)
    currentWeatherTitleEl.appendChild(currentWeatherCityEl)
    currentWeatherTitleEl.appendChild(currentWeatherDateEl)
    currentWeatherTitleEl.appendChild(currentWeatherIconEl)
    currentWeatherContainerEl.appendChild(currentWeatherInfoEl)
    currentWeatherInfoEl.appendChild(currentWeatherTempEl)
    currentWeatherInfoEl.appendChild(currentWeatherWindEl)
    currentWeatherInfoEl.appendChild(currentWeatherHumidityEl)
    currentWeatherInfoEl.appendChild(currentWeatherUVRowEl)
    currentWeatherUVRowEl.appendChild(currentWeatherUVEl)
    currentWeatherUVRowEl.appendChild(currentWeatherUVBadgeEl)
    weatherOutputContainerEl.appendChild(FutureWeatherContainerEl)
    FutureWeatherContainerEl.appendChild(futureWeatherTitleEl)
    FutureWeatherContainerEl.appendChild(futureWeatherBoxesEl)

    for (var i = 1; i < 6; i++) {
        const futureWeatherBoxEl = document.createElement('div')
        futureWeatherBoxEl.classList = 'col-2'
        futureWeatherBoxEl.id = 'future-weather-box'

        var a = new Date(weather.dailyWeatherArr[i].dt * 1000);
        var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = month + '/' + date + '/' + year + ' ';
        const futureWeatherBoxDateEl = document.createElement('p')
        futureWeatherBoxDateEl.textContent = time
        futureWeatherBoxDateEl.classList = 'm-1'
        const futureWeatherIconEl = document.createElement('img')
        // futureWeatherIconEl.classList = '.col-auto d-inline px-1'
        futureWeatherIconEl.src = 'https://openweathermap.org/img/wn/' + weather.dailyWeatherArr[i].weather[0].icon + '.png'
        futureWeatherIconEl.alt = 'weather icon'
        const futureWeatherTempEl = document.createElement('p')
        futureWeatherTempEl.textContent = 'Temp: ' + weather.dailyWeatherArr[i].temp.day + ' \u00B0F'
        const futureWeatherWindEl = document.createElement('p')
        futureWeatherWindEl.textContent = 'Wind: ' + weather.dailyWeatherArr[i].wind_speed + 'MPH'
        const futureWeatherHumidityEl = document.createElement('p')
        futureWeatherHumidityEl.textContent = 'Humidity: ' + weather.dailyWeatherArr[i].humidity + '%'

        futureWeatherBoxesEl.appendChild(futureWeatherBoxEl)
        futureWeatherBoxEl.appendChild(futureWeatherBoxDateEl)
        futureWeatherBoxEl.appendChild(futureWeatherIconEl)
        futureWeatherBoxEl.appendChild(futureWeatherTempEl)
        futureWeatherBoxEl.appendChild(futureWeatherWindEl)
        futureWeatherBoxEl.appendChild(futureWeatherHumidityEl)
    }
}

//save weather conditions as an object

loadSearchHistory()
cityFormEl.addEventListener('submit', formSubmitHandler)

historyButtonsEl.addEventListener('click', function (city) {
    let clickedCity = city.target.textContent

    function isCity(cityName) {
        return cityName.name === clickedCity;
    }
    let cityInfo = searchHistory.find(isCity);
    getWeather(cityInfo)

})




