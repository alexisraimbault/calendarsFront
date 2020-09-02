import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableLabel from '../../../components/EditableLabel';
import ActionButton from '../../../components/ActionButton';
import UserDisplay from '../../../components/UserDisplay';
import { ReactComponent as YourSvg } from '../../../images/pencil.svg';

import { Scrollbars } from 'react-custom-scrollbars';

import { fetchOperations, createOperation, postDeleteOperation } from '../../../redux/actions/operationActions';

class RdvSettingsPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: '',
    };
  }

  componentDidMount() {
    const { fetchOperations, sessionToken } = this.props;

    fetchOperations(sessionToken);
  }

  render() {
    const { mail } = this.state;
    const { operations, towardsRdvSettingsPage } = this.props;

    return (
      <div className="rdv-settings-popup-container">
        <div className="title">Choisir l'opération ...</div>
        <Scrollbars
          autoHeight
          autoHeightMin={0}
          autoHeightMax={400}
        >
          {_.map(operations, operation => (
            <div className="operation-container" onClick={_.partial(towardsRdvSettingsPage, operation.id)}>
              <div className="operation-top">
                <div className="left-container">
                  <div className="operation-title">{operation.name}</div>
                </div>
              </div>
            </div>
          ))}
        </Scrollbars>
        {/* {isAdmin && (
          <div className="bottom-space">
            <EditableLabel value={mail} onChange={this.updateMail} placeholder="Mail" isDescription={false} />
          </div>)}
        {isAdmin && (
            <ActionButton clickAction={this.sendInvitation} label="SEND INVITATION" isLoading={isLoading} />
          )} */}
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  isLoading: state.operations.loading,
  operations: state.operations.operations,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOperations, createOperation, postDeleteOperation,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(RdvSettingsPopup);
