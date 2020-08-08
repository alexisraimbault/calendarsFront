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
import { requestGetCompanyOffDays } from '../../../redux/actions/meActions';


import 'react-datepicker/dist/react-datepicker.css';


class NewEventPopupAmo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Title',
      description: 'Description',
      eventDate: props.date || new Date(),
      start_time: '10:00',
      end_time: '12:00',
      selectedUsersIds: props.selectedUsers || [],
      selectedOperationsIds: props.selectedOperation || [],
    };
  }

  componentDidMount() {
    const { fetchUsers, sessionToken, userInfos, requestGetCompanyOffDays } = this.props;

    fetchUsers(_.get(userInfos, 'corpId'), sessionToken);
    requestGetCompanyOffDays(sessionToken);
  }

  getOffAmos = () => {
    const { eventDate } = this.state;
    const { users, offDays } = this.props;

    const todayOff = _.filter(offDays, offDay => moment(eventDate).year() === moment(offDay.day).year() && moment(eventDate).dayOfYear() === moment(offDay.day).dayOfYear());
    
    if(_.isEmpty(todayOff)) {
      return '';
    }

    const offAmos = _.map(todayOff, off => _.find(users, {id: off.user_id}));
    let res = "AMO(s) off ce jour : "
    _.each(offAmos,  offAmo => {
      res += `${offAmo.name}, `
    });
    return res;
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

    updateDescription = (e) => this.setState({ description: e.target.value });

    sendCreateEventRequest = () => {
      const {
        title,
        description,
        eventDate,
        start_time,
        end_time,
        selectedUsersIds,
        selectedOperationsIds
      } = this.state;
      const {
        createEvent, fetchEventsData, closePopup, sessionToken, userInfos,
      } = this.props;

      const formattedDate = `${moment(eventDate).year()}-${moment(eventDate).month() + 1}-${moment(eventDate).date()}`;

      const selectedUserIds = _.join(selectedUsersIds, ',');

      createEvent(title, description, formattedDate, start_time, end_time, selectedUserIds, sessionToken, _.get(userInfos, 'corpId'), 'amo', selectedOperationsIds[0]).then(() => {//TODO unmock
        fetchEventsData();
        closePopup();
      });
    };

    render() {
      const { title, description } = this.state;
      const { isLoading } = this.props;

      const offAmos = this.getOffAmos();

      return (
        <div className="new-event-popup-container">
          <div className="top-popup-container">
            <div className="title">{"Ajouter AMO(s)"}</div>
            <div className="edit-box">
              <div className="right">
                <div className="date-picker">
                  <DatePicker
                    selected={this.state.eventDate}
                    onChange={this.handleChangeDate}
                  />
                </div>
              </div>
            </div>
            {!_.isEmpty(offAmos) && <div className="off-amos-display">{offAmos}</div>}
            <UserSelector setSelectedUsersIds={this.setSelectedUsersIds} defaultSelected={this.props.selectedUsers}/>
            <OperationSelector setSelectedUsersIds={this.setSelectedOperationsIds} defaultSelected={this.props.selectedOperation}/>
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
  offDays: state.me.allOffDays,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createEvent,
  fetchUsers,
  requestGetCompanyOffDays,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(NewEventPopupAmo);
