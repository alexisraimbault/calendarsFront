import React, {
	Component
} from 'react';
import './styles.scss'
import _ from 'lodash';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../../redux/actions/userActions'

class UserDisplay extends Component {

    componentDidMount() {
        const { fetchUsers, sessionToken } = this.props;

        fetchUsers(sessionToken);
    }

	render() {
        const { users } = this.props;

        return (
            <div className="users-container">
                {_.map(users, user => <div className="user-item" >{user.name}</div>)}
            </div>
        );
    }
}

// Map Redux state to React component props
const mapStateToProps = state => ({
    loading: state.users.loading,
    users: state.users.users,
    hasErrors: state.users.hasErrors,
    sessionToken: state.me.sessionToken,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchUsers: fetchUsers,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(UserDisplay)