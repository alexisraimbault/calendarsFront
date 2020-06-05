import React, {
	Component
} from 'react';
import './styles.scss'

import LoginBox from './loginBox'
import CreateAccountBox from './createAccountBox'
import { connect } from 'react-redux'
import _ from 'lodash';

class LoginPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            createAccoundMode: false,
		}
    }

    componentDidMount() {
        const { history, sessionToken } = this.props;

        if(!_.isNil(sessionToken)) {
            history.push("/calendar");
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { history, sessionToken } = this.props;

        if(!_.isNil(sessionToken)) {
            history.push("/calendar");
        }
    }
    
    createAccount = () => this.setState({createAccoundMode: true})

    login = () => this.setState({createAccoundMode: false})

    navigateToCalendar = () => {
        this.props.history.push(`/calendar`);
    }

	render() {
        const { sessionToken } = this.props;
        const { createAccoundMode } = this.state;

        return (
            <div className="login-page-container">
                {createAccoundMode ?
                    <CreateAccountBox /> 
                : 
                    <LoginBox />
                }
                {createAccoundMode ?
                    <div className="login-link" onClick={this.login}>{"Already have an account ? Login !"}</div>
                :
                    <div className="login-link" onClick={this.createAccount}>{"Not user yet ? Create account !"}</div>
                }
                {!_.isNil(sessionToken) && <div onClick={this.navigateToCalendar}>{"Authenticated ! go to calendars"}</div>}
            </div>
        );
    }
}

// Map Redux state to React component props
const mapStateToProps = state => ({
    sessionToken: state.me.sessionToken,
})

export default connect(mapStateToProps)(LoginPage)