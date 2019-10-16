import { useReducer, useEffect } from 'react'
import axios from 'axios'

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY'
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA'
  const SET_INTERVIEW = 'SET_INTERVIEW'

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY: {
        state = { ...state, day: action.day }
        return state
      }
      case SET_APPLICATION_DATA: {
        const { days, appointments, interviewers } = action
        state = { ...state, days, appointments, interviewers }
        return state
      }
      case SET_INTERVIEW: {
        const { id, interview } = action
        const appointment = {
          ...state.appointments[action.id],
          interview
        }
        const appointments = {
          ...state.appointments,
          [id]: appointment
        }
        // update remaining spots
        let days = [...state.days]
        days = days.map(day => {
          if (!day.appointments.includes(id)) {
            return day
          }
          return {
            ...day,
            spots: interview === null ? day.spots + 1 : day.spots - 1
          }
        })
        state = { ...state, appointments, days }
        return state
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        )
    }
  }
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
