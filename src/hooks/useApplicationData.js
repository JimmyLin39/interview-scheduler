import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })
  const setDay = day => setState({ ...state, day })

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then(all => {
      const days = all[0].data
      const appointments = all[1].data
      const interviewers = all[2].data
      setState(prev => ({
        ...prev,
        days,
        appointments,
        interviewers
      }))
    })
  }, [])
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    setState({ ...state, appointments })
  }
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    setState({ ...state, appointments })
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
