import React, {
	Component
} from 'react';
import './styles.scss'
import _ from 'lodash';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../../redux/actions/userActions'

class UserSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
            selectedUsers: props.defaultSelected || [],
            value: '',
		}
    }

    onValueChange = e => this.setState({value: e.target.value})

    getSelectedUsersIds = () => {
        const { selectedUsers } = this.state;

        return _.map(selectedUsers, user => user.id);
    }

    addUser = user => () => {
        const { selectedUsers } = this.state;

        const newSelected = _.uniq(_.concat(selectedUsers, user));
        this.setState({selectedUsers: newSelected});
    }

    addUser = user => () => {
        const { selectedUsers } = this.state;

        const newSelected = _.uniq(_.concat(selectedUsers, user));
        this.setState({selectedUsers: newSelected});
    }

    removeUser = user => () => {
        const { selectedUsers } = this.state;

        const newSelected = _.differenceBy(selectedUsers, [user], item => item.id);
        this.setState({selectedUsers: newSelected});
    }

	render() {
        const { selectedUsers, value } = this.state;
        const { users } = this.props;

        const selectedIds = this.getSelectedUsersIds();

        const preFilteredUsers =  _.filter(users, user => !_.includes(selectedIds, user.id));
        const filteredUsers = _.filter(preFilteredUsers, user => _.includes(_.lowerCase(user.name), _.lowerCase(value)));

        return (
            <div>
                <input
                    className="user-selector-input"
                    value={value}
                    onChange={this.onValueChange}
                    placeholder={"Search for users"}
                />
                <div className="selection-container">
                    {_.map(filteredUsers, user => <div className="selection-item" onClick={this.addUser(user)}>{user.name}</div>)}
                </div>
                <div className="selected-container">
                    {_.map(selectedUsers, user => <div className="selected-item" onClick={this.removeUser(user)}>{user.name}</div>)}
                </div>
            </div>
        );
    }
}

// Map Redux state to React component props
const mapStateToProps = state => ({
    loading: state.users.loading,
    users: state.users.users,
    hasErrors: state.users.hasErrors,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchUsers: fetchUsers,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(UserSelector)