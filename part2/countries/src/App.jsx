import { useState, useEffect } from 'react'
import axios from 'axios'

const apiKey = import.meta.env.VITE_SOME_KEY

const getWeather = (lat, lon) =>  {
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  return request.then(response => response.data)
}

const Weather = ({weather}) => {
  console.log(weather.icon)
  return (
    <div>
      <div>temperature {weather.temp - 273} Celsius</div>
      <img src={weather.icon} alt="weatherIcon" />
      <div>wind {weather.wind} m/s</div>
    </div>
  )
}

const Info = ({info, weather}) => {
  return (
    <div>
      <h1>{info.name.common}</h1>
      <div>capital {info.capital}</div>
      <div>area {info.area}</div>
      <h3>languages: </h3>
      <ul>
        {Object.values(info.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={info.flags.png} alt="flag" />
      <h2>Weather in {info.capital}</h2>
      <Weather weather={weather} />
    </div>
  )
}

const Panel = ({country, results, toggleView, weather}) => {
  if(country.length !== 0) {
    return <Info info={country[0]} weather={weather}/>
  }
  if(results.length < 10) {
    return results.map(r => <div key={r}>{r}<button onClick={() => toggleView(r)}>view</button></div>)
  }
  return <div>Too many matches, specify another filter</div>
}

const App = () => {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState([])
  const [names, setNames] = useState([])
  const [countries, setCountries] = useState([])
  const [results, setResults] = useState([])
  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
        setNames(response.data.map(c => c.name).map(c => c.common))
      })
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    const result = names.filter(c => c.toLowerCase().includes(event.target.value.toLowerCase()))
    setResults(result)
    if (result.length === 1) {
      const current = countries.filter(c => c.name.common === result[0])
      setCountry(current)
      const [lat,lon] = current[0].capitalInfo.latlng
      getWeather(lat, lon).then(data => {
        const newWeather = {
          temp: data.main.temp,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          wind: data.wind.speed,
        }
        setWeather(newWeather)
      })
    } else {
      setCountry([])
      setWeather({})
    }
  }
  
  const toggleView = (name) => {
    const current = countries.filter(c => c.name.common === name)
    setCountry(current)
    const [lat,lon] = current[0].capitalInfo.latlng
    getWeather(lat, lon).then(data => {
      const newWeather = {
        temp: data.main.temp,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        wind: data.wind.speed,
      }
      setWeather(newWeather)
    })
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearch} />
      <Panel country={country} results={results} toggleView={toggleView} weather={weather} />
    </div>
  )
}

export default App
