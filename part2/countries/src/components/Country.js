import WeatherData from "./WeatherData"

const Country = ({country, weatherData}) => (
  <>
    <h1>{country.name.common}</h1>
    <div>Capital: {country.capital}</div>
    <div>Area: {country.area}</div>
    <h2>Languages</h2>
    <ul>
      {Object.values(country.languages).map((lang) =>
        <li key={lang}>{lang}</li>
      )}
    </ul>
    <img
      src={country.flags.png}
      alt={`${country.name.common} flag`}
      width="150px"
    />
    <h2>Weather in {country.capital}</h2>
    <WeatherData weatherData={weatherData} />
  </>
)

export default Country