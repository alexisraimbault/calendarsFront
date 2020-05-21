import React, {
	Component
} from 'react';
import classNames from 'classnames';
import './styles.scss'

export default class ActionButton extends Component {

	render() {
        const { clickAction, label } = this.props;

        return (
            <div className="action-button-container" onClick={clickAction}>
                {label}
            </div>
        );
    }

}