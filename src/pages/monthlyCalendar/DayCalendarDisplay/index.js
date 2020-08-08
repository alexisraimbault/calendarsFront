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
        events, index, day, setPopupState, setPopupContent, openAddEvent, operations
        } = this.props;

        const dayClass = classNames({
            'day-month-master-container': true,
            'day-month-master-container--today': isToday(day),
            'day-month-master-container--weekend': !isToday(day) && _.includes([6, 5], moment(day).day()),
        });

        const eventsByOperations = _.groupBy(events, "operation_id");

        return (
        <div className={dayClass} onClick={openAddEvent(day)}>
            <span>{index + 1}</span>
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

                    return(
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
