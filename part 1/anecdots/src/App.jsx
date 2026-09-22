import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // 1. Fixed array initialization syntax
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  // 2. Fixed logic to select a random or next anecdote safely
  const handleClick = () => {
    const nextIndex = (selected + 1) % anecdotes.length
    setSelected(nextIndex)
  }

  // 3. Fixed state naming and updated state properly using setVotes
  const handleVoteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  // 4. Fixed JavaScript capitalization (Math) and array methods (indexOf)
  const maxVotes = Math.max(...votes)
  const highestIndex = votes.indexOf(maxVotes)

  return (
    <>
      <p>{anecdotes[selected]}</p>
      <p>Has {votes[selected]} votes</p>
      
      <button onClick={handleVoteClick}>Vote</button>
      <button onClick={handleClick}>Next anecdote</button>

      <h2>Anecdote with most votes</h2>
      {maxVotes > 0 ? (
        <>
          <p>{anecdotes[highestIndex]}</p>
          <p>Has {maxVotes} votes</p>
        </>
      ) : (
        <p>No votes cast yet</p>
      )}
    </>
  )
}

export default App
