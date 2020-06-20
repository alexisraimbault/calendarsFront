import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableLabel from '../../../components/EditableLabel';
import ActionButton from '../../../components/ActionButton';
import UserDisplay from '../../../components/UserDisplay';

import { requestInviteUser } from '../../../redux/actions/userActions';

class InvitationPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: '',
    };
  }

    updateMail = (e) => this.setState({ mail: e.target.value });

    sendInvitation = () => {
      const { requestInviteUser, sessionToken, userInfos } = this.props;
      const { mail } = this.state;

      requestInviteUser(mail, _.get(userInfos, "corpId"), sessionToken).then(() => {
        this.setState({ mail: '' });
      });
    };

    render() {
      const { mail } = this.state;
      const { userInfos, isLoading } = this.props;

      const isAdmin = _.get(userInfos, 'status', 'user') === 'admin';

      return (
        <div className="invitation-popup-container">
          <div className="title">Users</div>
          <UserDisplay />
          {isAdmin && (
            <div className="bottom-space">
              <EditableLabel value={mail} onChange={this.updateMail} placeholder="Mail" isDescription={false} />
            </div>)}
          {isAdmin && (
              <ActionButton clickAction={this.sendInvitation} label="SEND INVITATION" isLoading={isLoading} />
            )}
        </div>
      );
    }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  isLoading: state.users.loading,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestInviteUser,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(InvitationPopup);
