import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableLabel from '../../../components/EditableLabel';
import ActionButton from '../../../components/ActionButton';

import { requestcreateUser } from '../../../redux/actions/userActions';
import { requestAuthentication } from '../../../redux/actions/meActions';

class CreateAccountBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      login: '',
      password: '',
      phone: ''
    };
  }

    updateName = (e) => this.setState({ name: e.target.value });

    updateLogin = (e) => this.setState({ login: e.target.value });

    updatePassword = (e) => this.setState({ password: e.target.value });

    updatePhone = (e) => this.setState({ phone: e.target.value });

    sendRequest = () => {
      const { requestcreateUser, isLoading, requestAuthentication } = this.props;
      const { login, password, name, phone } = this.state;

      if (isLoading) { return; }

      requestcreateUser(login, name, password, 'user', phone).then(() => {
        
        requestAuthentication(login, password);
      });
    };

    render() {
      const { isEventsLoading, isAuthLoading } = this.props;
      const { login, password, name, phone } = this.state;

      return (
        <div className="create-account-box-container">
          <EditableLabel value={login} onChange={this.updateLogin} placeholder="Mail" isDescription={false} />
          <EditableLabel value={name} onChange={this.updateName} placeholder="Name" isDescription={false} />
          <EditableLabel value={password} onChange={this.updatePassword} placeholder="Password" isDescription={false} isPassword />
          <EditableLabel value={phone} onChange={this.updatePhone} placeholder="Telephone" isDescription={false} />
          <div className="login-btn">
            <ActionButton clickAction={this.sendRequest} label="CREATE ACCOUNT" isLoading={isEventsLoading || isAuthLoading} />
          </div>
        </div>
      );
    }
}


// Map Redux state to React component props
const mapStateToProps = (state) => ({
  sessionToken: state.me.sessionToken,
  isEventsLoading: state.events.loading,
  isAuthLoading: state.me.loading,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestcreateUser,
  requestAuthentication,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountBox);
