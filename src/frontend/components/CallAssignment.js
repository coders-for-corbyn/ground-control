import React from 'react';
import Relay from 'react-relay';
import {BernieText, BernieColors} from './styles/bernie-css';
import {Paper, List, ListItem, FlatButton} from 'material-ui';
import Survey from './Survey'
import moment from 'moment';
import yup from 'yup'
import GCForm from './forms/GCForm';
import Form from 'react-formal';

export class CallAssignment extends React.Component {
  styles = {
    assignmentBar: {
      backgroundColor: BernieColors.lightGray,
      marginTop: 15,
      marginBottom: 15,
      marginRight: 15,
      marginLeft: 15,
      paddingTop: 15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
      color: BernieColors.darkGray,
      fontSize: '1em',
      width: 'auto'
    },
    callAssignmentQuestions: {
      fontSize: '1.2em',
      marginBottom: 15,
      textAlign: 'center'
    },
    surveyFrame: {
      borderTop: 'solid 1px ' + BernieColors.lightGray,
    },
    questions: {
      paddingTop: 15,
    },
    submitButton: {
      textAlign: 'center',
      width: '50%',
      marginRight: 'auto',
      marginLeft: 'auto'
    }
  }

  state = {
    completed: true,
    reasonNotCompleted: 'NO_PICKUP',
    leftVoicemail: null
  }

  notCompletedReasons =
  {
    'NO_PICKUP' : 'Did not pick up',
    'CALL_BACK' : 'Busy/call back later',
    'NOT_INTERESTED' : 'Not interested in talking',
    'OTHER_LANGUAGE' : 'Spoke different language',
    'WRONG_NUMBER' : 'Wrong number',
    'DISCONNECTED_NUMBER' : 'Disconnected number'
  }

  formSchema = yup.object({
    completed: yup.boolean().required(),
    reasonNotCompleted: yup.string().oneOf(Object.keys(this.notCompletedReasons)).nullable(),
    leftVoicemail: yup.boolean().nullable()
  }).test('not-completed-reasons-required',
  'If you did not complete the call, please fill out why and if you left a voicemail',
    (value) => {
      if (value.completed)
        return true
      else
        return value.reasonNotCompleted !== null && value.leftVoicemail !== null
  })

  renderCalleeInfo() {
//    let callee = this.props.callAssignment.targetForUser
    let callee = {
      firstName: 'Saikat',
      lastName: 'Chakrabarti'
    }
    let name = callee.firstName + ' ' + callee.lastName
    return (
      <div>
        <div style={BernieText.secondaryTitle}>
          {name} - 817-999-4303<br />
        </div>
        <div style={BernieText.default}>
          Email: filler@filler.com<br />
          Location: New York, NY 10014<br />
          Local Time: 4:00 PM<br />
        </div>
      </div>
    )
  }

  render() {
    let submitHandler = (formValue) => {
      if (this.state.completed)
        this.refs.survey.refs.component.submit()
    }

    let survey = (
      <div style={{
        ...this.styles.surveyFrame,
        display: this.state.completed ? 'block' : 'none'
      }}>
        <Survey ref='survey' survey={this.props.callAssignment.survey} initialValues={{'email' : 'saikat@gomockingbird.com'}} />
      </div>
    )

    let notCompletedQuestions = <div></div>
    if (!this.state.completed)
      notCompletedQuestions = (
        <div>
          <br />
          <Form.Field
            name='reasonNotCompleted'
            type='select'
            choices={this.notCompletedReasons}
            label='Why not?'
            />
          <br />
          <Form.Field
            name='leftVoicemail'
            label='Did you leave a voicemail?'
          />
        </div>
      )
    submitHandler = submitHandler.bind(this)
    return (
      <div style={this.styles.container}>
        <Paper
          style={this.styles.assignmentBar}
        >
          <span>{this.renderCalleeInfo()}</span>
        </Paper>
        <div style={this.styles.questions}>
          <GCForm
            schema={this.formSchema}
            onSubmit={submitHandler}
            value={this.state}
            onChange={(formValue) => {
              this.setState(formValue)
            }}
            onError={(errors) => {
              // Implement
            }}
          >
            <div style={this.styles.callAssignmentQuestions}>
              <Form.Field
                name='completed'
                label='Were you able to complete the call?'
              />
              {notCompletedQuestions}
            </div>
            {survey}
            <div style={this.styles.submitButton}>
              <Form.Button type='submit' label='Submit and on to the next volunteer!' fullWidth={true} style={this.styles.submitButton}/>
            </div>
          </GCForm>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(CallAssignment, {
  fragments: {
    callAssignment: () => Relay.QL`
      fragment on CallAssignment {
        id
        name
        survey {
          ${Survey.getFragment('survey')}
        }
      }
    `
  }
});