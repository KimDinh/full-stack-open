const WeatherData = (({weatherData}) => {
  //console.log("weather", weatherData)
  return weatherData ? (
      <>
        <div>temperature {weatherData.main.temp} Celcius</div>
        <img
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={`weather icon at ${weatherData.name}`}
        />
        <div>wind {weatherData.wind.speed} m/s</div>
      </>
    ) :
    null
})

export default WeatherData