import React, { useState } from 'react'
import ReactDOM from 'react-dom'

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

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([])
  const [mx, setMx] = useState(0)
  if (votes.length < 1) {
    setVotes(new Array(props.anecdotes.length).fill(0))
  }

  const tmp = () => {
    const copy = {...votes}
    copy[selected] += 1
    setVotes(copy)
    if (copy[selected] > copy[mx]) {
      setMx(selected)
    }
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <div>{props.anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <Button text="vote" onClick={tmp} />
      <Button text="next anecdote" onClick={()=>setSelected(Math.floor(props.anecdotes.length*Math.random()))} />
      <Header text="Anecdote with most votes" />
      <div>{props.anecdotes[mx]}</div>
      <div>has {votes[mx]} votes</div>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)