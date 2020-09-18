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
import NewEventPopup from './NewEventPopup';
import NewEventPopupAmo from './NewEventPopupAmo';
import InvitationPopup from './invitationPopup';
import OperationsPopup from './OperationsPopup';
import CreateOperationPopup from './CreateOperationPopup';RdvSettingsPopup
import EditOperationPopup from './EditOperationPopup'
import RdvSettingsPopup from './RdvSettingsPopup'
import DayCalendarDisplay from './DayCalendarDisplay';
import OperationTotalsDisplay from './OperationTotalsDisplay'

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

import img from '../../images/orchestra_logo_blanc.png';

class MonthlyCalendar extends Component {
  constructor(props) {
    super(props);

    this.datePickerRef = React.createRef();

    this.state = {
      year: _.parseInt(props.match.params.year) || moment().year(),
      month: _.parseInt(props.match.params.month) || moment().month() + 1,
      sidebarOpen: false,
      collabsToDisplay: [],
      operationsToDisplay: [],
      isPopupDisplayed: false,
      popupContent: null,
      fetchDate: '',
    };
  }

  componentDidMount() {
    const { month, year } = this.state;
    const {
      sessionToken, fetchEvents, history, userInfos, fetchOperations,
    } = this.props;

    moment.locale('fr');

    if (_.isNil(sessionToken)) {
      history.push('/login');
    }

    if (isMobile) {
      history.push('/mcalendar');
    }

    fetchOperations(sessionToken);

    const monthFormatted = month < 10 ? `0${month}` : month;
    this.setState({ fetchDate: `${year}_${monthFormatted}` }, () => {
      this.fetchEventsData();
    });
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



  goToDaily = defaultDate => () => {
    const { userInfos, history } = this.props;
    
    //Go to daily calendar for that day
    history.push(`/calendarday/${moment(defaultDate).dayOfYear()}/${moment(defaultDate).year()}`);
  };

  openNewEventPopupDay = defaultDate => event => {
    const { userInfos, history } = this.props;
    event.stopPropagation();

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

  openAMOPopup = (defaultDate, selectedUsers, selectedOperation, hoursKeyObject) => {
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
        hoursKeyObject={hoursKeyObject}

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

  openRdvSettingsPopup = () => {
    const RdvSettingsPopupContent = <RdvSettingsPopup closePopup={() => { this.setPopupState(false); }} towardsRdvSettingsPage={this.towardsRdvSettingsPage} />;
    this.setState({
      popupContent: RdvSettingsPopupContent,
      isPopupDisplayed: true,
    });
  }

  towardsRdvSettingsPage = operationId => {
    this.props.history.push(`/rdvconfig/${operationId}`);
  }

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

  navigateToNextMonth = () => {
    const { month, year } = this.state;
    const isDecember = month === 12;
    const newYear = isDecember ? year + 1 : year;
    const newMonth = isDecember ? 1 : month + 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarmonth/${newMonth}/${newYear}`);

    this.setState({
      fetchDate: `${newYear}_${newMonthFormatted}`,
      year: newYear,
      month: newMonth,
    });
  };

  navigateToPreviousMonth = () => {
    const { month, year } = this.state;
    const isJanuary = month === 1;
    const newYear = isJanuary ? year - 1 : year;
    const newMonth = isJanuary ? 12 : month - 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarmonth/${newMonth}/${newYear}`);

    this.setState({
      fetchDate: `${newYear}_${newMonthFormatted}`,
      year: newYear,
      month: newMonth,
    });
  };

  navigateToDate = (date) => {
    const newMonth = moment(date).month() + 1;
    const newYear = moment(date).year();
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarmonth/${newMonth}/${newYear}`);

    this.setState({
      fetchDate: `${newYear}_${newMonthFormatted}`,
      year: newYear,
      month: newMonth,
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

  calculateRecession = operationId => {
    const { events } = this.props;
    const { month, year } = this.state;
    let calculatedTotal = 0;
    let caEvents = 0;

    const filteredEvents = _.filter(this.props.events, (event) => moment(event.date).month() + 1 === month && moment(event.date).year() === year && event.type === 'amo' && event.operation_id === operationId);
    _.each(filteredEvents, event => {
      _.each(event.invitations, invitation => {
        const isCa = _.get(_.split(_.get(invitation, 'hours', 'all-day/nca'), '/'), '[1]', 'nca') === 'ca';
        const isFullDay = _.get(_.split(_.get(invitation, 'hours', 'all-day/nca'), '/'), '[0]', 'all-day') === 'all-day';

        if(isCa) {
          caEvents ++;
        } else {
          calculatedTotal += isFullDay ? 400 : 200;
        }
      })
    })
    return {calculatedTotal, caEvents};
  }

  renderDoubleTotals = () => {
    const { operations, sessionToken, isOperationsLoading } = this.props;
    const { fetchDate } = this.state;

    return (
      <div className="totals-container">
        {_.map(_.orderBy(operations, 'id'), operation => {
          const totals = JSON.parse(_.get(operation, "totals", "fetchDate: {total1: 0, total2: 0,}"));

          const monthTotal = _.get(totals, `${fetchDate}`, {
            total1: 0,
            total2: 0,
          });

          const recessionCounts = this.calculateRecession(operation.id);

          return (
            <div>
              <OperationTotalsDisplay
                name={operation.name}
                id={operation.id}
                total1={_.get(monthTotal, 'total1', 0)}
                total2={_.get(monthTotal, 'total2', 0)}
                fetchDate={fetchDate}
                sessionToken={sessionToken}
                recessionValue={recessionCounts.calculatedTotal}
                nbCa={recessionCounts.caEvents}
                isLoading={isOperationsLoading}
              />
            </div>
          );
        })}
      </div>
    );
  }

  towardsDailyCalendar = () => {
    const { history } = this.props;

    history.push('/calendarday');
  }

  render() {
    const { isPopupDisplayed, popupContent, month, year, fetchDate, operationsToDisplay } = this.state;
    const { userInfos, operations } = this.props;

    const filteredEvents = _.filter(this.props.events, (event) => event.type !== 'amo' || !_.isEmpty(_.intersection(this.state.collabsToDisplay, _.map(event.invitations, 'id'))));

    const operationsFilteredEvents = _.filter(filteredEvents, event => _.includes(operationsToDisplay, event.operation_id));

    const groupedEvents = _.groupBy(operationsFilteredEvents, (event) => getDayOfYear(moment(event.date)._d));

    const operationIdsToDisplay = this.getOperations(this.props.events);
    // const groupedEvents = _.groupBy(this.props.events, event => getDayOfYear(moment(event.date)._d));

    const daysOfMonth = this.getDaysInMonth(month - 1, year);

    const daysOfMonthGrouped = [];

    _.each(daysOfMonth, (item, index) => {
      if (index % 7 === 0) {
        daysOfMonthGrouped.push([item]);
      } else {
        daysOfMonthGrouped[Math.trunc(index / 7)].push(item)
      }
    });

    const isAdmin = userInfos.status === "admin";

    const popupHaloClass = classNames({
      'popup-halo': true,
      'popup-halo--toggled': isPopupDisplayed,
    });

    return (
      !_.isEmpty(fetchDate)
      && (
        <div className="calendar-container">
          <img src={img} className="orchestra-logo-monthly" />
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
            openRdvSettingsPopup={this.openRdvSettingsPopup}
            isAdmin={isAdmin}
          />
          <div className="week-navigation-container-month">
            <div className="week-navigation-holder-month">
              <div className="calendar-navigation-container" onClick={this.navigateToPreviousMonth}>
                <svg viewBox="0 0 512 512" width="20" height="20">
                  <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                      C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                      c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                      l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"
                  />
                </svg>
              </div>
              <div className="top">
                <div onClick={this.openDatePicker}>{`${_.capitalize(moment(new Date(year, month - 1, 1)).format('MMM'))}`}</div>
                <div className="bottom" onClick={this.openDatePicker}>
                  {`${moment(new Date(year, month - 1, 1)).format('YYYY')}`}
                </div>
              </div>
              <div className="calendar-navigation-container" onClick={this.navigateToNextMonth}>
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
                selected={new Date(year, month - 1, 1)}
                onChange={this.navigateToDate}
              />
            </div>
          </div>
          {isAdmin && (
            <div className="add-action-btn-container">
              <ActionButton clickAction={this.openNewEventPopup} label="Nouveau RDV" />
            </div>)}
          <div className="switch-action-btn-container">
            <ActionButton clickAction={this.towardsDailyCalendar} label="Planning quotidien" />
          </div>
          <div className="calendar-center-container months-groups-container">
            {_.map(daysOfMonthGrouped, (daysOfMonthGroup, index1) => (
              <div className="week-of-month">
                {_.map(daysOfMonthGroup, (dayObject, index) => {
                  return (
                    //   <CalendarGridColumn
                    //     setPopupState={this.setPopupState}
                    //     setPopupContent={this.setPopupContent}
                    //     day={dayObject.day}
                    //     index={index}
                    //     events={_.get(groupedEvents, `[${getDayOfYear(dayObject.day)}]`, [])}
                    //     fetchEventsData={this.fetchEventsData}
                    //   />
                    <DayCalendarDisplay
                      setPopupState={this.setPopupState}
                      setPopupContent={this.setPopupContent}
                      day={dayObject}
                      index={7 * index1 + index}
                      events={_.get(groupedEvents, `[${getDayOfYear(dayObject)}]`, [])}
                      fetchEventsData={this.fetchEventsData}
                      openAddEvent={this.openNewEventPopupDay}
                      openAMOPopup={this.openAMOPopup}
                      goToDaily={this.goToDaily}
                      operations={operations}
                    />
                  );
                })}
              </div>))}
            {isAdmin && this.renderDoubleTotals()}
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
export default connect(mapStateToProps, mapDispatchToProps)(MonthlyCalendar);
