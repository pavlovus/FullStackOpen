import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, value}) => <div>{text} {value}</div>

const Statistics = ({good, bad, neutral}) => {
  const calculateAverage = () => (good - bad) / (good + bad + neutral)

  const calculatePositivePecentage = () =>  (good/ (good + bad + neutral) * 100 + ' %')

  if (good + bad + neutral === 0) { return <div>No feedback given</div> }

  return (
      <table>
        <tbody>
          <tr>
            <td>
              <StatisticLine text='good' value={good} />
            </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text='neutral' value={neutral} />
              </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text='bad' value={bad} />
              </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text='all' value={good + bad + neutral} />
              </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text='average' value={calculateAverage()} />
              </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text='positive' value={calculatePositivePecentage()} />
              </td>
          </tr>
        </tbody>
      </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <h1>statistics</h1>
      <Statistics good = {good} bad = {bad} neutral = {neutral}/>
    </div>
  )
}

export default App