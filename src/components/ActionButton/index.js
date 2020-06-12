import React, {
  Component,
} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import './styles.scss';
import { WaveTopBottomLoading } from 'react-loadingg';

export default class ActionButton extends Component {
  render() {
    const {
      clickAction, label, isDanger, isLoading,
    } = this.props;
    const btnClassNames = classNames({
      'action-button-container': true,
      'action-button-container--danger': !_.isNil(isDanger) && isDanger,
    });

    return (
      <div className={btnClassNames} onClick={clickAction}>
        {(!_.isNil(isLoading) && isLoading)
          ? <WaveTopBottomLoading size="small" style={{ position: 'relative', height: '20px' }} />
          : label}
      </div>
    );
  }
}
