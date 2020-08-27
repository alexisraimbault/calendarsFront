import React, {
  Component,
} from 'react';
import './styles.scss';
import _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOperations } from '../../redux/actions/operationActions';

class OperationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUsers: [],
      value: '',
      isFocused: false,
      isHovered: false,
    };
  }

  componentDidMount() {
    const { fetchOperations, sessionToken, operations, defaultSelected } = this.props;

    fetchOperations(sessionToken).then(() => {
      this.setState({selectedUsers: _.filter(operations, operation => _.includes(defaultSelected, operation.id))})
    });
  }

  onValueChange = (e) => this.setState({ value: e.target.value });

  getSelectedUsersIds = () => {
    const { selectedUsers } = this.state;

    return _.map(selectedUsers, (user) => user.id);
  };

  addUser = (user) => () => {
    const { selectedUsers } = this.state;
    const { setSelectedUsersIds } = this.props;

    const newSelected = [user];
    this.setState({ selectedUsers: newSelected }, () => {
      setSelectedUsersIds(this.getSelectedUsersIds());
    });
  };

  removeUser = (user) => () => {
    const { selectedUsers } = this.state;
    const { setSelectedUsersIds } = this.props;

    const newSelected = _.differenceBy(selectedUsers, [user], (item) => item.id);
    this.setState({ selectedUsers: newSelected }, () => {
      setSelectedUsersIds(this.getSelectedUsersIds());
    });
  };

  setFocus = (isFocused) => () => this.setState({ isFocused });

  setHover = (isHovered) => () => this.setState({ isHovered });

  render() {
    const {
      selectedUsers, value, isFocused, isHovered,
    } = this.state;
    const { operations, hideOperation } = this.props;

    const selectedIds = this.getSelectedUsersIds();

    const preFilteredUsers = _.filter(operations, (user) => !_.includes(selectedIds, user.id));
    const filteredUsers = _.filter(preFilteredUsers, (user) => _.includes(_.lowerCase(user.name), _.lowerCase(value)));

    return (
      <div>
        <input
          className="user-selector-input"
          value={value}
          onChange={this.onValueChange}
          placeholder="Search for operations"
          onFocus={this.setFocus(true)}
          onBlur={this.setFocus(false)}
        />
        {(isFocused || isHovered) && (
        <div className="selection-container" onMouseEnter={this.setHover(true)} onMouseLeave={this.setHover(false)}>
          {_.map(filteredUsers, (user) => <div className="selection-item" onClick={this.addUser(user)}>{user.name}</div>)}
        </div>
        )}
        {!(isFocused || isHovered) && (
        <div className="selection-placebo" />)}
        {!hideOperation && (
        <div className="selected-container">
          {_.map(selectedUsers, (user) => <div className="selected-item" onClick={this.removeUser(user)}>{user.name}</div>)}
        </div>)}
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  loading: state.operations.loading,
  operations: state.operations.operations,
  hasErrors: state.operations.hasErrors,
  sessionToken: state.me.sessionToken,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOperations,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(OperationSelector);
