import React from 'react'
import axios from 'axios'
import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import Form from 'components/Appointment/Form'
import Confirm from 'components/Appointment/Confirm'
import Status from 'components/Appointment/Status'
import Error from 'components/Appointment/Error'
import useVisualMode from 'hooks/useVisualMode'

export default function Appointment(props) {
  const EMPTY = 'EMPTY'
  const SHOW = 'SHOW'
  const CREATE = 'CREATE'
  const EDIT = 'EDIT'
  const SAVING = 'SAVEING'
  const DELETING = 'DELETING'
  const CONFIRM = 'CONFIRM'
  const ERROR_SAVE = 'ERROR_SAVE'
  const ERROR_DELETE = 'ERROR_DELETE'

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )
  function onAdd() {
    transition(CREATE)
  }
  function onCancel() {
    back()
  }
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING)
    axios
      .put(`/api/appointments/${props.id}`, {
        interview
      })
      .then(response => {
        props.bookInterview(props.id, interview)
        transition(SHOW)
      })
      .catch(error => {
        transition(ERROR_SAVE, true)
        console.log(error)
      })
  }
  function cancelAppointment() {
    transition(DELETING)
    axios
      .delete(`/api/appointments/${props.id}`, {})
      .then(response => {
        props.cancelInterview(props.id)
        transition(EMPTY)
      })
      .catch(error => {
        transition(ERROR_DELETE, true)
        console.log(error)
      })
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={onCancel}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={save}
          onCancel={onCancel}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment"
          onConfirm={cancelAppointment}
          onCancel={onCancel}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === ERROR_SAVE && (
        <Error message="Could not save appointment" onClose={onCancel} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete appointment" onClose={onCancel} />
      )}
    </article>
  )
}
