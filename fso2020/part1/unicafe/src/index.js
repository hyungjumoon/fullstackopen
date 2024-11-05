import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './index.css';

const Button = ({ onClick, text }) => 
(  
  <button onClick={onClick}>
  {text}
  </button>
)

const Header = ({text}) => {
  return (
    <div>
      <h1>{text}</h1>
    </div>
  )
}

const Statistic = (props) => {
  if (props.perc) {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.stat}</td>
        <td>%</td>
      </tr>
    )
  } else {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.stat}</td>
      </tr>
    )
  }
}

const Statistics = ({good, bad, neutral}) => {
  return (
    <div>
      <Header text="statistics" />
      <table>
        <tbody>
          <Statistic text="good" stat={good} />
          <Statistic text="neutral" stat={neutral} />
          <Statistic text="bad" stat={bad} />
          <Statistic text="all" stat={good+neutral+bad} />
          <Statistic text="average" stat={(good+neutral+bad !== 0) ? (good-bad)/(good+neutral+bad) : 0} />
          <Statistic text="positive" stat={(good+neutral+bad !== 0) ? (good)/(good+neutral+bad)*100 : 0} perc={true} />
        </tbody>
      </table>
    </div> 
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <Header text="give feedback" />
        <Button onClick={() => setGood(good+1)} text="good" />
        <Button onClick={() => setNeutral(neutral+1)} text="neutral" />
        <Button onClick={() => setBad(bad+1)} text="bad" />
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)