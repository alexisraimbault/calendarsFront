import React, {
  Component,
} from 'react';
import _ from 'lodash';
import { isToday, format, addDays } from 'date-fns';
import * as moment from 'moment';
import classNames from 'classnames';
import './styles.scss';

class CalendarHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { daysOfWeek } = this.props;
    return (
      <div className="calendar-header-container">
        {_.map(daysOfWeek, (dayOfWeek) => {
          const titleClassName = classNames({
            'calendar-day-title': true,
            'calendar-day-title--today': isToday(dayOfWeek.day),
          });

          return (
            <div className="calendar-day-title-container">
              <div className={titleClassName}>{moment(dayOfWeek.day).format('dddd D MMMM')}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default CalendarHeader;
