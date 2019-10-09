import React from 'react'
import axios from 'axios'
import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import Form from 'components/Appointment/Form'
import Confirm from 'components/Appointment/Confirm'
import Status from 'components/Appointment/Status'
import useVisualMode from 'hooks/useVisualMode'

export default function Appointment(props) {
  const EMPTY = 'EMPTY'
  const SHOW = 'SHOW'
  const CREATE = 'CREATE'
  const EDIT = 'EDIT'
  const SAVING = 'SAVEING'
  const DELETING = 'DELETING'
  const CONFIRM = 'CONFIRM'

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
    props.bookInterview(props.id, interview)
    axios
      .put(`/api/appointments/${props.id}`, {
        interview
      })
      .then(response => {
        transition(SHOW)
      })
      .catch(error => {
        console.log(error)
      })
  }
  function cancelAppointment() {
    transition(DELETING)
    props.cancelInterview(props.id)
    transition(EMPTY)
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
    </article>
  )
}
