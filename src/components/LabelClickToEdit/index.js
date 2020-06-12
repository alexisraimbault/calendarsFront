import React, {
  Component,
} from 'react';
import './styles.scss';

export default class LabelClickToEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editingLabel: props.label || '',
    };
  }

    setEditing = (editMode) => () => this.setState({ isEditing: editMode });

    render() {
      const { isEditing } = this.state;
      const { onChange, value, placeholder } = this.props;

      return (
        <div>
          {isEditing
            ? (
              <div>
                <input
                  className="editable-label-input"
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                />
                <div className="" onClick={this.setEditing(false)}>OK</div>
              </div>
            )
            : (
              <div>
                <div className="editable-label-text">{value}</div>
                <div className="" onClick={this.setEditing(true)}>EDIT</div>
              </div>
            )}
        </div>

      );
    }
}
