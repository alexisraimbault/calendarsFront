import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import EditableLabel from '../../../components/EditableLabel';
import UserSelector from '../../../components/UserSelector';
import OperationSelector from '../../../components/OperationSelector';

import ActionButton from '../../../components/ActionButton';
import { postUpdateEvent } from '../../../redux/actions/eventActions';
import { fetchUsers } from '../../../redux/actions/userActions';


import 'react-datepicker/dist/react-datepicker.css';

class NewEventPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: _.get(props.eventData, 'name', 'Title'),
      description:  _.get(props.eventData, 'description', 'Description'),
      eventDate: moment(props.eventData.date).toDate(),
      start_time: _.get(props.eventData, 'time_from', '10:00'),
      end_time: _.get(props.eventData, 'time_to', '12:00'),
      mail:  _.get(props.eventData, 'mail', ''),
      selectedUsersIds: [],
      selectedOperationId:  _.get(props.eventData, 'operation_id', ''),
    };
  }

    render() {
      const { title, description, mail, selectedOperationId } = this.state;
      const { isLoading, operations } = this.props;

      return (
        <div className="display-event-popup-container">
          <div className="top-popup-container">
            <div className="title">Event details</div>
            <div className="edit-box">
              <div className="left">
                <div className="mail">{title}</div>
                <div className="mail">{description}</div>
                <div className="mail">{mail}</div>
              </div>
              <div className="right">
                <div className="time-pickers-container">
                <div className="time-picker">
                  <div className="time-label">{'date :'}</div>
                  {moment(this.state.eventDate).format('DD/MM/YYYY')}
                </div>
                  <div className="time-picker">
                    <div className="time-label">{'from : '}</div>
                    <div className="time-label">{this.state.start_time}</div>
                  </div>
                  <div className="time-picker">
                    <div className="time-label">{'to : '}</div>
                    <div className="time-label">{this.state.end_time}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
}


// Map Redux state to React component props
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(NewEventPopup);
