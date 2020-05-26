import React, {
	Component
} from 'react';
import './styles.scss'

import LoginBox from './loginBox'
import { connect } from 'react-redux'
import _ from 'lodash';

class LoginPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
		}
    }

    navigateToCalendar = () => {
        this.props.history.push(`/calendar`);
    }

	render() {
        const { sessionToken } = this.props;

        return (
            <div>
                {_.isNil(sessionToken) ? 
                <div>{"Authenticating..."}<LoginBox /></div>
                :
                <div onClick={this.navigateToCalendar}>{"Authenticated ! go to calendars"}</div>}
            </div>
        );
    }
}

// Map Redux state to React component props
const mapStateToProps = state => ({
    sessionToken: state.me.sessionToken,
})

export default connect(mapStateToProps)(LoginPage)