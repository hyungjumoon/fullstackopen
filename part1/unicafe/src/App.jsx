import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const StatisticLine = ({type, count, percent}) => <div>{type} {count} {percent}</div>

const Statistics = ({good, neutral, bad}) => {
  if (good + neutral + bad === 0) {
    return (
      <div>
        <Header text='statistics' />
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <Header text='statistics' />
      <StatisticLine type='good' count={good} />
      <StatisticLine type='neutral' count={neutral} />
      <StatisticLine type='bad' count={bad} />
      <StatisticLine type='all' count={bad+good+neutral} />
      <StatisticLine type='average' count={(-1*bad+good) / (good+bad+neutral)} />
      <StatisticLine type='positive' count={(100*good) / (good+bad+neutral)} percent='%' />
    </div>
  )  
}

const StatisticLine2 = ({type, count, percent}) => {
  return (
    <tr>
      <td>{type}</td>
      <td>{count} {percent}</td>
    </tr>
  )
}

const Statistics2 = ({good, neutral, bad}) => {
  if (good + neutral + bad === 0) {
    return (
      <div>
        <Header text='statistics' />
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <Header text='statistics' />
      <table>
        <tbody>
          <StatisticLine2 type='good' count={good} />
          <StatisticLine2 type='neutral' count={neutral} />
          <StatisticLine2 type='bad' count={bad} />
          <StatisticLine2 type='all' count={bad+good+neutral} />
          <StatisticLine2 type='average' count={(-1*bad+good) / (good+bad+neutral)} />
          <StatisticLine2 type='positive' count={(100*good) / (good+bad+neutral)} percent='%' />
        </tbody>
      </table>
    </div>
  )  
}

const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text='give feedback' />
      <Button text='good' onClick={() => setGood(good+1)} />
      <Button text='neutral' onClick={() => setNeutral(neutral+1)} />
      <Button text='bad' onClick={() => setBad(bad+1)} />
      <Statistics2 good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App