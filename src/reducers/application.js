export const SET_DAY = 'SET_DAY'
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA'
export const SET_INTERVIEW = 'SET_INTERVIEW'

export default function reducer(state, action) {
  switch (action.type) {
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
        // skip
        if (
          (state.appointments[id].interview !== null && interview !== null) ||
          !day.appointments.includes(id)
        ) {
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
