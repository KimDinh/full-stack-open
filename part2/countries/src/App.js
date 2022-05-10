import { useState, useEffect } from "react";
import axios from 'axios'
import Filter from "./components/Filter";
import Country from "./components/Country";
import CountryList from "./components/CountryList";

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState("")
  const [shownCountries, setShownCountries] = useState([])
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_API_KEY
    if (shownCountries.length === 1) {
      const capital = shownCountries[0].capital
      //console.log("fetch weather for", capital);
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}&units=metric`)
        .then((response) =>
          {
            //console.log("fetch weather successfull")
            setWeatherData(response.data)
          }
        )
    }
  }, [shownCountries])

  const handleFilterChange = (event) => {
    const filter = event.target.value
    const filteredCountries = filter === "" ?
      [] :
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    setNewFilter(filter)
    setShownCountries(filteredCountries)
  }

  return (
    <div>
      <Filter value={newFilter} onChange={handleFilterChange} />
      {shownCountries.length > 10 ?
        ( <div>Too many matches, specify another filter</div> ) :
        (
          shownCountries.length === 1 ?
            ( <Country country={shownCountries[0]} weatherData={weatherData} /> ) :
            ( <CountryList shownCountries={shownCountries} setShownCountries={setShownCountries}/> )
        )
      }
    </div>
  )
}

export default App
