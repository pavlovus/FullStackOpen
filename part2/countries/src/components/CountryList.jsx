import Country from "./Country"

const CountryList = ({ countries, toggleToShow }) => {
    return (
        <ul>
            {countries.map(country =>{
                const label = country.toShow ? 'Hide' : 'Show'
                return (
                <li key={country.cca3}>
                    {country.toShow ? <Country country={country} /> : <span> {country.name.common} </span>}
                    <button onClick={() => toggleToShow(country.cca3)}>{label}</button>
                </li>)
            } 
            )}
        </ul>
    )
}

export default CountryList