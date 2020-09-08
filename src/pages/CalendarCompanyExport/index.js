import React, {
  Component,
} from 'react';
import * as moment from 'moment';
import * as html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  startOfWeek, addDays, isToday, format, getDayOfYear,
} from 'date-fns';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CalendarHeader from '../calendar/CalendarHeader';
import CalendarGridColumn from './CalendarGridColumn';
import HoursDisplay from './hoursDisplay';
import HoursLines from '../calendar/HoursLines';
import ActionButton from '../../components/ActionButton'

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

    this.datePickerRef = React.createRef();

    this.state = {
      weekStart: null,
      year: _.parseInt(props.match.params.year) || moment().year(),
      week: _.parseInt(props.match.params.week) || moment().week(),
      sidebarOpen: false,
      collabsToDisplay: [],
      isPopupDisplayed: false,
      popupContent: null,
      fetchDate: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    const { operation_id, week, year } = this.props.match.params;
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
              fetchOperationEvents(`${endYear}_${endMonthFormatted}`, operation_id, true).then(() => {
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
              fetchOperationEvents(`${endYear}_${endMonthFormatted}`, operation_id, true).then(() => {
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
        fetchOperationEvents(`${endYear}_${endMonthFormatted}`, operation_id, true).then(() => {
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

  navigateToNextMonth = () => {
    const { weekStart } = this.state;
    const { operation_id } = this.props.match.params;
    const nextWeekStart = moment(weekStart).add(1, 'w');

    const newMonth = moment(nextWeekStart).month() + 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarexport/${operation_id}/${moment(nextWeekStart).week()}/${moment(nextWeekStart).year()}`);

    this.setState({
      weekStart: nextWeekStart,
      fetchDate: `${moment(nextWeekStart).year()}_${newMonthFormatted}`,
      year: moment(nextWeekStart).year(),
      week: moment(nextWeekStart).week(),
    });
  };

  navigateToPreviousMonth = () => {
    const { weekStart } = this.state;
    const { operation_id } = this.props.match.params;
    const nextWeekStart = moment(weekStart).add(-1, 'w');

    const newMonth = moment(nextWeekStart).month() + 1;
    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarexport/${operation_id}/${moment(nextWeekStart).week()}/${moment(nextWeekStart).year()}`);

    this.setState({
      weekStart: nextWeekStart,
      fetchDate: `${moment(nextWeekStart).year()}_${newMonthFormatted}`,
      year: moment(nextWeekStart).year(),
      week: moment(nextWeekStart).week(),
    });
  };

  componentDidUpdate(prevProps, prevState) {

    if (prevState.fetchDate !== this.state.fetchDate) {
      this.fetchEventsData();
    }
  }

  navigateToDate = (date) => {
    const { operation_id } = this.props.match.params;

    const newWeek = moment(date).week();
    const newYear = moment(date).year();

    const newStartOfWeek = startOfWeek(moment(date).toDate(), { weekStartsOn: 1 });

    const newMonth = moment(newStartOfWeek).month() + 1;

    const newMonthFormatted = newMonth < 10 ? `0${newMonth}` : newMonth;

    this.props.history.push(`/calendarexport/${operation_id}/${newWeek}/${newYear}`);

    this.setState({
      weekStart: newStartOfWeek,
      fetchDate: `${moment(newStartOfWeek).year()}_${newMonthFormatted}`,
      year: newYear,
      week: newWeek,
    });
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
      <div className="amo-infos-container" id="divId2ToPrint">
        {_.map(uniqAMOs, amo => <div className="amo-infos"><div className="amo-name">{amo.name}</div><div className="amo-contact">{amo.phone || amo.mail}</div></div>)}
      </div>
    );
  }

  exportToPdf = async() => {
    const { fetchDate } = this.state;

    this.setState({isLoading: true});
    const toScale = 3;
    
    const input = document.getElementById('divIdToPrint');
    const input2 = document.getElementById('divId2ToPrint');
    var width = input.clientWidth;
    var width2 = input2.clientWidth;
    input.style.width = `1170px`;
    input2.style.width = `500px`;
    const [imgPage1, imgPage2] = await Promise.all([html2canvas(input, {scale: toScale}), html2canvas(input2, {scale: toScale})]);

    const imgData1 = imgPage1.toDataURL('image/png');
    const imgData2 = imgPage2.toDataURL('image/png');
    
    const pdf = new jsPDF('l', 'pt', 'a4');
    pdf.addImage(imgData1, 'PNG', 20, 10, 800 , 566);
    pdf.addPage();
    pdf.addImage(imgData2, 'PNG', 210, 180, 400, 180);
    pdf.save(`export_orchestra_${fetchDate}.pdf`);
    input.style.width = width + 'px'; 
    input2.style.width = width2 + 'px';
    this.setState({isLoading: false});
  }



  openDatePicker = () => {
    this.datePickerRef.current.setOpen(true);
  };


  render() {
    const { weekStart, isPopupDisplayed, popupContent, isLoading } = this.state;
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
        <div className="export-btn">
          <ActionButton clickAction={this.exportToPdf} label="EXPORT PDF" isLoading={isLoading} />
        </div>
        <div className="calendar-center-container-export" id="divIdToPrint">
          <div className="week-navigation-container-export">
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
                <div onClick={this.openDatePicker}>{`${moment(weekStart).format('D MMM')} - ${moment(weekStart).add(4, 'd').format('D MMM')}`}</div>
                <div className="bottom" onClick={this.openDatePicker}>
                  {`${moment(weekStart).format('YYYY')}`}
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
                selected={moment(weekStart).toDate()}
                onChange={this.navigateToDate}
              />
            </div>
          </div>
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
