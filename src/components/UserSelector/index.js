import React, {
  Component,
} from 'react';
import './styles.scss';
import classNames from 'classnames';
import _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../../redux/actions/userActions';

class UserSelector extends Component {
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
    const { fetchUsers, sessionToken, userInfos, users, defaultSelected } = this.props;

    fetchUsers(_.get(userInfos, 'corpId'), sessionToken).then(() => {
      this.setState({selectedUsers: _.filter(users, user => _.includes(defaultSelected, user.id))})
    });;
  }

    onValueChange = (e) => this.setState({ value: e.target.value });

    getSelectedUsersIds = () => {
      const { selectedUsers } = this.state;

      return _.map(selectedUsers, (user) => user.id);
    };

    addUser = (user) => () => {
      const { selectedUsers } = this.state;
      const { setSelectedUsersIds } = this.props;

      const newSelected = _.uniq(_.concat(selectedUsers, user));
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
      const { users , offIds } = this.props;

      const selectedIds = this.getSelectedUsersIds();

      const preFilteredUsers = _.filter(users, (user) => !_.includes(selectedIds, user.id));
      const filteredUsers = _.filter(preFilteredUsers, (user) => _.includes(_.lowerCase(user.name), _.lowerCase(value)));

      return (
        <div>
          <input
            className="user-selector-input"
            value={value}
            onChange={this.onValueChange}
            placeholder="Search for users"
            onFocus={this.setFocus(true)}
            onBlur={this.setFocus(false)}
          />
          {(isFocused || isHovered) && (
          <div className="selection-container" onMouseEnter={this.setHover(true)} onMouseLeave={this.setHover(false)}>
            {_.map(filteredUsers, (user) => {
              const itemClass = classNames({
                'selection-item': true,
                'selection-item--off': _.includes(offIds, user.id),
              });
              
              return (
              <div 
              className={itemClass} 
              onClick={this.addUser(user)}>
                {user.name}
              </div>);})}
          </div>
          )}
          {!(isFocused || isHovered) && (
          <div className="selection-placebo" />)}
          <div className="selected-container">
            {_.map(selectedUsers, (user) => <div className="selected-item" onClick={this.removeUser(user)}>{user.name}</div>)}
          </div>
        </div>
      );
    }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  loading: state.users.loading,
  users: state.users.users,
  userInfos: state.me.infos,
  hasErrors: state.users.hasErrors,
  sessionToken: state.me.sessionToken,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUsers,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(UserSelector);
