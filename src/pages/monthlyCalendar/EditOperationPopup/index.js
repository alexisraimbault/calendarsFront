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
      name: props.name || '',
      documents: props.documents || '',
    };
  }

  updateOperation = () => {
    const { callUpdateOperation, sessionToken, towardsOperationPopup, id } = this.props;
    const { data, location, name, documents } = this.state;

    callUpdateOperation(id, data, _.isEmpty(documents) ? '-' : documents, location, name, sessionToken).then(() => {
      towardsOperationPopup();
    });
  }

  updateName = (e) => this.setState({ name: e.target.value });

  updateData = (e) => this.setState({ data: e.target.value });

  updateLocation = (e) => this.setState({ location: e.target.value });

  updateDocuments = (e) => this.setState({ documents: e.target.value });

  render() {
    const {  data, location, name, documents } = this.state;
    const { isLoading, userInfos } = this.props;

    const isAdmin = _.get(userInfos, 'status', 'user') === 'admin';

    return (
      <div className="invitation-popup-container">
        <div className="title">Edit opération</div>
        <div className="bottom-space">
        <EditableLabel value={name} onChange={this.updateName} placeholder="Nom de l'opération" />
          <EditableLabel value={data} onChange={this.updateData} placeholder="description (liens drive, codes KALITI, infos d'accès, ...)" isDescription={true} />
          <EditableLabel value={documents} onChange={this.updateDocuments} placeholder="documents" isDescription={true} />
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
