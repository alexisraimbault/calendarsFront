import React, {
  Component
} from 'react';
import _ from 'lodash';
import format from 'date-fns/format'
import './styles.scss'

class CalendarHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { daysOfWeek } = this.props;
    return (
      <div className="calendar-header-container">
        {_.map(daysOfWeek, dayOfWeek => <div className="calendar-day-title" >{format(dayOfWeek.day, 'EEE d MMMM')}</div>)}
      </div>
    );
  }
}

export default CalendarHeader;