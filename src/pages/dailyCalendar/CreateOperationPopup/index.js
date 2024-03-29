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
    };
  }

  createOperation = () => {
    const { createOperation, sessionToken, towardsOperationPopup } = this.props;
    const { name, data } = this.state;

    createOperation(name, data, sessionToken).then(() => {
      towardsOperationPopup();
    });
  }

  updateName = (e) => this.setState({ name: e.target.value });
  updateData = (e) => this.setState({ data: e.target.value });

  render() {
    const { name, data } = this.state;
    const { isLoading, userInfos } = this.props;

    const isAdmin = _.get(userInfos, 'status', 'user') === 'admin';

    return (
      <div className="invitation-popup-container">
        <div className="title">Nouvelle opération</div>
        <div className="bottom-space">
          <EditableLabel value={name} onChange={this.updateName} placeholder="nom de l'opération" isDescription={false} />
          <EditableLabel value={data} onChange={this.updateData} placeholder="description (liens drive, codes KALITI, infos d'accès, ...)" isDescription={true} />
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
