import React, {
	Component
} from 'react';
import './styles.scss'

import EditableLabel from '../../../components/EditableLabel'
import ActionButton from '../../../components/ActionButton'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { requestcreateUser } from '../../../redux/actions/userActions'

class CreateAccountBox extends Component {
	constructor(props) {
        super(props);

        this.state = {
            name: '',
            login:'',
            password: '',
		}
    }

    updateName = e => this.setState({name: e.target.value})

    updateLogin = e => this.setState({login: e.target.value})

    updatePassword = e => this.setState({password: e.target.value})

    sendRequest = () => {
        const { requestcreateUser } = this.props;
        const { login, password, name } = this.state;

        requestcreateUser(login, name, password, "user", 1 )//TODO unmock corp_id
    }

	render() {
        const { login, password, name } = this.state;
        return (
            <div className="create-account-box-container">
                <EditableLabel value={login} onChange={this.updateLogin} placeholder={"Mail"} />
                <EditableLabel value={name} onChange={this.updateName} placeholder={"Name"} />
                <EditableLabel value={password} onChange={this.updatePassword} placeholder={"Password"} />
                <div className="login-btn">
                    <ActionButton clickAction={this.sendRequest} label={"CREATE ACCOUNT"} />
                </div>
            </div>
        );
    }

}


// Map Redux state to React component props
const mapStateToProps = state => ({
    sessionToken: state.me.sessionToken,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    requestcreateUser: requestcreateUser,
}, dispatch);
    // Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountBox)