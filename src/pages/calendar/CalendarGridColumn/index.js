import React, { Component } from 'react';
import _ from 'lodash';
import { isToday } from 'date-fns';
import classNames from 'classnames';
import './styles.scss'

class CalendarGridColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }


  //"10:30" => (10.5 - 6) * 100 / (20 - 6) -> bring the time t from an interval from 6h00 to 20h00 to an interval from 0 to 100
  formatTime = (time) => {
    const timeData = _.split(time, ':');
    const normalizedTime = _.parseInt(timeData[0]) + (_.parseInt(timeData[1]) / 60);
    return Math.floor((normalizedTime - 6) * 100 / (20 - 6));
  }

  //from 6h00 to 20h00, only y coords (vertical), in %
  calculateCoords = (event) => {
    return {
      from : this.formatTime(event.time_from),
      to : this.formatTime(event.time_to),
    }
  }

  checkOverleap = (coords1, coords2) => {
    return (coords1.from < coords2.to && coords2.from < coords1.to) ;
  }

  formatWidth = (events) => {
    let overleapMap = {};
    _.forEach(events, event1 => {
      const coords1 = this.calculateCoords(event1);
      let overleapingEvents = [];
      _.forEach(events, event2 => {
        const coords2 = this.calculateCoords(event2);
        if(event2.id !== event1.id && this.checkOverleap(coords1, coords2)){
          overleapingEvents.push(event2.id);
        }
      });
      overleapMap[event1.id] = overleapingEvents;
    })

    let widthMap = {};
    
    _.forEach(overleapMap, (overleapingEvents, id) => {
      const nbOverleap = _.size(overleapingEvents) + 1;
      const defaultWidth = Math.floor(100/nbOverleap);
      let widthGained = {};
      let takenPositions = [];
      widthMap[id] = {width: defaultWidth};
      _.forEach(_.orderBy(overleapingEvents, e => _.get(widthMap, `${e}.width`, 0), 'asc'), eventId => {
        if(!_.isNil(widthMap[eventId])){
          const prevWidth = widthMap[eventId].width;
          takenPositions.push(widthMap[eventId].position);
          if(prevWidth > defaultWidth){
            widthMap[eventId].width = widthMap[id].width;
            //TODO gained width in an eventId row
          }
          if(prevWidth < defaultWidth){
            widthMap[id].width = prevWidth;
            widthGained[eventId] = defaultWidth - prevWidth;
          }
        }
      });
      widthMap[id].position = _.difference(_.times(nbOverleap), takenPositions)[0];
    })
    
    return widthMap;
  }
  
  render() {
    const { events, index, day, setPopupState, setPopupContent } = this.props;

    const widthMap = this.formatWidth(events);

    const columnClass = classNames({
      "col-container": true,
      "col-container--today": isToday(day),
    });

    return (
      <div className={columnClass} style={{left: `${index * 20}%`}}>
        <div className="col-holder">
          {_.map(events, (event) => {
            const coords = this.calculateCoords(event);

            return (
              <div className="event-container" style={{top: `${coords.from}%`, height: `${coords.to - coords.from}%`,left: `${widthMap[event.id].position * widthMap[event.id].width}%`, width: `${widthMap[event.id].width}%`}}>
                <div className="event-holder" onClick={() => {
                    setPopupContent((
                    <div className="event-popup-container">
                      <div className="event-author">{event.name}</div>
                      <div className="event-description">{event.description}</div>
                      {_.map(event.recipients, recipient => <div>{`${recipient.firstname} ${recipient.lastname}`}</div>)}
                    </div>));
                    setPopupState(true)
                  }}>
                  <div className="event-holder-2">
                    <div className="event-author">{event.name}</div>
                    <div className="event-description">{event.description}</div>
                    {/* {_.map(event.recipients, recipient => <div>{`${recipient.firstname} ${recipient.lastname}`}</div>)} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CalendarGridColumn;