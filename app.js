document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "pmZUlgDlOjCU0Tt2IgbeQMTQL3PQeic0"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetch12HourForecast(locationKey);
                    fetch5DayForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetch12HourForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    display12HourForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No 12-hour forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 12-hour forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching 12-hour forecast data.</p>`;
            });
    }

    function fetch5DayForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    display5DayForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No 5-day forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching 5-day forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const iconNumber = data.WeatherIcon;
        const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber < 10 ? '0' : ''}${iconNumber}-s.png`;

        const weatherContent = `
            <h2>Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function display12HourForecast(data) {
        let forecastContent = '<h2>12-Hour Forecast</h2>';
        data.forEach(hour => {
            forecastContent += `
                <p>Time: ${new Date(hour.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Temperature: ${hour.Temperature.Value}°C</p>
                <p>Weather: ${hour.IconPhrase}</p>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }

    function display5DayForecast(data) {
        let forecastContent = '<h2>5-Day Forecast</h2>';
        data.forEach(day => {
            forecastContent += `
                <p>Date: ${new Date(day.Date).toLocaleDateString()}</p>
                <p>Day: ${day.Day.IconPhrase}</p>
                <p>Night: ${day.Night.IconPhrase}</p>
                <p>Temperature: ${day.Temperature.Minimum.Value}°C - ${day.Temperature.Maximum.Value}°C</p>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }
});
