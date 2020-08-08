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
import CalendarGridColumnMobile from '../calendarGridColumnMobile';
import HoursDisplay from '../../calendar/hoursDisplay';
import HoursLines from '../../calendar/HoursLines';

import ActionButton from '../../../components/ActionButton';
import './styles.scss';
import { fetchEvents } from '../../../redux/actions/eventActions';
import { logout } from '../../../redux/actions/meActions';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import {
  useParams,
} from 'react-router-dom';

class CalendarMobile extends Component {
  constructor(props) {
    super(props);

    this.datePickerRef = React.createRef();

    this.state = {
      day: null,
      year: _.parseInt(props.match.params.year) || moment().year(),
      dayCount: _.parseInt(props.match.params.day) || moment().dayOfYear(),
      fetchDate: '',
    };
  }

  componentDidMount() {
    const { day, year } = this.props.match.params;
    const {
      sessionToken, fetchEvents, history, userInfos,
    } = this.props;

    moment.locale('fr');

    if (_.isNil(sessionToken)) {
      history.push('/login');
    }

    if (_.isNil(day) || _.isNil(year)) {
      this.setState({ day: new Date()}, () => {
        const month = moment(this.state.day).month() + 1;
        const year = moment(this.state.day).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({ fetchDate: `${year}_${monthFormatted}` }, () => {
          this.fetchEventsData();
        });
      });
    } else {
      const dayPage = moment().dayOfYear(day);
      this.setState({ day: dayPage }, () => {
        const month = moment(this.state.day).month() + 1;
        const year = moment(this.state.day).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({ fetchDate: `${year}_${monthFormatted}` }, () => {
          this.fetchEventsData();
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { sessionToken, fetchEvents, userInfos } = this.props;

    if (prevState.fetchDate !== this.state.fetchDate) {
      fetchEvents(this.state.fetchDate, sessionToken, _.get(userInfos, 'corpId'));
    }
  }

  fetchEventsData = () => {
    const { sessionToken, fetchEvents, userInfos } = this.props;

    fetchEvents(this.state.fetchDate, sessionToken, _.get(userInfos, 'corpId'));
  };

  navigateToNextWeek = () => {
    const { day } = this.state;
    const newDay = moment(day).add(1, 'd');
    const newDayCount = moment(newDay).dayOfYear();
    const newYear = moment(newDay).year();
    const newMonth = moment(newDay).month() + 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/mcalendar/${newDayCount}/${newYear}`);

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

    this.props.history.push(`/mcalendar/${newDayCount}/${newYear}`);

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

    this.props.history.push(`/mcalendar/${newDayCount}/${newYear}`);

    this.setState({
      fetchDate: `${newYear}_${newMonthFormatted}`,
      day: date,
      year: newYear,
      dayCount: newDayCount,
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

  render() {
    const { day, isPopupDisplayed, popupContent } = this.state;
    const { userInfos } = this.props;

    const filteredEvents = _.filter(this.props.events, (event) => moment(event.date).dayOfYear() === moment(day).dayOfYear());

    return (
      !_.isNil(day)
      && (
      <div className="mobile-calendar-container">
        <div className="calendar-center-container">
          <HoursDisplay />
          <HoursLines />
          <CalendarGridColumnMobile
            day={day}
            index={0}
            events={filteredEvents}
            fetchEventsData={this.fetchEventsData}
          />
        </div>
        <div className="mobile-week-navigation-container">
          <div className="week-navigation-holder">
            <div className="top">
              <div className="calendar-navigation-container" onClick={this.navigateToPreviousWeek}>
                <svg viewBox="0 0 512 512" width="20" height="20">
                  <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                    C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                    c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                    l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"
                  />
                </svg>
              </div>
              <div onClick={this.openDatePicker}>{`${moment(day).format('D MMM')}`}</div>
              <div className="calendar-navigation-container" onClick={this.navigateToNextWeek}>
                <svg viewBox="0 0 512 512" width="20" height="20">
                  <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"
                  />
                </svg>
              </div>
            </div>
            <div className="bottom" onClick={this.openDatePicker}>
              {`${moment(day).format('YYYY')}`}
            </div>
            <DatePicker
              ref={this.datePickerRef}
              selected={day._d}
              onChange={this.navigateToDate}
            />
          </div>
        </div>
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
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchEvents,
  logout,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(CalendarMobile);
