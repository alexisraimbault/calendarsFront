import React, {
	Component
} from 'react';
import './styles.scss'

export default class EditableLabel extends Component {
	constructor(props) {
		super(props);
		this.state = {
            isEditing: props.isEditing || false,
            editingLabel: props.label || '',
		}
    }

	render() {
        const { isToggled } = this.state;
        const { onChange , value, placeholder} = this.props;

        return (
            <input
                className="editable-label-input"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        );
    }

}