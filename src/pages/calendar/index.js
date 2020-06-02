import React, {
  Component
} from 'react';
import CalendarHeader from './calendarHeader';
import CalendarGridColumn from './calendarGridColumn';InvitationPopup
import NewEventPopup from './NewEventPopup';
import InvitationPopup from './invitationPopup';
import * as moment from 'moment';
import { startOfWeek, addDays, isToday, format, getDayOfYear } from 'date-fns';

import ActionButton from '../../components/ActionButton';
import Sidebar from '../../components/sideBar';
import _ from 'lodash';
import './styles.scss'
import classNames from 'classnames';
import { connect } from 'react-redux'
import { fetchEvents } from '../../redux/actions/eventActions'
import { logout } from '../../redux/actions/meActions'
import { bindActionCreators } from 'redux';

import {
  useParams
} from "react-router-dom";

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weekStart: null,
      year: _.parseInt(props.match.params.year) || moment().year(),
      week: _.parseInt(props.match.params.week) || moment().week(),
      sidebarOpen: false,
      collabsToDisplay: [],
      isPopupDisplayed: false,
      popupContent: null,
      fetchDate: '',
    }
  }

  componentDidMount() {
    const { week, year } = this.props.match.params;
    const { sessionToken, fetchEvents, history } = this.props;
    if(_.isNil(sessionToken)) {
      history.push("/login");
    }

    // this.props.history.push(`/calendar/100/2003`)
    if(_.isNil(week) || _.isNil(year)){
      this.setState({weekStart: startOfWeek(new Date(), {weekStartsOn: 1})}, () => {
        const month = moment(this.state.weekStart).month() + 1;
        const year = moment(this.state.weekStart).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({fetchDate: `${year}_${monthFormatted}`}, () => {
          fetchEvents(this.state.fetchDate, sessionToken).then( () => {
            this.setState({collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id')});
          });
        })
      });
    }else{
      const weekStart = this.getDayFromWeekAndYear(week, year);
      this.setState({weekStart: weekStart}, () => {
        const month = moment(this.state.weekStart).month() + 1;
        const year = moment(this.state.weekStart).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({fetchDate: `${year}_${monthFormatted}`}, () => {
          fetchEvents(this.state.fetchDate, sessionToken).then( () => {
            this.setState({collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id')});
          });
        })
      });
    }
  }

  //TODO when props change check if needed to call new data (if different month)

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  setPopupState = (state) => {
    this.setState({isPopupDisplayed: state});
  }

  setPopupContent = (content) => {
    this.setState({popupContent: content});
  }

  openNewEventPopup = () => {
    const newEventPopup = <NewEventPopup closePopup={() => {this.setPopupState(false)}} fetchEventsData={this.fetchEventsData}/>
    this.setState({
      popupContent: newEventPopup,
      isPopupDisplayed: true
    });
  }

  openInvitationPopup = () => {
    const invitationPopup = <InvitationPopup closePopup={() => {this.setPopupState(false)}}/>
    this.setState({
      popupContent: invitationPopup,
      isPopupDisplayed: true
    });
  }

  fetchEventsData = () => {
    const { sessionToken, fetchEvents } = this.props;

    fetchEvents(this.state.fetchDate, sessionToken);
  }
  
  navigateToNextWeek = () => {
    const { weekStart } = this.state;
    const nextWeekStart = moment(weekStart).add(1, 'w');
    const newWeek = moment(nextWeekStart).week();
    const newYear = moment(nextWeekStart).year();

    this.props.history.push(`/calendar/${newWeek}/${newYear}`);

    this.setState({
      weekStart: nextWeekStart,
      year: newYear,
      week: newWeek,
    });
  }

  navigateToPreviousWeek = () => {
    const { weekStart } = this.state;
    const nextWeekStart = moment(weekStart).add(-1, 'w');
    const newWeek = moment(nextWeekStart).week();
    const newYear = moment(nextWeekStart).year();

    this.props.history.push(`/calendar/${newWeek}/${newYear}`);

    this.setState({
      weekStart: nextWeekStart,
      year: newYear,
      week: newWeek,
    });
  }


  getDayFromWeekAndYear = (week, year) => {
    return moment().day("Monday").year(year).week(week).toDate();
  };

  getRecipients = (events) => {
    let recipients = [];

    _.each(events, event => {
      recipients = _.uniqBy(_.concat(recipients, _.get(event, "invitations", [])), 'id');
    });

    return recipients;
  }

  toggleRecipient = (id, isChecked) => {
    if(isChecked) {
      this.setState(prevState => ({collabsToDisplay: _.uniq(_.concat(prevState.collabsToDisplay, id))}))
    }else{
      this.setState(prevState => ({collabsToDisplay: _.difference(prevState.collabsToDisplay, [id])}))
    }
  }

  logout = () => {
    const { logout, history } = this.props;

    logout();
    history.push("/login");
  }

  render() {
    const { weekStart, isPopupDisplayed, popupContent } = this.state;

    const filteredEvents = _.filter(this.props.events, event => !_.isEmpty(_.intersection(this.state.collabsToDisplay, _.map(event.invitations, 'id'))));

    const groupedEvents = _.groupBy(filteredEvents, event => getDayOfYear(moment(event.date)._d));

    // const groupedEvents = _.groupBy(this.props.events, event => getDayOfYear(moment(event.date)._d));

    let daysOfWeek = [];
    
    _.forEach(_.times(5), item => {
      const day = moment(weekStart).add(item, 'd')._d;
      daysOfWeek.push(
        {
          day: day,
          isToday: isToday(day)
        }
      );
    });

    const popupHaloClass = classNames({
			"popup-halo": true,
			"popup-halo--toggled": isPopupDisplayed,
		});

    return (
      !_.isNil(weekStart) && 
      <div>
        <Sidebar recipients={this.getRecipients(this.props.events)} toggleRecipient={this.toggleRecipient} openInvitationPopup={this.openInvitationPopup} logout={this.logout}/>
        <div className="week-navigation-container">
          <div className="week-navigation-holder">
            <div className="calendar-navigation-container" onClick={this.navigateToPreviousWeek}>
              <svg viewBox="0 0 512 512" width="20" height="20">
                <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                  C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                  c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                  l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"/>
              </svg>
            </div>
            <div>{`${moment(weekStart).format("MMM D")} - ${moment(weekStart).add(4, 'd').format("MMM D")}`}</div>
            <div className="calendar-navigation-container" onClick={this.navigateToNextWeek}>
              <svg viewBox="0 0 512 512" width="20" height="20">
                <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                  c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                  c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                  c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="add-action-btn-container">
          <ActionButton clickAction={this.openNewEventPopup} label={"Add event"}/>
        </div>
        <div className="calendar-center-container">
          <CalendarHeader daysOfWeek={daysOfWeek} />
          {_.map(daysOfWeek, (dayObject, index) => (
            <CalendarGridColumn 
              setPopupState={this.setPopupState} 
              setPopupContent={this.setPopupContent} 
              day={dayObject.day} 
              index={index} 
              events={_.get(groupedEvents, `[${getDayOfYear(dayObject.day)}]`, [])} 
              fetchEventsData={this.fetchEventsData}
            />
          ))}
        </div>
        {isPopupDisplayed && (
          <div>
            <div className={popupHaloClass} onClick={() => {this.setPopupState(false)}}>
            </div>
            <div className="popup-container">
              {popupContent}
            </div>
          </div>
          )}
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = state => ({
  loading: state.events.loading,
  events: state.events.events,
  hasErrors: state.events.hasErrors,
  sessionToken: state.me.sessionToken,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEvents: fetchEvents,
  logout: logout,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(Calendar)