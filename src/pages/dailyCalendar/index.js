import React, {
  Component,
} from 'react';
import * as moment from 'moment';
import {
  startOfWeek, addDays, isToday, format, getDayOfYear,
} from 'date-fns';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewEventPopup from '../monthlyCalendar/NewEventPopup';
import NewEventPopupAmo from '../monthlyCalendar/NewEventPopupAmo';
import InvitationPopup from '../monthlyCalendar/invitationPopup';
import OperationsPopup from '../monthlyCalendar/OperationsPopup';
import CreateOperationPopup from '../monthlyCalendar/CreateOperationPopup';
import EditOperationPopup from '../monthlyCalendar/EditOperationPopup';
import CalendarGridColumn from './CalendarGridColumn';
import HoursDisplay from './hoursDisplay';
import HoursLines from './HoursLines';

import ActionButton from '../../components/ActionButton';
import SidebarMonth from '../../components/sideBarMonth';
import './styles.scss';
import { fetchEvents, fetchAmoEvents } from '../../redux/actions/eventActions';
import { fetchOperations } from '../../redux/actions/operationActions';
import { logout } from '../../redux/actions/meActions';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { isMobile } from 'react-device-detect';

import {
  useParams,
} from 'react-router-dom';

InvitationPopup;

class DailyCalendar extends Component {
  constructor(props) {
    super(props);

    this.datePickerRef = React.createRef();

    this.state = {
      day: null,
      year: _.parseInt(props.match.params.year) || moment().year(),
      dayCount: _.parseInt(props.match.params.day) || moment().dayOfYear(),
      sidebarOpen: false,
      collabsToDisplay: [],
      operationsToDisplay: [],
      isPopupDisplayed: false,
      popupContent: null,
      fetchDate: '',
    };
  }

  componentDidMount() {
    const {
      sessionToken, fetchEvents, history, userInfos, fetchOperations,
    } = this.props;
    const { day, year } = this.props.match.params;

    moment.locale('fr');

    if (_.isNil(sessionToken)) {
      history.push('/login');
    }

    if (isMobile) {
      history.push('/mcalendar');
    }

    fetchOperations(sessionToken);

    if (_.isNil(day) || _.isNil(year)) {
      this.setState({ day: new Date() }, () => {
        const month = moment(this.state.day).month() + 1;
        const year = moment(this.state.day).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({ fetchDate: `${year}_${monthFormatted}` }, () => {
          fetchEvents(this.state.fetchDate, sessionToken, _.get(userInfos, 'corpId'));
        });
      });
    } else {
      const dayPage = moment().dayOfYear(day);
      this.setState({ day: dayPage }, () => {
        const month = moment(this.state.day).month() + 1;
        const year = moment(this.state.day).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({ fetchDate: `${year}_${monthFormatted}` }, () => {
          fetchEvents(this.state.fetchDate, sessionToken, _.get(userInfos, 'corpId'));
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { sessionToken, fetchEvents, userInfos } = this.props;

    if (prevState.fetchDate !== this.state.fetchDate) {
      this.fetchEventsData();
    }
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  setPopupState = (state) => {
    this.setState({ isPopupDisplayed: state });
  };

  setPopupContent = (content) => {
    this.setState({ popupContent: content });
  };

  openNewEventPopup = () => {
    const { userInfos } = this.props;

    const isAdmin = userInfos.status === "admin";
    if (!isAdmin) {
      return;
    }

    const newEventPopup = <NewEventPopup closePopup={() => { this.setPopupState(false); }} fetchEventsData={this.fetchEventsData} />;
    this.setState({
      popupContent: newEventPopup,
      isPopupDisplayed: true,
    });
  };

  openNewEventPopupDay = defaultDate => () => {
    const { userInfos } = this.props;

    const isAdmin = userInfos.status === "admin";
    if (!isAdmin) {
      return;
    }
    const newEventPopup = <NewEventPopupAmo closePopup={() => { this.setPopupState(false); }} fetchEventsData={this.fetchEventsData} date={defaultDate} />;
    this.setState({
      popupContent: newEventPopup,
      isPopupDisplayed: true,
    });
  };

  openAMOPopup = (defaultDate, selectedUsers, selectedOperation) => {
    const { userInfos } = this.props;

    const isAdmin = userInfos.status === "admin";
    if (!isAdmin) {
      return;
    }

    const newEventPopup = (
      <NewEventPopupAmo
        closePopup={() => { this.setPopupState(false); }}
        fetchEventsData={this.fetchEventsData}
        date={defaultDate}
        selectedUsers={selectedUsers}
        selectedOperation={selectedOperation}
      />);
    this.setState({
      popupContent: newEventPopup,
      isPopupDisplayed: true,
    });
  }

  openInvitationPopup = () => {
    const invitationPopup = <InvitationPopup closePopup={() => { this.setPopupState(false); }} />;
    this.setState({
      popupContent: invitationPopup,
      isPopupDisplayed: true,
    });
  };

  openOperationsPopup = () => {
    const operationPopup = <OperationsPopup closePopup={() => { this.setPopupState(false); }} towardsCreateOperationPopup={this.openCreateOperationPopup} towardsEditOperationPopup={this.openEditOperationPopup} />;
    this.setState({
      popupContent: operationPopup,
      isPopupDisplayed: true,
    });
  };

  openCreateOperationPopup = () => {
    const createOperationPopup = <CreateOperationPopup closePopup={() => { this.setPopupState(false); }} towardsOperationPopup={this.openOperationsPopup} />;
    this.setState({
      popupContent: createOperationPopup,
      isPopupDisplayed: true,
    });
  };

  openEditOperationPopup = (id, name, data, location) => () => {
    const EditOperationPopupContent = <EditOperationPopup closePopup={() => { this.setPopupState(false); }} towardsOperationPopup={this.openOperationsPopup} id={id} name={name} data={data} location={location} />;
    this.setState({
      popupContent: EditOperationPopupContent,
      isPopupDisplayed: true,
    });
  };

  fetchEventsData = () => {
    const { sessionToken, fetchEvents, userInfos, fetchAmoEvents } = this.props;

    const isAdmin = userInfos.status === "admin";
    if (isAdmin) {
      fetchEvents(this.state.fetchDate, sessionToken, _.get(userInfos, 'corpId')).then(() => {
        this.setState({
          collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id'),
          operationsToDisplay: this.getOperations(this.props.events)
        });
      });
    } else {
      fetchAmoEvents(sessionToken, this.state.fetchDate, _.get(userInfos, 'id'), _.get(userInfos, 'corpId')).then(() => {
        this.setState({
          collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id'),
          operationsToDisplay: this.getOperations(this.props.events)
        });
      });
    }
  };

  navigateToNextWeek = () => {
    const { day } = this.state;
    const newDay = moment(day).add(1, 'd');
    const newDayCount = moment(newDay).dayOfYear();
    const newYear = moment(newDay).year();
    const newMonth = moment(newDay).month() + 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarday/${newDayCount}/${newYear}`);

    this.setState({
      fetchDate: `${newYear}_${newMonthFormatted}`,
      day: newDay,
      year: newYear,
      dayCount: newDayCount,
    });
  };

  navigateToPreviousWeek = () => {
    const { day } = this.state;
    const newDay = moment(day).add(-1, 'd');
    const newDayCount = moment(newDay).dayOfYear();
    const newYear = moment(newDay).year();
    const newMonth = moment(newDay).month() + 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarday/${newDayCount}/${newYear}`);

    this.setState({
      fetchDate: `${newYear}_${newMonthFormatted}`,
      day: newDay,
      year: newYear,
      dayCount: newDayCount,
    });
  };

  navigateToDate = (date) => {
    const newDayCount = moment(date).dayOfYear();
    const newYear = moment(date).year();
    const newMonth = moment(date).month() + 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarday/${newDayCount}/${newYear}`);

    this.setState({
      fetchDate: `${newYear}_${newMonthFormatted}`,
      day: date,
      year: newYear,
      dayCount: newDayCount,
    });
  };

  getRecipients = (events) => {
    let recipients = [];

    _.each(events, (event) => {
      recipients = _.uniqBy(_.concat(recipients, _.get(event, 'invitations', [])), 'id');
    });

    return recipients;
  };

  getOperations = (events) => {
    let operations = [];

    _.each(events, (event) => {
      operations = _.uniq(_.concat(operations, _.get(event, 'operation_id', [])));
    });

    return operations;
  };

  toggleRecipient = (id, isChecked) => {
    if (isChecked) {
      this.setState((prevState) => ({ collabsToDisplay: _.uniq(_.concat(prevState.collabsToDisplay, id)) }));
    } else {
      this.setState((prevState) => ({ collabsToDisplay: _.difference(prevState.collabsToDisplay, [id]) }));
    }
  };

  toggleOperation = (id, isChecked) => {
    if (isChecked) {
      this.setState((prevState) => ({ operationsToDisplay: _.uniq(_.concat(prevState.operationsToDisplay, id)) }));
    } else {
      this.setState((prevState) => ({ operationsToDisplay: _.difference(prevState.operationsToDisplay, [id]) }));
    }
  };

  logout = () => {
    const { logout, history } = this.props;

    logout();
    history.push('/login');
  };

  openDatePicker = () => {
    this.datePickerRef.current.setOpen(true);
  };

  getDaysInMonth = (month, year) => {
    let date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  towardsOffDaysBoard = () => {
    const {
      history,
      userInfos
    } = this.props;

    if (userInfos.status === "admin") {
      history.push('/calendaroffdaysboard');
    } else {
      history.push('/calendaroffdays');
    }
  }

  towardsMonthlyCalendar = () => {
    const { history } = this.props;

    history.push('/calendarmonth');
  }

  render() {
    const { isPopupDisplayed, popupContent, day, fetchDate, operationsToDisplay } = this.state;
    const { userInfos, operations } = this.props;

    const filteredEvents = _.filter(this.props.events, (event) => moment(event.date).dayOfYear() === moment(day).dayOfYear() && (event.type !== 'amo' || !_.isEmpty(_.intersection(this.state.collabsToDisplay, _.map(event.invitations, 'id')))));

    const operationsFilteredEvents = _.filter(filteredEvents, event => _.includes(operationsToDisplay, event.operation_id));

    const operationIdsToDisplay = this.getOperations(this.props.events);
    // const groupedEvents = _.groupBy(this.props.events, event => getDayOfYear(moment(event.date)._d));

    const isAdmin = userInfos.status === "admin";

    const popupHaloClass = classNames({
      'popup-halo': true,
      'popup-halo--toggled': isPopupDisplayed,
    });

    return (
      !_.isEmpty(fetchDate)
      && (
        <div className="calendar-container">
          <SidebarMonth
            recipients={this.getRecipients(this.props.events)}
            operations={_.filter(operations, operation => _.includes(operationIdsToDisplay, operation.id))}
            toggleRecipient={this.toggleRecipient}
            toggleOperation={this.toggleOperation}
            openInvitationPopup={this.openInvitationPopup}
            openOperationsPopup={this.openOperationsPopup}
            logout={this.logout}
            userName={_.get(userInfos, 'name')}
            towardsOffDaysBoard={this.towardsOffDaysBoard}
          />
          <div className="week-navigation-container-month">
            <div className="week-navigation-holder-month">
              <div className="calendar-navigation-container" onClick={this.navigateToPreviousWeek}>
                <svg viewBox="0 0 512 512" width="20" height="20">
                  <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                      C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                      c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                      l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"
                  />
                </svg>
              </div>
              <div className="top">
                <div onClick={this.openDatePicker}>{`${moment(day).format('D MMM')}`}</div>
                <div className="bottom" onClick={this.openDatePicker}>
                  {`${moment(day).format('YYYY')}`}
                </div>
              </div>
              <div className="calendar-navigation-container" onClick={this.navigateToNextWeek}>
                <svg viewBox="0 0 512 512" width="20" height="20">
                  <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                      c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                      c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                      c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"
                  />
                </svg>
              </div>
              <DatePicker
                ref={this.datePickerRef}
                selected={day._d}
                onChange={this.navigateToDate}
              />
            </div>
          </div>
          {isAdmin && (
            <div className="add-action-btn-container">
              <ActionButton clickAction={this.openNewEventPopup} label="Nouveau RDV" />
            </div>)}
          <div className="switch-action-btn-container">
            <ActionButton clickAction={this.towardsMonthlyCalendar} label="Planning mensuel" />
          </div>
          <div className="calendar-center-container months-container">
            <HoursDisplay />
            <HoursLines />
            <CalendarGridColumn
              day={day}
              index={0}
              events={operationsFilteredEvents}
              fetchEventsData={this.fetchEventsData}
              operations={operations}
            />
          </div>
          {isPopupDisplayed && (
            <div>
              <div className={popupHaloClass} onClick={() => { this.setPopupState(false); }} />
              <div className="popup-container">
                {popupContent}
              </div>
            </div>
          )}
        </div>
      )
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  loading: state.events.loading,
  events: state.events.events,
  hasErrors: state.events.hasErrors,
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  operations: state.operations.operations,
  isOperationsLoading: state.operations.loading,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOperations,
  fetchEvents,
  fetchAmoEvents,
  logout,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(DailyCalendar);
