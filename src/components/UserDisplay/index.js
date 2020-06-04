import React, {
	Component
} from 'react';
import './styles.scss'
import _ from 'lodash';
import classNames from 'classnames';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchUsers, requestUpdateUserStatus } from '../../redux/actions/userActions'

import { Scrollbars } from 'react-custom-scrollbars';

class UserDisplay extends Component {

    componentDidMount() {
        const { fetchUsers, sessionToken, userInfos } = this.props;

        fetchUsers(_.get(userInfos, "corpId"), sessionToken);
    }

    updateStatus = (userId, status) => () => {
        const { sessionToken, fetchUsers, requestUpdateUserStatus, userInfos } = this.props;

        requestUpdateUserStatus(userId, status, sessionToken).then( () => {
            fetchUsers(_.get(userInfos, "corpId"), sessionToken);
        });
    }

	render() {
        const { users } = this.props;

        return (
            <Scrollbars
                autoHeight
                autoHeightMin={0}
                autoHeightMax={200}
            >
                <div className="users-container">
                    {_.map(_.orderBy(users, 'name'), user => {
                        const adminClass = classNames({
                            "status-container": true,
                            "status-container--toggled": user.status === "admin",
                        });

                        const userClass = classNames({
                            "status-container": true,
                            "status-container--toggled": user.status === "user",
                        });
                
                        return(<div className="user-item" >
                            {user.name}
                            <div className="status-selector-container">
                                <div className={adminClass} onClick={this.updateStatus(user.id, "admin")}>{"ADMIN"}</div>
                                <div className={userClass} onClick={this.updateStatus(user.id, "user")}>{"USER"}</div>
                            </div>
                            </div>)})}
                </div>
            </Scrollbars>
        );
    }
}

// Map Redux state to React component props
const mapStateToProps = state => ({
    loading: state.users.loading,
    users: state.users.users,
    hasErrors: state.users.hasErrors,
    sessionToken: state.me.sessionToken,
    userInfos: state.me.infos,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchUsers: fetchUsers,
    requestUpdateUserStatus: requestUpdateUserStatus,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(UserDisplay)