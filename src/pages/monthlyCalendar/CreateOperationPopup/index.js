import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableLabel from '../../../components/EditableLabel';
import ActionButton from '../../../components/ActionButton';

import { fetchOperations, createOperation, deleteOperation } from '../../../redux/actions/operationActions';

class CreateOperationPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      data: '',
      location: '',
      documents: '',
    };
  }

  createOperation = () => {
    const { createOperation, sessionToken, towardsOperationPopup } = this.props;
    const { name, data, documents, location } = this.state;

    createOperation(name, data, _.isEmpty(documents) ? '-' : documents, location, sessionToken).then(() => {
      towardsOperationPopup();
    });
  }

  updateName = (e) => this.setState({ name: e.target.value });
  updateData = (e) => this.setState({ data: e.target.value });
  updateLocation = (e) => this.setState({ location: e.target.value });
  updateDocuments = (e) => this.setState({ documents: e.target.value });

  render() {
    const { name, data, location, documents } = this.state;
    const { isLoading, userInfos } = this.props;

    const isAdmin = _.get(userInfos, 'status', 'user') === 'admin';

    return (
      <div className="invitation-popup-container">
        <div className="title">Nouvelle opération</div>
        <div className="bottom-space">
          <EditableLabel value={name} onChange={this.updateName} placeholder="nom de l'opération" isDescription={false} />
          <EditableLabel value={data} onChange={this.updateData} placeholder="description (liens drive, codes KALITI, infos d'accès, ...)" isDescription={true} />
          <EditableLabel value={documents} onChange={this.updateDocuments} placeholder="documents" isDescription={true} />
          <EditableLabel value={location} onChange={this.updateLocation} placeholder="Lieu de rdv" />
        </div>
          <ActionButton clickAction={this.createOperation} label="Créer l'opération" isLoading={isLoading} />
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
  fetchOperations, createOperation, deleteOperation,
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(CreateOperationPopup);
