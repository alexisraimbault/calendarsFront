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
      location: props.location || '',
    };
  }

  updateOperation = () => {
    const { callUpdateOperation, sessionToken, towardsOperationPopup, id } = this.props;
    const { data, location } = this.state;

    callUpdateOperation(id, data, location, sessionToken).then(() => {
      towardsOperationPopup();
    });
  }

  updateData = (e) => this.setState({ data: e.target.value });

  updateLocation = (e) => this.setState({ location: e.target.value });

  render() {
    const {  data, location } = this.state;
    const { isLoading, userInfos, name } = this.props;

    const isAdmin = _.get(userInfos, 'status', 'user') === 'admin';

    return (
      <div className="invitation-popup-container">
        <div className="title">Edit opération</div>
        <div className="bottom-space">
          <div className="operation-title">{name}</div>
          <EditableLabel value={data} onChange={this.updateData} placeholder="description (liens drive, codes KALITI, infos d'accès, ...)" isDescription={true} />
          <EditableLabel value={location} onChange={this.updateLocation} placeholder="Lieu de rdv" />
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
