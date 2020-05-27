import React, {
	Component
} from 'react';
import './styles.scss'

import EditableLabel from '../../../components/EditableLabel'
import ActionButton from '../../../components/ActionButton'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { requestAuthentication } from '../../../redux/actions/meActions'

class LoginBox extends Component {
	constructor(props) {
        super(props);

        this.state = {
            login:'',
            password: '',
		}
    }

    updateLogin = e => this.setState({login: e.target.value})

    updatePassword = e => this.setState({password: e.target.value})

    sendAuthRequest = () => {
        const { requestAuthentication } = this.props;
        const { login, password } = this.state;

        requestAuthentication(login, password);
    }

	render() {
        const { login, password } = this.state;
        return (
            <div className="login-box-container">
                <EditableLabel value={login} onChange={this.updateLogin} placeholder={"Mail"} />
                <EditableLabel value={password} onChange={this.updatePassword} placeholder={"Password"} />
                <ActionButton clickAction={this.sendAuthRequest} label={"LOGIN"} />
            </div>
        );
    }

}


// Map Redux state to React component props
const mapStateToProps = state => ({
    sessionToken: state.me.sessionToken,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    requestAuthentication: requestAuthentication,
}, dispatch);
    // Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(LoginBox)