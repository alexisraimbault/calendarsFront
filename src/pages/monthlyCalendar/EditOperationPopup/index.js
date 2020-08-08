import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableLabel from '../../../components/EditableLabel';
import ActionButton from '../../../components/ActionButton';

import { fetchOperations, createOperation, deleteOperation, callUpdateOperation } from '../../../redux/actions/operationActions';

class EditOperationPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data || '',
    };
  }

  updateOperation = () => {
    const { callUpdateOperation, sessionToken, towardsOperationPopup, id } = this.props;
    const { data } = this.state;

    callUpdateOperation(id, data, sessionToken).then(() => {
      towardsOperationPopup();
    });
  }

  updateData = (e) => this.setState({ data: e.target.value });

  render() {
    const {  data } = this.state;
    const { isLoading, userInfos, name } = this.props;

    const isAdmin = _.get(userInfos, 'status', 'user') === 'admin';

    return (
      <div className="invitation-popup-container">
        <div className="title">Edit opération</div>
        <div className="bottom-space">
          <div className="operation-title">{name}</div>
          <EditableLabel value={data} onChange={this.updateData} placeholder="description (liens drive, codes KALITI, infos d'accès, ...)" isDescription={true} />
        </div>
          <ActionButton clickAction={this.updateOperation} label="Sauvegarder" isLoading={isLoading} />
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  isLoading: state.operations.loading,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOperations, createOperation, deleteOperation, callUpdateOperation,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(EditOperationPopup);
