import React, {
  Component,
} from 'react';
import './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableLabel from '../../../components/EditableLabel';
import ActionButton from '../../../components/ActionButton';

import { fetchUpdateOperationTotal, fetchOperations } from '../../../redux/actions/operationActions';

class OperationTotalsDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveTotal1: props.total1,
      saveTotal2: props.total2,
      total1: props.total1,
      total2: props.total2,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(prevState.saveTotal1 !== nextProps.total1 || prevState.saveTotal2 !== nextProps.total2) {
      return {
        saveTotal1: nextProps.total1,
        saveTotal2: nextProps.total2,
        total1: nextProps.total1,
        total2: nextProps.total2,
      };
    }
    
    return;
  }

  setTotal1 = data => this.setState({total1: data.target.value})

  setTotal2 = data => this.setState({total2: data.target.value})

  onUpdateTotal1 = () => {
    const { id, fetchUpdateOperationTotal, fetchDate, sessionToken, fetchOperations } = this.props;
    const { total1 } = this.state;

    fetchUpdateOperationTotal(sessionToken, 'total1', fetchDate, id, total1).then(() => {
      fetchOperations(sessionToken);
    });

  }

  onUpdateTotal2 = () => {
    const { id, fetchUpdateOperationTotal, fetchDate, sessionToken, fetchOperations } = this.props;
    const { total2 } = this.state;

    fetchUpdateOperationTotal(sessionToken, 'total2', fetchDate, id, total2).then(() => {
      fetchOperations(sessionToken);
    });
  }

  updateTotals = () => {
    const { total1, total2 } = this.state;

    if( this.props.total1 !== total1) {
      this.onUpdateTotal1();
    }
    
    if( this.props.total2 !== total2) {
      this.onUpdateTotal2();
    }
  }

  render() {
    const { total1, total2 } = this.state;
    const { name, isLoading } = this.props;

    const hasBeenEdited = this.props.total1 !== total1 || this.props.total2 !== total2;

    return (
      <div className="operation-totals-container">
        <div className="name-container">{name}</div>
        <div className="total-container">
          <EditableLabel value={total1} onChange={this.setTotal1} placeholder="Total 1" isDescription={false} />
        </div>
        <div className="total-container">
          <EditableLabel value={total2} onChange={this.setTotal2} placeholder="Total 2" isDescription={false} />
        </div>
        {hasBeenEdited && (
          <div className="btn-container">
            <ActionButton clickAction={this.updateTotals} label={"Save"} isLoading={isLoading}/>
          </div>
        )}
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUpdateOperationTotal, fetchOperations
}, dispatch);
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(OperationTotalsDisplay);
