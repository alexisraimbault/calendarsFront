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
import { fetchOperations, fetchOperationSettings, fetchUpdateOperationSettings } from "../../redux/actions/operationActions";
import OperationSelector from '../../components/OperationSelector';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';

class RdvAcquereursConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedOperationSettings: props.operationSettings,
      rdvFormats: _.get(props.operationSettings, 'formats', []),
      hours: _.get(props.operationSettings, 'hours', []),
      timeSpans: _.get(props.operationSettings, 'spans', []),
      selectedOperationsIds: [_.parseInt(props.match.params.operation_id)],
      from: moment(_.get(props.operationSettings, 'from', moment())).toDate(),
      to: moment(_.get(props.operationSettings, 'to', moment().add(1, 'w'))).toDate(),
      fromTime: '08:00',
      toTime: '18:00',
      editingName: '1 pièce',
      editingTime: '',
      editDuplex: false,
      editingMins: '',
      defaultNb: _.get(props.operationSettings, 'defaultamo', ''),
    };
  }

  componentDidMount() {
    const { fetchOperations, sessionToken, fetchOperationSettings, userInfos } = this.props;
    const { selectedOperationsIds } = this.state;
    
    const isAdmin = userInfos.status === "admin";
    if (!isAdmin) {
      history.push('/calendarmonth')
    }

    moment.locale('fr');

    fetchOperations(sessionToken);
    fetchOperationSettings(sessionToken, _.first(selectedOperationsIds));
    
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(!_.isEqual(nextProps.operationSettings, prevState.savedOperationSettings)){
      return { 
        savedOperationSettings: nextProps.operationSettings,
        rdvFormats: _.get(nextProps.operationSettings, 'formats', []),
        hours: _.get(nextProps.operationSettings, 'hours', []),
        timeSpans: _.get(nextProps.operationSettings, 'spans', []),
        selectedOperationsIds: [_.parseInt(nextProps.match.params.operation_id)],
        from: moment(_.get(nextProps.operationSettings, 'from', moment())).toDate(),
        to: moment(_.get(nextProps.operationSettings, 'to', moment().add(1, 'w'))).toDate(),
        defaultNb: _.get(nextProps.operationSettings, 'defaultamo', ''),
      };
    }
    return null;
  }
  

  updateEditName = e => this.setState({editingName: e.target.value});

  updateEditTime = e => this.setState({editingTime: e.target.value});

  updateEditMins = e => this.setState({editingMins: e.target.value});

  updateEditDuplex = e => this.setState({editDuplex: e.target.checked});

  updateDefaultNb = e => this.setState({defaultNb: e.target.value}, () => {
    this.generateTimeSpans();
  });

  updateCount = (date, from, to, value) => () => {
    const { timeSpans } = this.state;

    let tmpSpanIdx = _.findIndex(timeSpans, span => span.date === date && span.from === from && span.to === to);
    let tmpSpans = _.cloneDeep(timeSpans);
    tmpSpans[tmpSpanIdx].count = Math.max(_.parseInt(tmpSpans[tmpSpanIdx].count) + value, 0);
    
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

  addFormat = (name, duration, mins) => () => {
    const { rdvFormats, editDuplex } = this.state;

    const tmpFormats = _.concat(rdvFormats, {name: `${name}${editDuplex ? '-duplex' : ''}`, duration, mins});
    this.setState({rdvFormats: tmpFormats}, () => {
      this.setState({
        editingName: '',
        editingTime: '',
        editingMins: '',
      })
    });
  }

  setSelectedOperationsIds = (array) => this.setState({ selectedOperationsIds: array });

  generateTimeSpans = () => {
    const { from, to, hours, timeSpans, defaultNb } = this.state;

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
            count: this.isWeekend(moment(tmpDate).toDate()) ? 0 : _.isEmpty(defaultNb) ? 1 : defaultNb,
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

  showValidation = () => {
    const { rdvFormats, timeSpans } = this.state;
    return !_.isEmpty(rdvFormats) && !_.isEmpty(timeSpans);
  }

  navigateToCalendar = () => {
    const {
      history,
    } = this.props;

    history.push('/calendarmonth');
  }

  submit = () => {
    const { fetchUpdateOperationSettings, sessionToken } = this.props;
    const { selectedOperationsIds, rdvFormats, from, to, hours, timeSpans, defaultNb } = this.state;

    const settings = {settings: {
      formats: rdvFormats,
      spans: timeSpans,
      from,
      to,
      defaultamo: defaultNb,
      hours,
    }}

    fetchUpdateOperationSettings(sessionToken, _.head(selectedOperationsIds), JSON.stringify(settings));
  }

  render() {
    const { operations } = this.props;
    const { rdvFormats, editingName, editingTime, hours, timeSpans, selectedOperationsIds, defaultNb, editingMins, editDuplex } = this.state;

    const possibleTypes = ['1 pièce', '2 pièces', '3 pièces', '4 pièces', '5 pièces', '6 pièces'];

    return (
      <div className="rdv-acq-config">
        <div className="back-action-btn-container">
          <ActionButton clickAction={this.navigateToCalendar} label="Retour au planning" />
        </div>
        <div className="operation">
          <div className="title">{`Opération : ${_.isEmpty(selectedOperationsIds) ? 'choisir' : _.find(operations, {id: selectedOperationsIds[0]}).name }`}</div>
          {/* <OperationSelector setSelectedUsersIds={this.setSelectedOperationsIds} hideOperation /> */}
        </div>
        <div className="formats">
          <div className="title">{"Insérer les formats possibles"}</div>
          {_.map(rdvFormats, (format, idx) => (
            <div className="format-container">
              <div className="format-name">{format.name}</div>
              <div className="format-duration">
                <div>{`${format.duration}h${_.get(format, 'mins', '00')}`}</div>
                <div className="remove" onClick={_.partial(this.removeFormat, idx)}>{"x"}</div>
              </div>
            </div>
          ))}
          <div className="format-new-container">
            <div className="inputs">
              <select value={editingName} onChange={this.updateEditName} className="input1">
                <option value="1 pièce">1 pièce</option>
                <option value="2 pièces">2 pièces</option>
                <option value="3 pièces">3 pièces</option>
                <option value="4 pièces">4 pièces</option>
                <option value="5 pièces">5 pièces</option>
                <option value="6 pièces">6 pièces</option>
              </select>
              <input
                className="input2"
                value={editingTime}
                onChange={this.updateEditTime}
                placeholder={"heures"}
                type="number"
                />
              <input
                className="input2"
                value={editingMins}
                onChange={this.updateEditMins}
                placeholder={"mins"}
                type="number"
                />
              <input
                name="duplex"
                type="checkbox"
                checked={editDuplex}
                onChange={this.updateEditDuplex} />
                <div className="duplex-label">duplex</div>
            </div>
            <div className="cta">
              {!_.isEmpty(editingTime) && !_.isEmpty(editingName) && <ActionButton clickAction={this.addFormat(editingName, editingTime, editingMins)} label="Ajouter" />}
            </div>
          </div>
        </div>
        <div className="duration">
          <div className="title">{"Choisir les dates d'ouverture et le nombre d'AMOs par défaut"}</div>
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
          <div 
            className="inputAMO"
            >
          <input
            value={defaultNb}
            onChange={this.updateDefaultNb}
            placeholder={"AMOs par défaut"}
            type="number"
            />
            </div>
        </div>
        <div className="time">
          <div className="title">{"Choisir les plages horaires"}</div>
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
          <div className="title">{"Ajuster les créneaux"}</div>
            <div className="day-boxes">
            {_.map(timeSpans, timeSpan => {
              const boxClassName = classNames({
                "day-box__count-container": true,
                "day-box__count-container--disabled": timeSpan.count === 0,
              })
              return (
                <div className="day-box">
                  <div className="day-box__day">{moment(timeSpan.date).format('dddd Do MMM YYYY')}</div>
                  <div className="day-box__time">{`${timeSpan.from} - ${timeSpan.to}`}</div>
                  <div className={boxClassName}>
                    <div className="day-box__count-remove" onClick={this.updateCount(timeSpan.date, timeSpan.from, timeSpan.to, -1)}>-</div>
                    <div className='day-box__count-icon' >
                      <svg viewBox="-42 0 512 512.002" width="18">
                      <path 
                      fill="#84a9ac"
                        d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 
                        36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 
                        0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 
                        23.96875 53.3125 36.125 87.1875 36.125zm0 0"/>
                      <path 
                      fill="#84a9ac"
                        d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 
                        0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 
                        11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 
                        0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 
                        26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 
                        22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 
                        38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 
                        25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/>
                      </svg>
                    </div>
                    <div className="day-box__count-title">{timeSpan.count}</div>
                    <div className="day-box__count-add" onClick={this.updateCount(timeSpan.date, timeSpan.from, timeSpan.to, 1)}>+</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {this.showValidation() && <ActionButton clickAction={this.submit} label="Appliquer" />}
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
  operationSettings: state.operations.settings,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchOperations,
      fetchEvents,
      fetchAmoEvents,
      fetchOperationSettings, 
      fetchUpdateOperationSettings
    },
    dispatch
  );
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(RdvAcquereursConfig);
