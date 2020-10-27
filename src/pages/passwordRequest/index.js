import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { requestRequestPasswordCode } from '../../redux/actions/meActions';
import EditableLabel from '../../components/EditableLabel';
import ActionButton from '../../components/ActionButton';

class PasswordRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: '',
    };
  }

  updateLogin = (e) => this.setState({ mail: e.target.value });

  requestPasswordRequest = () => {
    console.log('ALEXIS test')
    requestRequestPasswordCode(this.state.mail);
  }

  render() {
    const { mail, isLoading } = this.props;

    return (
      <div className="login-page-container">
      <div className="explication">Un mail vous sera envoyé pour réinitialiser votre mot de passe.</div>
        <EditableLabel value={mail} onChange={this.updateLogin} placeholder="Mail" isDescription={false} />
        <div className="login-btn">
          <ActionButton clickAction={this.requestPasswordRequest} label="Envoyer" isLoading={isLoading} />
        </div>
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
  requestRequestPasswordCode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PasswordRequest);
