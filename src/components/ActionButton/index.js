import React, {
	Component
} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import './styles.scss'

export default class ActionButton extends Component {

	render() {
        const { clickAction, label, isDanger } = this.props;
        const btnClassNames = classNames({
            "action-button-container": true,
			"action-button-container--danger": !_.isNil(isDanger) && isDanger,
        })

        return (
            <div className={btnClassNames} onClick={clickAction}>
                {label}
            </div>
        );
    }

}