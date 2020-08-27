import React, { Component } from "react";

import * as moment from 'moment';
import _ from "lodash";
import classNames from "classnames";

import ActionButton from '../../components/ActionButton';
import EditableLabel from '../../components/EditableLabel';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./styles.scss";
import { fetchEvents, fetchAmoEvents } from "../../redux/actions/eventActions";
import { fetchOperations } from "../../redux/actions/operationActions";
import OperationSelector from '../../components/OperationSelector';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';

class RdvAcquereurs extends Component {
  constructor(props) {
    super(props);

    //TODO link (+mock en attendant)
    this.state = {
      operationId: _.parseInt(props.match.params.operation_id),
      rdvFormats: [
        {
        name: "1 pièce",
        duration: 1,
        },
        {
        name: "2 pièces",
        duration: 2,
        }
      ],
      timeSpans: [
        {
        date: moment().add(1, 'd'),
        from: "08:00",
        to: "12:00",
        count: 2,
        },
        {
        date: moment().add(1, 'd'),
        from: "14:00",
        to: "18:00",
        count: 1,
        }
      ],
      takenRdvs: [
        {
          date: moment().add(1, 'd'),
          from: "08:00",
          to: "09:00",
        }
      ],
      editingName: '',
      editingMail: '',
      editingPhone: '',
      chosenFormatIdx: -1,
      selectedDay: -1,
    };
  }

  componentDidMount() {
    moment.locale('fr');
    /* const { operationId } = this.state;
    const {  } = this.props; */

    //TODO fetch rdv infos for operation
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

  generatePotentials = (countArray, duration) => {
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
      }
    })
    return proposedSpans;
  }

  generateAvailableTimes = () => {
    const { rdvFormats, chosenFormatIdx, timeSpans, takenRdvs } = this.state;

    if(chosenFormatIdx === -1 ) {return [];}

    const formatDuration = rdvFormats[chosenFormatIdx].duration * 60;
    let res = [];

    _.each(timeSpans, timeSpan => {
      const rdvsTakenThatDate = _.filter(takenRdvs, rdv => moment(rdv.date).format('DD/MM/YYYY') === moment(timeSpan.date).format('DD/MM/YYYY'));
      let { hours: saveStartHour, minutes: saveStartMin } = this.getHoursAndMinutes(timeSpan.from);
      let startHour = saveStartHour;
      let startMin = saveStartMin;
      const { hours: endHour, minutes: endMin } = this.getHoursAndMinutes(timeSpan.to);
      const countAvailablePerMin = [];

      while( this.compareHoursAndMins(startHour, startMin, endHour, endMin) ) {
        let tmpCount = timeSpan.count;
        //take taken rdvs into consideration
        _.each(rdvsTakenThatDate, rdv => {
          const { hours: rdvStartHour, minutes: rdvStartMin } = this.getHoursAndMinutes(rdv.from);
          const { hours: rdvEndHour, minutes: rdvEndMin } = this.getHoursAndMinutes(rdv.to);
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
      const potentials = this.generatePotentials(countAvailablePerMin, formatDuration);
      _.each(potentials, potential => {
        const potentialStartMin = (saveStartMin + potential.from)%60;
        const potentialEndMin = (saveStartMin + potential.to)%60;
        const potentialStartHour = saveStartHour + Math.floor(potential.from/60);
        const potentialEndHour = saveStartHour + Math.floor(potential.to/60);;
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
    const { operationId, selectedDay, rdvFormats, chosenFormatIdx, editingName, editingMail, editingPhone } = this.state;
    const availableTimes = this.generateAvailableTimes();

    return (
      <div className="rdv-acq">
        <div className="client-inputs">
          <div className="title">{"Entrer vos coordonnées"}</div>
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
          <div className="title">{"Choisir le type de visite"}</div>
          {_.map(rdvFormats, (format, idx) => {
            const formatClassName = classNames({
              "format-container": true,
              "format-container--selected": idx === chosenFormatIdx,
            })
            return(

            <div className={formatClassName} onClick={_.partial(this.chooseFormatIdx, idx)}>
              <div className="format-title">{format.name}</div>
              <div className="format-duration">{`${format.duration}h`}</div>
            </div>
            );
          })}
        </div>
        <div className="boxes-container">
          <div className="title">{"Choisir un créneau"}</div>
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
        {this.isFormValid() && <ActionButton /*clickAction={TODO}*/ label="Envoyer" />}
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
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchOperations,
      fetchEvents,
      fetchAmoEvents,
    },
    dispatch
  );
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(RdvAcquereurs);
