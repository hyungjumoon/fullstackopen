import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Filter = ({val, handle}) => {
  return (
    <div>
      find countries <input value={val} onChange={handle} />
    </div>
  )
}

const api_key = process.env.REACT_APP_API_KEY

const Detail = ({tmp, setCaps}) => {
  setCaps(tmp[0].capital)
  return (<div>
    <h2>{tmp[0].name}</h2>
    <div>capital {tmp[0].capital}</div>
    <div>population {tmp[0].population}</div>
    <h3>languages</h3>
    <ul>
      {tmp[0].languages.map(a => <li key={a.name}>{a.name}</li>)}
    </ul>
    {<img src={tmp[0].flag} alt="flag" height="300"></img>}
    <h3>Weather in {tmp[0].capital}</h3>
  </div>)
}

const Button = ({ onClick, text }) => 
(  
  <button onClick={onClick}>
  {text}
  </button>
)

const Country = ({countries, find, setFilter, setCaps}) => {
  const tmp = countries.filter(a => a.name.toUpperCase().search(find.toUpperCase()) !== -1)
  if (tmp.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (tmp.length === 1) {
    // setCaps(tmp[0].capital)
    return <Detail tmp={tmp} setCaps={setCaps}/>
  }
  return <div>{tmp.map(a => <div key={a.name}>{a.name} <Button onClick={() => setFilter(a.name)} text="show" /></div>)}</div>
}

const App = () => {
  const [ countries, setCountries ] = useState([]) 
  const [ filter, setFilter ] = useState('')
  const [ weather, setWeather ] = useState([])
  const [ caps, setCaps ] = useState('')

  const hook = () => { 
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
    }) 
  }

  useEffect(hook, [])
  // useEffect(hook2, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter val={filter} handle={handleFilterChange} />
      <Country countries={countries} find={filter} setFilter={setFilter} setCaps={setCaps} weather={weather} />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);