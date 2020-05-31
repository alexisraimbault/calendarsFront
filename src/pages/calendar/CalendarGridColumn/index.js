import React, { Component } from 'react';
import _ from 'lodash';
import { isToday } from 'date-fns';
import classNames from 'classnames';
import './styles.scss'
import * as moment from 'moment';

import EventDetailsPopup from '../EventDetailsPopup'

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

    const groupedOverleapMap = this.getGroupedOverleapMap(overleapMap);

    let widthMap = {};
    
    _.forEach(overleapMap, (overleapingEvents, id) => {
      // const nbOverleap = _.size(overleapingEvents) + 1;
      const nbOverleap = _.size(_.maxBy(groupedOverleapMap[id], group => _.size(group))) + 1;
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

  // from 
  // {
  //   52: [54, 56]
  //   54: [52, 56]
  //   56: [52, 54, 58]
  //   58: [56]
  // }
  // to 
  // {
  //   52: [[54, 56]]
  //   54: [[52, 56]]
  //   56: [[52, 54], [58]]
  //   58: [[56]]
  // }
  getGroupedOverleapMap = overleapMap => {
    let res = {};
    _.forEach(overleapMap, (events, id) => {
      if(_.isEmpty(events)){
        res[id] = [[]];
      }else{
        res[id] = [[events[0]]];
        let cpt1 = 1;
        while (cpt1 < _.size(events)){
          let cpt2 = 0;
          let assigned = false;
          while(cpt2 < _.size(res[id]) && !assigned ){
            if(_.includes(overleapMap[res[id][cpt2]], events[cpt1])){
              res[id][cpt2].push(events[cpt1]);
              assigned = true;
            }
            cpt2++;
          }
          if(!assigned){
            res[id].push([events[cpt1]]);
          }
          cpt1++;
        }
      }
    })
    return res;
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
                      <EventDetailsPopup 
                        closePopup={() => {this.props.setPopupState(false)}} 
                        fetchEventsData={this.props.fetchEventsData}
                        title={event.name}
                        description={event.description}
                        date={moment(event.date)._d}
                        startTime={event.time_from}
                        endTime={event.time_to}
                        invited={event.invitations}
                      />
                    // <div className="event-popup-container">
                    //   <div className="event-author">{event.name}</div>
                    //   <div className="event-description">{event.description}</div>
                    //   {_.map(event.invitations, recipient => <div>{`${recipient.name}`}</div>)}
                    // </div>
                    ));
                    setPopupState(true)
                  }}>
                  <div className="event-holder-2">
                    <div className="event-author">{event.name}</div>
                    <div className="event-description">{event.description}</div>
                    {_.map(event.invitations, recipient => <div>{`${recipient.name}`}</div>)}
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