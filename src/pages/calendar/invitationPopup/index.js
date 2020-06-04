import React, {
	Component
} from 'react';
import './styles.scss'

import EditableLabel from '../../../components/EditableLabel'
import ActionButton from '../../../components/ActionButton'
import UserDisplay from '../../../components/UserDisplay'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { requestInviteUser } from '../../../redux/actions/userActions'

class InvitationPopup extends Component {
	constructor(props) {
        super(props);

        this.state = {
            mail:'',
		}
    }

    updateMail = e => this.setState({mail: e.target.value})

    sendInvitation = () => {
        const { requestInviteUser, sessionToken } = this.props;
        const { mail } = this.state;

        requestInviteUser(mail, sessionToken);
    }

	render() {
        const { mail } = this.state;
        return (
            <div className="invitation-popup-container">
                <UserDisplay />
                <EditableLabel value={mail} onChange={this.updateMail} placeholder={"Mail"} isDescription={false} />
                <ActionButton clickAction={this.sendInvitation} label={"SEND INVITATION"} />
            </div>
        );
    }
}

// Map Redux state to React component props
const mapStateToProps = state => ({
    sessionToken: state.me.sessionToken,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    requestInviteUser: requestInviteUser,
}, dispatch);
    // Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(InvitationPopup)