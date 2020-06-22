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
import CalendarHeader from '../calendar/calendarHeader';
import CalendarGridColumn from './calendarGridColumn';
import HoursDisplay from '../calendar/hoursDisplay';
import HoursLines from '../calendar/HoursLines';

import './styles.scss';
import { fetchOperationEvents } from '../../redux/actions/eventActions';
import { logout } from '../../redux/actions/meActions';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import {isMobile} from 'react-device-detect';

import {
  useParams,
} from 'react-router-dom';


class CalendarCompanyExport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weekStart: null,
      year: moment().year(),
      week: moment().week(),
      sidebarOpen: false,
      collabsToDisplay: [],
      isPopupDisplayed: false,
      popupContent: null,
      fetchDate: '',
    };
  }

  componentDidMount() {
    const { week, year } = this.state;
    const { operation_id } = this.props.match.params;
    const {
      sessionToken, fetchOperationEvents, history, userInfos,
    } = this.props;

    moment.locale('fr');

    // this.props.history.push(`/calendar/100/2003`)
    if (_.isNil(week) || _.isNil(year)) {
      this.setState({ weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }) }, () => {
        const month = moment(this.state.weekStart).month() + 1;
        const year = moment(this.state.weekStart).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({ fetchDate: `${year}_${monthFormatted}` }, () => {
          fetchOperationEvents(this.state.fetchDate, operation_id).then(() => {
            if(this.isWeekOnTwoMonths()){
              const weekEnd = moment(this.state.weekStart).add(4, 'd');
              const endMonth = moment(weekEnd).month() + 1;
              const endYear = moment(weekEnd).year();
              const endMonthFormatted = endMonth < 10 ? `0${endMonth}` : endMonth;
              fetchOperationEvents(`${endYear}_${endMonthFormatted}`, operation_id).then(() => {
                this.setState({ collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id') });
              });
            }else{
              this.setState({ collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id') });
            }
          });
        });
      });
    } else {
      const weekStart = this.getDayFromWeekAndYear(week - 1, year);
      this.setState({ weekStart }, () => {
        const month = moment(this.state.weekStart).month() + 1;
        const year = moment(this.state.weekStart).year();
        const monthFormatted = month < 10 ? `0${month}` : month;
        this.setState({ fetchDate: `${year}_${monthFormatted}` }, () => {
          fetchOperationEvents(this.state.fetchDate, operation_id).then(() => {
            if(this.isWeekOnTwoMonths()){
              const weekEnd = moment(this.state.weekStart).add(4, 'd');
              const endMonth = moment(weekEnd).month() + 1;
              const endYear = moment(weekEnd).year();
              const endMonthFormatted = endMonth < 10 ? `0${endMonth}` : endMonth;
              fetchOperationEvents(`${endYear}_${endMonthFormatted}`, operation_id).then(() => {
                this.setState({ collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id') });
              });
            }else{
              this.setState({ collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id') });
            }
          });
        });
      });
    }
  }

  fetchEventsData = () => {
    const { sessionToken, fetchOperationEvents, userInfos } = this.props;
    const { operation_id } = this.props.match.params;

    fetchOperationEvents(this.state.fetchDate, operation_id).then( () => {
      if(this.isWeekOnTwoMonths()){
        const weekEnd = moment(this.state.weekStart).add(4, 'd');
        const endMonth = moment(weekEnd).month() + 1;
        const endYear = moment(weekEnd).year();
        const endMonthFormatted = endMonth < 10 ? `0${endMonth}` : endMonth;
        fetchOperationEvents(`${endYear}_${endMonthFormatted}`, operation_id).then(() => {
          this.setState({ collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id') });
        });
      }else{
        this.setState({ collabsToDisplay: _.map(this.getRecipients(this.props.events), 'id') });
      }
    }
    );
  };

  isWeekOnTwoMonths = () => {
    const { weekStart } = this.state;

    const weekStartMonth = moment(weekStart).month();
    const weekEndMonth = moment(weekStart).add(4, 'd').month();

    return weekEndMonth != weekStartMonth;
  }


  getDayFromWeekAndYear = (week, year) => moment().day('Monday').year(year).week(week)
    .add(1, 'd')
    .toDate();

  getRecipients = (events) => {
    let recipients = [];

    _.each(events, (event) => {
      recipients = _.uniqBy(_.concat(recipients, _.get(event, 'invitations', [])), 'id');
    });

    return recipients;
  };

  toggleRecipient = (id, isChecked) => {
    if (isChecked) {
      this.setState((prevState) => ({ collabsToDisplay: _.uniq(_.concat(prevState.collabsToDisplay, id)) }));
    } else {
      this.setState((prevState) => ({ collabsToDisplay: _.difference(prevState.collabsToDisplay, [id]) }));
    }
  };

  logout = () => {
    const { logout, history } = this.props;

    logout();
    history.push('/login');
  };

  renderAmoInfo = displayedEvents => {
    const { events } = this.props;

    let amos = [];
    _.each(displayedEvents, event => {
      amos = _.concat(amos, event.invitations);
    })

    const uniqAMOs = _.uniqBy(amos, 'id');

    return (
      <div>
        {_.map(uniqAMOs, amo => <div>{JSON.stringify(amo)}</div>)}
      </div>
    );
  }

  render() {
    const { weekStart, isPopupDisplayed, popupContent } = this.state;
    const { events } = this.props;

    const groupedEvents = _.groupBy(events, (event) => getDayOfYear(moment(event.date)._d));

    // const groupedEvents = _.groupBy(this.props.events, event => getDayOfYear(moment(event.date)._d));

    const daysOfWeek = [];

    let displayedEvents = [];

    _.forEach(_.times(5), (item) => {
      const day = moment(weekStart).add(item, 'd')._d;
      daysOfWeek.push(
        {
          day,
          isToday: isToday(day),
        },
      );
    });

    _.each(daysOfWeek, day => {
      const eventsForDay = _.get(groupedEvents, `[${getDayOfYear(day.day)}]`, []);

      if(!_.isEmpty(eventsForDay)){
        displayedEvents = _.concat(displayedEvents, eventsForDay);
      }
    })

    const popupHaloClass = classNames({
      'popup-halo': true,
      'popup-halo--toggled': isPopupDisplayed,
    });

    return (
      !_.isNil(weekStart)
      && (
      <div className="calendar-export-container">
        <div className="week-navigation-container">
          <div className="week-navigation-holder">
            <div className="top">
              <div className="calendar-navigation-container">
              </div>
              <div >{`${moment(weekStart).format('D MMM')} - ${moment(weekStart).add(4, 'd').format('D MMM')}`}</div>
              <div className="calendar-navigation-container">
              </div>
            </div>
            <div className="bottom">
              {`${moment(weekStart).format('YYYY')}`}
            </div>
          </div>
        </div>
        <div className="calendar-center-container">
          <CalendarHeader daysOfWeek={daysOfWeek} />
          <HoursDisplay />
          <HoursLines />
          {_.map(daysOfWeek, (dayObject, index) => (
            <CalendarGridColumn
              setPopupState={()=>{}}
              setPopupContent={()=>{}}
              day={dayObject.day}
              index={index}
              events={_.get(groupedEvents, `[${getDayOfYear(dayObject.day)}]`, [])}
              fetchEventsData={this.fetchEventsData}
            />
          ))}
        </div>
        {this.renderAmoInfo(displayedEvents)}
      </div>
      )
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  loading: state.events.loading,
  events: state.events.operationEvents,
  hasErrors: state.events.hasErrors,
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOperationEvents,
  logout,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(CalendarCompanyExport);
