import React, { Component } from 'react';
import _ from 'lodash';
import { isToday } from 'date-fns';
import classNames from 'classnames';
import './styles.scss';

class HoursDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <div className="hours-container">
        {_.map(_.range(15), (hour) => <div style={{ top: `${Math.floor((hour) * 100 / (20 - 6))}%` }} className="hour-container">{`${hour + 6}h`}</div>)}
      </div>
    );
  }
}

export default HoursDisplay;
