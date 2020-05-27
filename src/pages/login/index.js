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
    
    createAccount = () => this.setState({createAccoundMode: true})

    navigateToCalendar = () => {
        this.props.history.push(`/calendar`);
    }

	render() {
        const { sessionToken } = this.props;
        const { createAccoundMode } = this.state;

        return (
            <div>
                {createAccoundMode ?
                    <CreateAccountBox /> 
                : 
                    <LoginBox />
                }
                {/* {_.isNil(sessionToken) && ( */}
                <div onClick={this.createAccount}>{"Not user yet ? Create account !"}</div>
                {/* )} */}
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