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
import { createEvent } from '../../../redux/actions/eventActions';
import { fetchUsers } from '../../../redux/actions/userActions';


import 'react-datepicker/dist/react-datepicker.css';


class NewEventPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Title',
      description: 'Description',
      eventDate: new Date(),
      start_time: '10:00',
      end_time: '12:00',
      mail: '',
      selectedUsersIds: [],
      selectedOperationsIds: [],
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
        createEvent, fetchEventsData, closePopup, sessionToken, userInfos,
      } = this.props;

      const formattedDate = `${moment(eventDate).year()}-${moment(eventDate).month() + 1}-${moment(eventDate).date()}`;

      createEvent(title, description, formattedDate, start_time, end_time, '-', sessionToken, _.get(userInfos, 'corpId'), 'rdv', selectedOperationsIds[0], '-', mail).then(() => {//TODO unmock
        fetchEventsData();
        closePopup();
      });
    };

    render() {
      const { title, description, mail } = this.state;
      const { isLoading } = this.props;

      return (
        <div className="new-event-popup-container">
          <div className="top-popup-container">
            <div className="title">New event</div>
            <div className="edit-box">
              <div className="left">
                <EditableLabel value={title} onChange={this.updateTitle} placeholder="Title here" isDescription={false} />
                <EditableLabel value={description} onChange={this.updateDescription} placeholder="Description here" isDescription />
                <EditableLabel value={mail} onChange={this.updateMail} placeholder="Email here" isDescription={false} />
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
            <OperationSelector setSelectedUsersIds={this.setSelectedOperationsIds} />
          </div>
          <div className="save-btn">
            <ActionButton clickAction={this.sendCreateEventRequest} label="Save" isLoading={isLoading} />
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
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createEvent,
  fetchUsers,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(NewEventPopup);
