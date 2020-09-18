import React, { Component } from "react";

import * as moment from 'moment';
import _ from "lodash";
import classNames from "classnames";

import ActionButton from '../../components/ActionButton';
import EditableLabel from '../../components/EditableLabel';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./styles.scss";
import { fetchEvents, fetchAmoEvents, fetchCreateNoauthEvent, fetchGetNoAuthRdvInfos } from "../../redux/actions/eventActions";
import { fetchOperations } from "../../redux/actions/operationActions";
import OperationSelector from '../../components/OperationSelector';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';

import img from '../../images/orchestra_logo.jpeg';

class RdvAcquereurs extends Component {
  constructor(props) {
    super(props);

    //TODO link (+mock en attendant)
    this.state = {
      savedPageInfos: props.pageInfos,
      operationId: _.parseInt(props.match.params.operation_id),
      rdvFormats: _.get(props.pageInfos, 'settings.formats', []),
      timeSpans: _.get(props.pageInfos, 'settings.spans', []),
      takenRdvs: _.map(_.get(props.pageInfos, 'rdvs', []), span => {
        return {
          date: span.date,
          from: span.time_from,
          to: span.time_to,
        };
      }),
      editingName: '',
      editingMail: '',
      editingPhone: '',
      chosenFormatIdx: -1,
      selectedDay: -1,
      hasValidated: false,
    };
  }

  componentDidMount() {
    moment.locale('fr');
    const { operationId } = this.state;
    const { fetchGetNoAuthRdvInfos } = this.props;

    fetchGetNoAuthRdvInfos(operationId);
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(!_.isEqual(nextProps.pageInfos, prevState.savedPageInfos)){
      return { 
        savedPageInfos: nextProps.pageInfos,
        rdvFormats: _.get(nextProps.pageInfos, 'settings.formats', []),
        timeSpans: _.get(nextProps.pageInfos, 'settings.spans', []),
        takenRdvs: _.map(_.get(nextProps.pageInfos, 'rdvs', []), span => {
          return {
            date: span.date,
            from: span.time_from,
            to: span.time_to,
          };
        }),
      };
    }
    return null;
  }
  
  submit = () => {
    const { fetchCreateNoauthEvent } = this.props;
    const { editingName, editingMail, editingPhone, chosenFormatIdx, selectedDay, rdvFormats, timeSpans, operationId } = this.state;

    const availableTimes = this.generateAvailableTimes();

    const timeSpan = availableTimes[selectedDay];
    const eventDate = timeSpan.date;
    const formattedDate = `${moment(eventDate).year()}-${moment(eventDate).month() + 1}-${moment(eventDate).date()}`;

    fetchCreateNoauthEvent(
      `Rdv ${editingName}`, 
      `tel: ${editingPhone}, visite: ${rdvFormats[chosenFormatIdx].name}`, 
      formattedDate, 
      timeSpan.from,
      timeSpan.to, 
      '-', 
      3, //TODO CORPID
      'rdv', 
      operationId,
      editingMail).then(() => {
        this.setState({hasValidated: true});
      }).catch(err => {
        console.log(err);
      });
  }

  updateEditName = e => this.setState({editingName: e.target.value});

  updateEditMail = e => this.setState({editingMail: e.target.value});

  updateEditPhone = e => this.setState({editingPhone: e.target.value});

  setSelectedDay = idx => this.setState({selectedDay: idx});

  chooseFormatIdx = idx => this.setState({chosenFormatIdx: idx}, () => {
    this.setSelectedDay(-1);
  });

  getHoursAndMinutes = timeString => {
    const values = _.split(timeString, ':');
    return {hours: _.parseInt(values[0]), minutes: _.parseInt(values[1])};
  }

  compareHoursAndMins = (hour1, min1, hour2, min2) => {
    if(hour1 < hour2) {
      return true;
    }
    if(hour1 === hour2) {
      return min1 <= min2;
    }
    return false;
  }

  generatePotentials = (countArray, duration, canOnlyBeAtStart) => {
    let proposedSpans = [];
    const correctIntervals = [];
    let tmpFrom = -1;
    let idx = 0;

    while(idx < _.size(countArray)) {
      if(countArray[idx] > 0) {
        if(tmpFrom === -1) {
          tmpFrom = idx;
        }
      } else {
        if(tmpFrom !== -1) {
          correctIntervals.push({from: tmpFrom, to: idx - 1});
          tmpFrom = -1;
        }
      }

      idx++;
    }

    if(tmpFrom !== -1) {
      correctIntervals.push({from: tmpFrom, to: idx - 1});
    }

    _.each(correctIntervals, interval => {
      if(interval.from - interval.to === duration) {
        proposedSpans.push(interval);
      } else if(interval.to - interval.from > duration) {
        //TODO maybe add more intervals (for now only start and end of the span)
        if (!canOnlyBeAtStart) {
          proposedSpans = _.concat (proposedSpans, [
            {
              from: interval.from,
              to: interval.from + duration,
            },
            {
              from: interval.to - duration,
              to: interval.to,
            }
          ]);
        } else {
          proposedSpans = _.concat (proposedSpans, {
              from: interval.from,
              to: interval.from + duration,
            });
        }
      }
    })
    return proposedSpans;
  }

  generateAvailableTimes = () => {
    const { rdvFormats, chosenFormatIdx, timeSpans, takenRdvs, hasValidated } = this.state;

    if(chosenFormatIdx === -1 ) {return [];}

    const formatName = rdvFormats[chosenFormatIdx].name;
    const isDuplex = _.includes(formatName, 'duplex');
    const nbPIeces = _.parseInt(formatName);
    const canOnlyBeAtStart = nbPIeces >= 4 || isDuplex;
    
    const formatDuration = _.parseInt(rdvFormats[chosenFormatIdx].duration) * 60 + _.parseInt(_.get(rdvFormats[chosenFormatIdx], 'mins', '0'));
    let res = [];

    _.each(timeSpans, timeSpan => {
      const rdvsTakenThatDate = _.filter(takenRdvs, rdv => moment(rdv.date).format('DD/MM/YYYY') === moment(timeSpan.date).format('DD/MM/YYYY'));
      let { hours: saveStartHour, minutes: saveStartMin } = this.getHoursAndMinutes(timeSpan.from);
      let startHour = saveStartHour;
      let startMin = saveStartMin;
      const { hours: endHour, minutes: endMin } = this.getHoursAndMinutes(timeSpan.to);
      let countAvailablePerMin = [];

      while( this.compareHoursAndMins(startHour, startMin, endHour, endMin) ) {
        let tmpCount = timeSpan.count;
        //take taken rdvs into consideration
        _.each(rdvsTakenThatDate, rdv => {
          const { hours: rdvStartHour, minutes: rdvStartMin } = this.getHoursAndMinutes(rdv.from);
          let { hours: rdvEndHour, minutes: rdvEndMin } = this.getHoursAndMinutes(rdv.to);
          if(rdvEndMin !== 0 ) {rdvEndMin --;} else { rdvEndHour --; rdvEndMin = 59;}
          if(this.compareHoursAndMins(rdvStartHour, rdvStartMin, startHour, startMin) && this.compareHoursAndMins(startHour, startMin, rdvEndHour, rdvEndMin)) {
            tmpCount --;
          }
        });
        countAvailablePerMin.push(tmpCount)

        //increment the start time
        startMin ++;
        if(startMin === 60) {
          startMin = 0;
          startHour++;
        }
      }
      //for completing an AMO before starting another
      const minAvailable = _.min(countAvailablePerMin);
      const toFillAmo = _.map(countAvailablePerMin, count => count > minAvailable ? count : 0);
      if (_.size(_.filter(toFillAmo, nb => nb !==0)) > 60) {
        countAvailablePerMin = toFillAmo;
      }
      
      //in case we want to make the visit first think in the morning or after noon
      if(canOnlyBeAtStart) {
        let tmpIdx = 0;
        while(tmpIdx < _.size(countAvailablePerMin) && countAvailablePerMin[tmpIdx] > 0 && tmpIdx <= formatDuration ) {
          tmpIdx ++;
        }
        const tmpCountAvailablePerMin = _.map(countAvailablePerMin, (count, idx) => idx > tmpIdx ? 0 : count);
        countAvailablePerMin = tmpCountAvailablePerMin;
      }

      const potentials = this.generatePotentials(countAvailablePerMin, formatDuration, canOnlyBeAtStart);
      _.each(potentials, potential => {
        const potentialStartMin = (saveStartMin + potential.from)%60;
        const potentialEndMin = (saveStartMin + potential.to)%60;
        const potentialStartHour = saveStartHour + Math.floor(potential.from/60);
        const potentialEndHour = saveStartHour + Math.floor(potential.to/60);
        res.push({
          from: `${potentialStartHour}:${potentialStartMin < 10 ? `0${potentialStartMin}` : potentialStartMin}`,
          to: `${potentialEndHour}:${potentialEndMin < 10 ? `0${potentialEndMin}` : potentialEndMin}`,
          date: timeSpan.date,
        })
      })
    });
    return res;
  }

  isFormValid = () => {
    const { selectedDay, chosenFormatIdx, editingName, editingMail, editingPhone } = this.state;

    return (selectedDay !== -1 && chosenFormatIdx !== -1 && !_.isEmpty(editingName) && !_.isEmpty(editingMail) && !_.isEmpty(editingPhone));
  }

  render() {
    /* const {  } = this.props; */
    const { operationId, selectedDay, rdvFormats, chosenFormatIdx, editingName, editingMail, editingPhone, hasValidated } = this.state;
    const availableTimes = this.generateAvailableTimes();

    return (
      <div className="rdv-acq">
        <img src={img} className="orchestra-logo" />
        {!hasValidated && (
        <>
        <div className="client-inputs">
          <div className="title">{"Coordonnées"}</div>
          <div className="inputs">
            <EditableLabel
              value={editingName}
              onChange={this.updateEditName}
              placeholder={"Nom"}
            />
            <EditableLabel
              value={editingMail}
              onChange={this.updateEditMail}
              placeholder={"email"}
            />
            <EditableLabel
              value={editingPhone}
              onChange={this.updateEditPhone}
              placeholder={"téléphone"}
            />
          </div>
        </div>
        <div className="formats-container">
          <div className="title">{"Type de visite"}</div>
          {_.map(rdvFormats, (format, idx) => {
            const formatClassName = classNames({
              "format-container": true,
              "format-container--selected": idx === chosenFormatIdx,
            })
            return(

            <div className={formatClassName} onClick={_.partial(this.chooseFormatIdx, idx)}>
              <div className="format-title">{format.name}</div>
            </div>
            );
          })}
        </div>
        <div className="boxes-container">
          <div className="title">{"Créneau"}</div>
          <div className="day-boxes">
            {_.map(availableTimes, (time, idx) => {
              const boxClassName = classNames({
                "day-box": true,
                "day-box--disabled": selectedDay !== -1 && idx !== selectedDay,
                "day-box--selected": idx === selectedDay,
              })
              return (
                <div className={boxClassName} onClick={_.partial(this.setSelectedDay, idx)}>
                  <div className="day-box__day">{moment(time.date).format('dddd Do MMM YYYY')}</div>
                  <div className="day-box__time">{`${time.from} - ${time.to}`}</div>
                </div>
              );
            })}
          </div>
        </div>
        {this.isFormValid() && <ActionButton clickAction={this.submit} label="Envoyer" />}
        </>
        )}
        {hasValidated && (
          <div className="validation-container">
            <div className="title">{"Votre rendez vous a bien été enregistré :"}</div>
            <div className="date">{moment(availableTimes[selectedDay].date).format('dddd Do MMM YYYY')}</div>
            <div className="time">{`${availableTimes[selectedDay].from} - ${availableTimes[selectedDay].to}`}</div>
          </div>
        )}
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  operations: state.operations.operations,
  isOperationsLoading: state.operations.loading,
  pageInfos: state.events.rdvPageInfos,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchOperations,
      fetchEvents,
      fetchAmoEvents,
      fetchCreateNoauthEvent,
      fetchGetNoAuthRdvInfos
    },
    dispatch
  );
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(RdvAcquereurs);
