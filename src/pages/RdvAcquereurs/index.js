import React, { Component } from "react";

import _ from "lodash";
import classNames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./styles.scss";
import { fetchEvents, fetchAmoEvents } from "../../redux/actions/eventActions";
import { fetchOperations } from "../../redux/actions/operationActions";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

class RdvAcquereurs extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
  sessionToken: state.me.sessionToken,
  userInfos: state.me.infos,
  operations: state.operations.operations,
  isOperationsLoading: state.operations.loading,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchOperations,
      fetchEvents,
      fetchAmoEvents,
    },
    dispatch
  );
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(RdvAcquereurs);
