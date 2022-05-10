const CountryList = ({shownCountries, setShownCountries}) => (
  <>
    {shownCountries.map((country) =>
      <div key={country.name.common}>
        {country.name.common} <button onClick={() => setShownCountries([country])}>show</button>
      </div>
    )}
  </>
)

export default CountryList