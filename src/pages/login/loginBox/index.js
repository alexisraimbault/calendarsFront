import React, {
	Component
} from 'react';
import './styles.scss'

import EditableLabel from '../../../components/EditableLabel'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { requestAuthentication } from '../../../redux/actions/meActions'

class LoginBox extends Component {
	constructor(props) {
        super(props);

        this.state = {
		}
    }

    componentDidMount() {
        this.sendAuthRequest();
    }

    sendAuthRequest = () => {
        const { requestAuthentication } = this.props;

        requestAuthentication("ledizzz11@gmail.com", "Iraite,111*");
    }

	render() {
        return (
            <div className="login-box-container">
                {"hello from login box"}
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