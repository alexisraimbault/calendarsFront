import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import EditableLabel from '../../components/EditableLabel';
import ActionButton from '../../components/ActionButton';
import { requestChangePassword } from '../../redux/actions/meActions';

class PasswordChange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: '',
      password: '',
    };
  }

  updateLogin = (e) => this.setState({ mail: e.target.value });

  updatePassword = (e) => this.setState({ password: e.target.value });

  updatePasswordRequest = () => {
    const { mail, password } = this.state;
    const { match } = this.props;

    requestChangePassword(mail, match.params.code, password);
  }

  towardsLogin = () => {
    this.props.history.push('/login');
  }

  render() {
    const { isLoading } = this.props;
    const { mail, password } = this.state;

    return (
      <div className="pass-page-container">
        <dic className="explication">Choisir votre nouveau mot de passe.</dic>
        <EditableLabel value={mail} onChange={this.updateLogin} placeholder="Mail" isDescription={false} />
        <EditableLabel value={password} onChange={this.updatePassword} placeholder="Password" isDescription={false} isPassword />
        <div className="login-btn">
          <ActionButton clickAction={this.updatePasswordRequest} label="Enregistrer" isLoading={isLoading} />
        </div>
        <div className="login-link" onClick={this.towardsLogin}>Me connecter</div>
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  sessionToken: state.me.sessionToken,
  isLoading: state.me.loading,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestChangePassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange);
