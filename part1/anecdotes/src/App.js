import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))

  const getRandomAnecdote = () => setSelected(Math.floor(Math.random() * anecdotes.length))
  
  const voteAnecdote = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
  }
  
  /*
  https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
  */
  const getMostVoted = () =>
    points.reduce(
      (maxIdx, point, idx) => point > points[maxIdx] ? idx : maxIdx,
      0
    )

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}<br/>has {points[selected]} votes</div>
      <Button handleClick={voteAnecdote} text="vote" />
      <Button handleClick={getRandomAnecdote} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[getMostVoted()]}<br/>has {points[getMostVoted()]} votes</div>
    </div>
  )
}

export default App