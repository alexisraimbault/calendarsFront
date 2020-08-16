import React, { Component } from 'react';
import _ from 'lodash';
import { isToday } from 'date-fns';
import classNames from 'classnames';
import './styles.scss';
import * as moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

import EventDetailsPopup from '../EventDetailsPopup';

class DayCalendarDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openAMOPopup = (day, selectedUsers, selectedOperation) => event => {
    const { openAMOPopup } = this.props;
    event.stopPropagation();

    openAMOPopup(day, selectedUsers, selectedOperation);
  }

  render() {
    const {
      events, index, day, setPopupState, setPopupContent, openAddEvent, operations, goToDaily,
    } = this.props;

    const dayClass = classNames({
      'day-month-master-1-container': true,
      'day-month-master-1-container--today': isToday(day),
      'day-month-master-1-container--weekend': !isToday(day) && _.includes([6, 5], moment(day).day()),
    });

    const eventsByOperations = _.groupBy(events, "operation_id");

    return (
      <div className={dayClass} onClick={goToDaily(day)}>
        <div className="top-day">
          <div>{index + 1}</div>
          <div className='add-icon' onClick={openAddEvent(day)}>
            <svg height="20px" viewBox="0 -24 512 511" width="20px" xmlns="http://www.w3.org/2000/svg">
              <path
              fill="#84a9ac"
                d="m400.601562 241.5c-61.425781 0-111.398437 49.972656-111.398437 111.398438 0 61.425781 49.972656 111.402343 111.398437 
            111.402343 61.425782 0 111.398438-49.972656 111.398438-111.402343 0-61.425782-49.976562-111.398438-111.398438-111.398438zm32.132813 
            126.398438h-17.132813v17.132812c0 8.285156-6.714843 15-15 15-8.285156 0-15-6.714844-15-15v-17.132812h-17.132812c-8.285156 0-15-6.714844-15-15 
            0-8.28125 6.714844-15 15-15h17.132812v-17.132813c0-8.28125 6.714844-15 15-15 8.285157 0 15 6.71875 15 15v17.132813h17.132813c8.285156 0 15 6.71875 
            15 15 0 8.285156-6.714844 15-15 15zm0 0"
              />
              <path
              fill="#84a9ac"
                d="m159.601562 223.300781c61.425782 0 111.398438-49.976562 111.398438-111.402343 0-61.425782-49.976562-111.398438-111.398438-111.398438-61.425781 
            0-111.402343 49.972656-111.402343 111.398438 0 61.429687 49.976562 111.402343 111.402343 111.402343zm0 0"
              />
              <path
              fill="#84a9ac"
                d="m291.453125 263.101562c-11.269531-16.496093-25.546875-30.792968-42.042969-42.066406-24.4375 20.148438-55.734375 32.265625-89.808594 
            32.265625-34.074218 0-65.371093-12.117187-89.8125-32.265625-42.097656 28.765625-69.789062 77.140625-69.789062 131.863282v56.234374c0 30.421876 
            24.746094 55.167969 55.164062 55.167969h208.867188c13.421875 0 25.734375-4.820312 
            35.308594-12.816406-24.820313-25.492187-40.140625-60.28125-40.140625-98.585937 0-34.066407 12.113281-65.359376 32.253906-89.796876zm0 0"
              />
            </svg>
          </div>
        </div>
        <Scrollbars
          autoHeight
          autoHeightMin={0}
          autoHeightMax={160}
        >
          {_.map(eventsByOperations, (eventArray, operationId) => {
            const AMOEvents = _.filter(eventArray, event => event.type === 'amo');
            const externalEvents = _.filter(eventArray, event => event.type === 'rdv');
            const workingAMO = _.reduce(AMOEvents, (result, value, key) => {
              return _.uniqBy(_.concat(result, value.invitations), 'id')
            }, []);

            const currentOperation = _.find(operations, ['id', _.parseInt(operationId)]);

            return (
              <div onClick={this.openAMOPopup(day, _.map(workingAMO, amo => amo.id), [_.parseInt(operationId)])} className="event-day-container" style={{ /*height: `calc(${100 / _.size(eventsByOperations)}% - ${20 / _.size(eventsByOperations)}px)`,*/ backgroundColor: `${currentOperation.color}` }}>
                <div>{_.map(workingAMO, amo => <div>{amo.name}</div>)}</div>
                {_.size(externalEvents) > 0 && <div>{`${_.size(externalEvents)} rdv acquéreur`}</div>}
              </div>
            );
          })}
        </Scrollbars>
        {/* <div className="col-holder">
            {_.map(events, (event) => {
                const coords = this.calculateCoords(event);

                return (
                <div
                    className="event-container"
                    style={{
                    top: `${coords.from}%`, height: `${coords.to - coords.from}%`, left: `${widthMap[event.id].position * widthMap[event.id].width}%`, width: `${widthMap[event.id].width}%`,
                    }}
                >
                    <div
                    className="event-holder"
                    onClick={() => {
                        setPopupContent((
                        <EventDetailsPopup
                            closePopup={() => { this.props.setPopupState(false); }}
                            fetchEventsData={this.props.fetchEventsData}
                            title={event.name}
                            description={event.description}
                            date={moment(event.date).format('DD/MM/YYYY')}
                            startTime={event.time_from}
                            endTime={event.time_to}
                            invited={event.invitations}
                            eventId={event.id}
                        />
                        ));
                        setPopupState(true);
                    }}
                    >
                    <div className="event-holder-2">
                        <Scrollbars className="custom-scrollbars" renderTrackHorizontal={(props) => <div {...props} style={{ display: 'none' }} className="track-horizontal" />}>
                        <div className="event-author">{event.name}</div>
                        <div className="event-recipients">
                            {_.map(event.invitations, (recipient) => <div className="event-recipient">{recipient.name}</div>)}
                        </div>
                        <div className="event-description">{event.description}</div>
                        </Scrollbars>
                    </div>
                    </div>
                </div>
                );
            })}
            </div> */}
      </div>
    );
  }
}

export default DayCalendarDisplay;
