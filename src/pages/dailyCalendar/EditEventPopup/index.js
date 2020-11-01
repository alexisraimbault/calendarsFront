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
import { postUpdateEvent, postDeleteEvent } from '../../../redux/actions/eventActions';
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

  componentDidMount() {
    const { fetchUsers, sessionToken, userInfos } = this.props;

    fetchUsers(_.get(userInfos, 'corpId'), sessionToken);
  }

    handleChangeDate = (date) => {
      this.setState({
        eventDate: date,
      });
    };

    setSelectedUsersIds = (array) => this.setState({ selectedUsersIds: array });

    setSelectedOperationsIds = (array) => this.setState({ selectedOperationsIds: array });

    onChangeStartTime = (time) => this.setState({ start_time: time });

    onChangeEndTime = (time) => this.setState({ end_time: time });

    updateTitle = (e) => this.setState({ title: e.target.value });

    updateMail = (e) => this.setState({ mail: e.target.value });

    updateDescription = (e) => this.setState({ description: e.target.value });

    sendCreateEventRequest = () => {
      const {
        title,
        description,
        eventDate,
        start_time,
        end_time,
        selectedOperationsIds,
        mail
      } = this.state;
      const {
        postUpdateEvent, fetchEventsData, closePopup, sessionToken, userInfos, eventData
      } = this.props;

      const formattedDate = `${moment(eventDate).year()}-${moment(eventDate).month() + 1}-${moment(eventDate).date()}`;

// postUpdateEvent(event_id, name, description, time_from, time_to, date, sessionToken)
      postUpdateEvent(eventData.id, title, description, start_time, end_time, formattedDate, sessionToken).then(() => {//TODO unmock
        fetchEventsData();
        closePopup();
      });
    };

    deleteEvent = () => {
      const {
        postDeleteEvent, sessionToken, eventData, closePopup,
      } = this.props;

      postDeleteEvent(eventData.id, sessionToken).then(() => {
        fetchEventsData();
        closePopup();
      })
    }

    render() {
      const { title, description, mail, selectedOperationId } = this.state;
      const { isLoading, operations } = this.props;

      return (
        <div className="update-event-popup-container">
          <div className="top-popup-container">
            <div className="title">Update event</div>
            <div className="edit-box">
              <div className="left">
                <EditableLabel value={title} onChange={this.updateTitle} placeholder="Title here" isDescription={false} />
                <EditableLabel value={description} onChange={this.updateDescription} placeholder="Description here" isDescription />
                <div className="mail">{mail}</div>
              </div>
              <div className="right">
                <div className="date-picker">
                  <DatePicker
                    selected={this.state.eventDate}
                    onChange={this.handleChangeDate}
                  />
                </div>
                <div className="time-pickers-container">
                  <div className="time-picker">
                    <div className="time-label">{'from : '}</div>
                    <TimePicker
                      onChange={this.onChangeStartTime}
                      value={this.state.start_time}
                    />
                  </div>
                  <div className="time-picker">
                    <div className="time-label">{'to : '}</div>
                    <TimePicker
                      onChange={this.onChangeEndTime}
                      value={this.state.end_time}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="operation-edit-event">{_.find(operations, {id: selectedOperationId}).name}</div>
          </div>
          <div className="save-btns">
            <div className="save-btn">
              <ActionButton clickAction={this.deleteEvent} label="Supprimer" isLoading={isLoading} isDanger/>
            </div>
            <div className="save-btn">
              <ActionButton clickAction={this.sendCreateEventRequest} label="Sauvegarder" isLoading={isLoading} />
            </div>
          </div>
        </div>
      );
    }
}


// Map Redux state to React component props
const mapStateToProps = (state) => ({
  loading: state.users.loading,
  users: state.users.users,
  hasErrors: state.users.hasErrors,
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  isLoading: state.events.loading,
  operations: state.operations.operations,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  postUpdateEvent,
  fetchUsers,
  postDeleteEvent,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(NewEventPopup);
