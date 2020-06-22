import React, { Component } from 'react';
import _ from 'lodash';
import { isToday } from 'date-fns';
import classNames from 'classnames';
import './styles.scss';
import * as moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

class DayCalendarDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            offDays, index, day, setPopupState, setPopupContent, createOrDeleteOffDay, users
        } = this.props;

        return (
        <div className="day-off-container">
            <span>{index + 1}</span>
            {_.map(offDays, offDay => <span>{_.find(users, {'id': offDay.user_id}).name}</span>)}
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
