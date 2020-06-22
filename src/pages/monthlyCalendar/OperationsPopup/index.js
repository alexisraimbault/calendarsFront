import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableLabel from '../../../components/EditableLabel';
import ActionButton from '../../../components/ActionButton';
import UserDisplay from '../../../components/UserDisplay';

import { Scrollbars } from 'react-custom-scrollbars';

import { fetchOperations, createOperation, postDeleteOperation } from '../../../redux/actions/operationActions';

class OperationsPopup extends Component {
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

  callDeleteOperation = id => () => {
    const { postDeleteOperation, fetchOperations, sessionToken } = this.props;

    postDeleteOperation(id, sessionToken).then(() => {
      fetchOperations(sessionToken);
    });
  }

  render() {
    const { mail } = this.state;
    const { operations, towardsCreateOperationPopup, userInfos, isLoading } = this.props;

    const isAdmin = _.get(userInfos, 'status', 'user') === 'admin';

    return (
      <div className="invitation-popup-container">
        <div className="title">Operations</div>
        <Scrollbars
          autoHeight
          autoHeightMin={0}
          autoHeightMax={200}
        >
          {_.map(operations, operation => (
            <div className="operation-container">
              <div className="operation-title">{operation.name}</div>
              <div className="operation-data">{operation.data}</div>
              <ActionButton clickAction={this.callDeleteOperation(operation.id)} label="supprimer" isLoading={isLoading} isDanger/>
            </div>
          ))}
        </Scrollbars>
        <ActionButton clickAction={towardsCreateOperationPopup} label="Ajouter une opération" isLoading={false} />
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
export default connect(mapStateToProps, mapDispatchToProps)(OperationsPopup);
