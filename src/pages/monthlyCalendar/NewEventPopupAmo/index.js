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
import SingleSelection from '../../../components/SingleSelection';

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
      //TODO link
      hoursKeys: props.hoursKeyObject || {}
    };
  }

  componentDidMount() {
    const { fetchUsers, sessionToken, userInfos, requestGetCompanyOffDays } = this.props;

    fetchUsers(_.get(userInfos, 'corpId'), sessionToken);
    requestGetCompanyOffDays(sessionToken);
  }

  applyUserHoursKey = (id, key) => {
    const { hoursKeys } = this.state;
    const tmpHoursKeys = _.cloneDeep(hoursKeys);
    tmpHoursKeys[id] = key;
    this.setState({hoursKeys: tmpHoursKeys});
  }

  getOffAmos = () => {
    const { eventDate } = this.state;
    const { users, offDays } = this.props;

    const todayOff = _.filter(offDays, offDay => moment(eventDate).year() === moment(offDay.day).year() && moment(eventDate).dayOfYear() === moment(offDay.day).dayOfYear());
    
    if(_.isEmpty(todayOff)) {
      return {
        label: '',
        ids: [],
      };
    }

    const offAmos = _.map(todayOff, off => _.find(users, {id: off.user_id}));
    let res = "AMO(s) off ce jour : "
    _.each(offAmos,  offAmo => {
      res += `${offAmo.name}, `
    });
    return {
      label: res,
      ids: _.map(todayOff, off => off.user_id),
    };
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
        selectedOperationsIds,
        hoursKeys,
      } = this.state;
      const {
        createEvent, fetchEventsData, closePopup, sessionToken, userInfos,
      } = this.props;

      const formattedDate = `${moment(eventDate).year()}-${moment(eventDate).month() + 1}-${moment(eventDate).date()}`;

      const selectedUserIds = _.isEmpty(selectedUsersIds) ? '-' : _.join(selectedUsersIds, ',');

      const tmpHoursKeys = _.isEmpty(selectedUsersIds) ? '-' : _.join(_.map(selectedUsersIds, id => _.get(hoursKeys, `${id}`, 'all-day/nca')), ',');

      createEvent(title, description, formattedDate, start_time, end_time, selectedUserIds, sessionToken, _.get(userInfos, 'corpId'), 'amo', selectedOperationsIds[0], tmpHoursKeys, '-').then(() => {//TODO unmock
        fetchEventsData();
        closePopup();
      });
    };

    render() {
      const { title, description, selectedUsersIds, hoursKeys } = this.state;
      const { isLoading, users } = this.props;

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
            {!_.isEmpty(offAmos.label) && <div className="off-amos-display">{offAmos.label}</div>}
            <UserSelector setSelectedUsersIds={this.setSelectedUsersIds} defaultSelected={this.props.selectedUsers} offIds={offAmos.ids}/>
            <OperationSelector setSelectedUsersIds={this.setSelectedOperationsIds} defaultSelected={this.props.selectedOperation}/>
          </div>
          <div className="day-time-selection">
          {!_.isEmpty(users) && _.map(selectedUsersIds, (selectedUserId, index) => {
            const user = _.find(users, {id: selectedUserId});
            
            return (
              <SingleSelection
                defaultToggledKey={_.get(hoursKeys, `${selectedUserId}` , 'all-day/nca')}
                keyValues={[
                  {
                    key: 'am',
                    value: 'AM'
                  },
                  {
                    key: 'pm',
                    value: 'PM'
                  },
                  {
                    key: 'all-day',
                    value: 'journée'
                  },
                ]}
                showLabels={index === 0}
                id={user.id}
                name={user.name}
                applyKey={this.applyUserHoursKey}
              />
              );
            })}
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
