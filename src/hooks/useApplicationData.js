import { useReducer, useEffect } from 'react'
import axios from 'axios'
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from 'reducers/application'

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })
  // console.log(state)
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then(all => {
      const days = all[0].data
      const appointments = all[1].data
      const interviewers = all[2].data
      dispatch({
        type: SET_APPLICATION_DATA,
        days,
        appointments,
        interviewers
      })
    })
  }, [])
  const setDay = day => dispatch({ type: SET_DAY, day })
  const bookInterview = (id, interview) =>
    dispatch({ type: SET_INTERVIEW, id, interview })
  const cancelInterview = id =>
    dispatch({ type: SET_INTERVIEW, id, interview: null })
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
