import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = (props) => {
  return (
    <div>{props.text} {props.value}</div>
  )
}

const Statistics = (props) => {
  const calculateAverage = () => {
    return (props.good - props.bad) / (props.good + props.bad + props.neutral)
  }

  const calculatePositivePecentage = () => {
    return props.good/ (props.good + props.bad + props.neutral) * 100 + ' %'
  }

  if (props.good + props.bad + props.neutral === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.bad} />
      <StatisticLine text="bad" value ={props.neutral} />
      <StatisticLine text="all" value ={props.good + props.bad + props.neutral} />
      <StatisticLine text="average" value ={calculateAverage()} />
      <StatisticLine text="positive" value ={calculatePositivePecentage()} />
    </>
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