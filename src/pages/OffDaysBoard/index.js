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
import DayCalendarOffDisplay from './DayCalendarOffDisplay';

import SidebarMonth from '../../components/sideBarMonth';
import './styles.scss';
import { logout } from '../../redux/actions/meActions';
import { requestGetCompanyOffDays, addOffDay, deleteOffDay } from '../../redux/actions/meActions';
import { fetchUsers } from '../../redux/actions/userActions';
import ActionButton from '../../components/ActionButton';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import {
  useParams,
} from 'react-router-dom';


class OffDays extends Component {
  constructor(props) {
    super(props);

    this.datePickerRef = React.createRef();

    this.state = {
      year: _.parseInt(props.match.params.year) || moment().year(),
      month: _.parseInt(props.match.params.week) || moment().month() + 1,
      sidebarOpen: false,
      collabsToDisplay: [],
      operationsToDisplay: [],
      isPopupDisplayed: false,
      popupContent: null,
    };
  }

  componentDidMount() {
    const { month, year } = this.state;
    const {
      sessionToken, history, userInfos, requestGetCompanyOffDays, fetchUsers
    } = this.props;

    moment.locale('fr');

    if (_.isNil(sessionToken)) {
      history.push('/login');
    }
    requestGetCompanyOffDays(sessionToken);
    fetchUsers(_.get(userInfos, 'corpId'), sessionToken);
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

  navigateToNextMonth = () => {
    const { month, year } = this.state;
    const isDecember = month === 12;
    const newYear = isDecember ? year + 1 : year;
    const newMonth = isDecember ? 1 : month + 1;

    this.props.history.push(`/calendaroffdaysboard/${newMonth}/${newYear}`);

    this.setState({
      year: newYear,
      month: newMonth,
    });
  };

  navigateToPreviousMonth = () => {
    const { month, year } = this.state;
    const isJanuary = month === 1;
    const newYear = isJanuary ? year - 1 : year;
    const newMonth = isJanuary ? 12 : month - 1;

    this.props.history.push(`/calendaroffdaysboard/${newMonth}/${newYear}`);

    this.setState({
      year: newYear,
      month: newMonth,
    });
  };

  navigateToDate = (date) => {
    const newMonth = moment(date).month() + 1;
    const newYear = moment(date).year();

    this.props.history.push(`/calendaroffdaysboard/${newMonth}/${newYear}`);

    this.setState({
      year: newYear,
      month: newMonth,
    });
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

  navigateToCalendar = () => {
    const {
      history,
    } = this.props;

    history.push('/calendarmonth');
  }

  render() {
    const { isPopupDisplayed, popupContent, month, year } = this.state;
    const { users, offDays } = this.props;

    const daysOfMonth = this.getDaysInMonth(month - 1, year);

    const popupHaloClass = classNames({
      'popup-halo': true,
      'popup-halo--toggled': isPopupDisplayed,
    });

    return (
      (true)
      && (
        <div className="calendar-container">
          {/* <SidebarMonth
            recipients={this.getRecipients(this.props.events)}
            operations={_.filter(operations, operation => _.includes(operationIdsToDisplay, operation.id))}
            toggleRecipient={this.toggleRecipient}
            toggleOperation={this.toggleOperation}
            openInvitationPopup={this.openInvitationPopup}
            openOperationsPopup={this.openOperationsPopup}
            logout={this.logout}
            userName={_.get(userInfos, 'name')}
          /> */}
          <div className="back-action-btn-container">
            <ActionButton clickAction={this.navigateToCalendar} label="Retour au planning" />
          </div>
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
                <div onClick={this.openDatePicker}>{`${moment(new Date(year, month - 1, 1)).format('MMM')}`}</div>
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
          <div className="calendar-center-offDays-container months-container">
            {_.map(daysOfMonth, (dayObject, index) => {
              return (
                <DayCalendarOffDisplay
                  setPopupState={this.setPopupState}
                  setPopupContent={this.setPopupContent}
                  day={dayObject}
                  index={index}
                  offDays={_.filter(offDays, offDay => moment(offDay.day).isSame(dayObject, 'date'))}
                  users={users}
                />
              );
            })}
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
  loading: state.me.loading,
  offDays: state.me.allOffDays,
  hasErrors: state.me.hasErrors,
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  users: state.users.users,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestGetCompanyOffDays, addOffDay, deleteOffDay,
  fetchUsers,
  logout,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(OffDays);
