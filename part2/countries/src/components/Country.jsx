import { useState, useEffect } from 'react'
import weatherService from '../services/weatherService'
import CountryWeather from './CountryWeather'

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        weatherService
        .getWeather(country.capital[0])
        .then(weatherData => {
            console.log('Weather data:', weatherData)
            setWeather(weatherData)
        })
    }, [])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages).map(language => 
                    <li key={language}> {language} </li>
                )}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
            <CountryWeather weather={weather} />
        </div>
    )
}

export default Country