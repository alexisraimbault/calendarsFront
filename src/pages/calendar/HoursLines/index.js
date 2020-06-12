import React, { Component } from 'react';
import _ from 'lodash';
import { isToday } from 'date-fns';
import classNames from 'classnames';
import './styles.scss';

class HoursLines extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hours-lines-container">
        {_.map(_.range(13), (hour) => <div style={{ top: `${Math.floor((hour + 1) * 100 / (20 - 6))}%` }} className="hour-line-container" />)}
      </div>
    );
  }
}

export default HoursLines;
