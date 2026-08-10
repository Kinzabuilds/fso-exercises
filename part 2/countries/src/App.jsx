import { useEffect, useState } from 'react'
import axios from 'axios'

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (!country || !apiKey) {
      return
    }

    const lat = country.latlng[0]
    const lon = country.latlng[1]

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log('weather error', error)
      })
  }, [country, apiKey])

  const languages = country.languages
    ? Object.values(country.languages)
    : []

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>
        capital {country.capital?.[0]}
      </p>

      <p>
        area {country.area}
      </p>

      <h3>languages:</h3>

      <ul>
        {languages.map(language => (
          <li key={language}>
            {language}
          </li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width="180"
      />

      <h2>
        Weather in {country.capital?.[0]}
      </h2>

      {!apiKey && (
        <p>
          Weather API key is missing.
        </p>
      )}

      {weather && (
        <div>
          <p>
            temperature {weather.main.temp} Celsius
          </p>

          {weather.weather?.[0] && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          )}

          <p>
            wind {weather.wind.speed} m/s
          </p>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const matchingCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  const renderCountries = () => {
    if (selectedCountry) {
      return (
        <CountryInfo country={selectedCountry} />
      )
    }

    if (search.trim() === '') {
      return null
    }

    if (matchingCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (matchingCountries.length > 1) {
      return (
        <div>
          {matchingCountries.map(country => (
            <div key={country.cca3}>
              {country.name.common}{' '}

              <button
                onClick={() => showCountry(country)}
              >
                show
              </button>
            </div>
          ))}
        </div>
      )
    }

    if (matchingCountries.length === 1) {
      return (
        <CountryInfo country={matchingCountries[0]} />
      )
    }

    return <p>No matches</p>
  }

  return (
    <div>
      <div>
        find countries{' '}
        <input
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {renderCountries()}
    </div>
  )
}

export default App