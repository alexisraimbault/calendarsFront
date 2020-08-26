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
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';

class RdvAcquereursConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rdvFormats: [],
      hours: [],
      timeSpans: [],
      from: moment().toDate(),
      to: moment().add(1, 'w').toDate(),
      fromTime: '08:00',
      toTime: '18:00',
      editingName: '',
      editingTime: '',
    };
  }

  componentDidMount() {
    moment.locale('fr');
  }
  

  updateEditName = e => this.setState({editingName: e.target.value});

  updateEditTime = e => this.setState({editingTime: e.target.value});

  updateCount = (date, from, to, value) => () => {
    const { timeSpans } = this.state;

    let tmpSpanIdx = _.findIndex(timeSpans, span => span.date === date && span.from === from && span.to === to);
    let tmpSpans = _.cloneDeep(timeSpans);
    tmpSpans[tmpSpanIdx].count = Math.max(tmpSpans[tmpSpanIdx].count + value, 0);
    
    this.setState({timeSpans: tmpSpans});
  }

  removeFormat = idx => {
    const { rdvFormats } = this.state;

    const tmpFormats = _.filter(rdvFormats, (format, index) => index !== idx);
    this.setState({rdvFormats: tmpFormats});
  }

  removeHour = idx => {
    const { hours } = this.state;

    const tmpHours = _.filter(hours, (hour, index) => index !== idx);
    this.setState({hours: tmpHours}, () => {
      this.generateTimeSpans();
    });
  }

  addHour = (from, to) => () => {
    const { hours } = this.state;

    const tmpHours = _.concat(hours, {from, to});
    this.setState({hours: tmpHours}, () => {
      this.setState({
        fromTime: '08:00',
        toTime: '18:00',
      });
      this.generateTimeSpans();
    });
  }

  updateFrom = time => this.setState({from: time}, () => {
    this.generateTimeSpans();
  });

  updateTo = time => this.setState({to: time}, () => {
    this.generateTimeSpans();
  });

  updateFromTime = time => this.setState({fromTime: time});

  updateToTime = time => this.setState({toTime: time});

  addFormat = (name, duration) => () => {
    const { rdvFormats } = this.state;

    const tmpFormats = _.concat(rdvFormats, {name, duration});
    this.setState({rdvFormats: tmpFormats}, () => {
      this.setState({
        editingName: '',
        editingTime: '',
      })
    });
  }

  generateTimeSpans = () => {
    const { from, to, hours, timeSpans } = this.state;

    let res = [];

    let tmpDate = moment(from);
    const endDate = moment(to);

    while(!moment(tmpDate).isAfter(endDate)) {
      _.each(hours, hour => {
        const existingSpanIdx = _.findIndex(timeSpans, timeSpan => timeSpan.from === hour.from && timeSpan.to === hour.to && timeSpan.date === tmpDate);

        if(existingSpanIdx !== -1 ) {
          res.push(timeSpans[existingSpanIdx]);
        } else {
          res.push({
            ...hour,
            date: tmpDate,
            count: this.isWeekend(moment(tmpDate).toDate()) ? 0 : 1,
          })
        }
      })
      tmpDate = moment(tmpDate).add(1, 'd');
    }
    this.setState({timeSpans: res});
  }

  isWeekend = (date1) => {
    const dt = new Date(date1);

    if(dt.getDay() == 6 || dt.getDay() == 0)
      {
        return true;
      } 
    return false;
  }

  render() {
    const { operations } = this.props;
    const { rdvFormats, editingName, editingTime, hours, timeSpans } = this.state;

    return (
      <div className="rdv-acq-config">
        <div className="formats">
          <div className="title">{"Insérer les formats possibles"}</div>
          {_.map(rdvFormats, (format, idx) => (
            <div className="format-container">
              <div className="format-name">{format.name}</div>
              <div className="format-duration">
                <div>{`${format.duration}h`}</div>
                <div className="remove" onClick={_.partial(this.removeFormat, idx)}>{"x"}</div>
              </div>
            </div>
          ))}
          <div className="format-new-container">
            <div className="inputs">
              <input
                className="input1"
                value={editingName}
                onChange={this.updateEditName}
                placeholder={"type"}
                />
              <input
                className="input2"
                value={editingTime}
                onChange={this.updateEditTime}
                placeholder={"durée (h)"}
                type="number"
                />
            </div>
            <div className="cta">
              {!_.isEmpty(editingTime) && !_.isEmpty(editingName) && <ActionButton clickAction={this.addFormat(editingName, editingTime)} label="Ajouter" />}
            </div>
          </div>
        </div>
        <div className="duration">
          <div className="title">{"Choisissez les dates d'ouverture"}</div>
          <div className="date-pickers">
            <div className="date-picker">
              <span className="pronoun">De</span>
              <DatePicker
                selected={this.state.from}
                onChange={this.updateFrom}
              />
            </div>
            <div className="date-picker">
              <span className="pronoun">A</span>
              <DatePicker
                selected={this.state.to}
                onChange={this.updateTo}
              />
            </div>
          </div>
        </div>
        <div className="time">
          <div className="title">{"Choisissez les plages horaires"}</div>
          {_.map(hours, (format, idx) => (
            <div className="format-container">
              <div className="format-name">{format.from}</div>
              <div className="format-duration">
                <div>{`${format.to}h`}</div>
                <div className="remove" onClick={_.partial(this.removeHour, idx)}>{"x"}</div>
              </div>
            </div>
          ))}
          <div className="date-pickers-container">
          <div className="date-pickers">
            <div className="date-picker">
              <span className="pronoun">De</span>
              <TimePicker
                onChange={this.updateFromTime}
                value={this.state.fromTime}
                />
            </div>
            <div className="date-picker">
              <span className="pronoun">A</span>
              <TimePicker
                onChange={this.updateToTime}
                value={this.state.toTime}
                />
            </div>
                </div>
            <div className="cta">
            <ActionButton clickAction={this.addHour(this.state.fromTime, this.state.toTime)} label="Ajouter" />
            </div>
          </div>
        </div>
        <div className="half-days">
          <div className="title">{"Ajustez les demi-journées"}</div>
            <div className="day-boxes">
            {_.map(timeSpans, timeSpan => {
              const boxClassName = classNames({
                "day-box": true,
                "day-box--disabled": timeSpan.count === 0,
              })
              return (
                <div className={boxClassName}>
                  <div className="day-box__day">{moment(timeSpan.date).format('dddd Do MMM YYYY')}</div>
                  <div className="day-box__time">{`${timeSpan.from} - ${timeSpan.to}`}</div>
                  <div className="day-box__count-container">
                    <div className="day-box__count-title">{`${timeSpan.count} x`}</div>
                    <div className="day-box__count-add" onClick={this.updateCount(timeSpan.date, timeSpan.from, timeSpan.to, 1)}>+</div>
                    <div className="day-box__count-remove" onClick={this.updateCount(timeSpan.date, timeSpan.from, timeSpan.to, -1)}>-</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(RdvAcquereursConfig);
