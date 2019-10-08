import { useState } from 'react'

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial])
  function transition(nextMode, replace = false) {
    setMode(nextMode)
    if (replace) {
      setHistory(prev => [prev[0]])
    }
    setHistory(prev => [...prev, nextMode])
  }
  function back() {
    history.pop()
    if (history.length) {
      const prevMode = history[history.length - 1]
      setMode(prevMode)
    }
  }
  return { mode, transition, back }
}
