import { useState, useEffect } from 'react'
import CountrySearch from './components/CountrySearch'
import countryService from './services/countryService'
import CountryList from './components/CountryList'
import Country from './components/Country'

const App = () => {
  const [newCountry, setNewCountry] = useState('')
  const [countries, setCountries] = useState([])
  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(newCountry.toLowerCase()))

  useEffect(() => {
      countryService
      .getAll()
      .then(allCountries => {
        const countriesWithShow = allCountries.map(c => ({
          ...c,
          toShow: false
        }))
        setCountries(countriesWithShow)
      })
    }, [])

  const handleCountryChange = (event) => {
    setNewCountry(event.target.value)
  }

  const toggleToShow = cca3 => {
    const country = countries.find(c => c.cca3 === cca3)
    const changedCountry = { ...country, toShow: !country.toShow }
    setCountries(countries.map(country => country.cca3 === cca3 ? changedCountry : country))
  }

  return (
    <div>
      <CountrySearch value={newCountry} onChange={handleCountryChange} />
      {countriesToShow.length > 10 ? <p>Too many matches, specify another filter</p>
        : countriesToShow.length === 1 ? <Country country={countriesToShow[0]}/> : <CountryList countries={countriesToShow} toggleToShow={toggleToShow} />}
    </div>
  )
}

export default App