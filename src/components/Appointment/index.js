import React from 'react'
import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import Form from 'components/Appointment/Form'
import useVisualMode from 'hooks/useVisualMode'

export default function Appointment(props) {
  const EMPTY = 'EMPTY'
  const SHOW = 'SHOW'
  const CREATE = 'CREATE'
  const SAVING = 'SAVEING'

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )
  function onAdd() {
    transition(CREATE)
  }
  function onSave() {
    transition(SAVING)
  }
  function onCancel() {
    back()
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={[]} onSave={onSave} onCancel={onCancel} />
      )}
      {mode}
    </article>
  )
}
