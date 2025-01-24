import React, { Component } from "react";
import "./styles.scss";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EditableLabel from "../../../components/EditableLabel";
import ActionButton from "../../../components/ActionButton";
import UserDisplay from "../../../components/UserDisplay";
import { ReactComponent as YourSvg } from "../../../images/pencil.svg";

import { Scrollbars } from "react-custom-scrollbars";

import {
  fetchOperations,
  fetchMyOperations,
  createOperation,
  postDeleteOperation,
} from "../../../redux/actions/operationActions";

class OperationsPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: "",
    };
  }

  componentDidMount() {
    const { fetchOperations, fetchMyOperations, sessionToken, userInfos } =
      this.props;
    const isAdmin = _.get(userInfos, "status", "user") === "admin";

    if (isAdmin) {
      fetchOperations(sessionToken);
    } else {
      fetchMyOperations(_.get(userInfos, "id"), sessionToken);
    }
  }

  callDeleteOperation = (id) => () => {
    const {
      postDeleteOperation,
      fetchOperations,
      fetchMyOperations,
      sessionToken,
      userInfos,
    } = this.props;
    const isAdmin = _.get(userInfos, "status", "user") === "admin";

    postDeleteOperation(id, sessionToken).then(() => {
      if (isAdmin) {
        fetchOperations(sessionToken);
      } else {
        fetchMyOperations(_.get(userInfos, "id"), sessionToken);
      }
    });
  };

  copyToClipBoard = (id) => {
    var copyText = document.getElementById(id);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  render() {
    const { mail } = this.state;
    const {
      operations,
      towardsCreateOperationPopup,
      towardsEditOperationPopup,
      userInfos,
      isLoading,
    } = this.props;

    const isAdmin = _.get(userInfos, "status", "user") === "admin";

    const viewHeight = window.innerHeight;
    console.log({ viewHeight });

    return (
      <div className="operations-popup-container">
        <div className="title">Operations</div>
        <Scrollbars
          autoHeight
          autoHeightMin={0}
          autoHeightMax={Math.max(viewHeight * 0.75, 400)}
        >
          {_.map(operations, (operation) => (
            <div className="operation-container">
              <div className="operation-top">
                <div className="left-container">
                  <div className="operation-title">{operation.name}</div>
                  <div
                    className="edit-operation-btn"
                    onClick={towardsEditOperationPopup(
                      operation.id,
                      operation.name,
                      operation.data,
                      _.get(operation, "location", ""),
                      _.get(operation, "documents", "")
                    )}
                  >
                    <svg
                      height="18px"
                      viewBox="-15 -15 484.00019 484"
                      width="18px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m401.648438 18.234375c-24.394532-24.351563-63.898438-24.351563-88.292969 0l-22.101563 22.222656-235.269531 235.144531-.5.503907c-.121094.121093-.121094.25-.25.25-.25.375-.625.746093-.871094 1.121093 0 .125-.128906.125-.128906.25-.25.375-.371094.625-.625 1-.121094.125-.121094.246094-.246094.375-.125.375-.25.625-.378906 1 0 .121094-.121094.121094-.121094.25l-52.199219 156.96875c-1.53125 4.46875-.367187 9.417969 2.996094 12.734376 2.363282 2.332031 5.550782 3.636718 8.867188 3.625 1.355468-.023438 2.699218-.234376 3.996094-.625l156.847656-52.324219c.121094 0 .121094 0 .25-.121094.394531-.117187.773437-.285156 1.121094-.503906.097656-.011719.183593-.054688.253906-.121094.371094-.25.871094-.503906 1.246094-.753906.371093-.246094.75-.621094 1.125-.871094.125-.128906.246093-.128906.246093-.25.128907-.125.378907-.246094.503907-.5l257.371093-257.371094c24.351563-24.394531 24.351563-63.898437 0-88.289062zm-232.273438 353.148437-86.914062-86.910156 217.535156-217.535156 86.914062 86.910156zm-99.15625-63.808593 75.929688 75.925781-114.015626 37.960938zm347.664062-184.820313-13.238281 13.363282-86.917969-86.917969 13.367188-13.359375c14.621094-14.609375 38.320312-14.609375 52.945312 0l33.964844 33.964844c14.511719 14.6875 14.457032 38.332031-.121094 52.949218zm0 0" />
                    </svg>
                  </div>
                </div>
                {isAdmin && (
                  <ActionButton
                    clickAction={this.callDeleteOperation(operation.id)}
                    label="supprimer"
                    isLoading={isLoading}
                    isDanger
                  />
                )}
              </div>
              <div className="operation-data">{operation.data}</div>
              {!_.isNil(operation.documents) &&
                !_.isEmpty(operation.documents) && (
                  <>
                    <div className="operation-data">{"Documents"}</div>
                    <div className="operation-data">
                      {_.get(operation, "documents")}
                    </div>
                  </>
                )}
              <div className="link-exports">
                <div className="link-export">
                  <div
                    onClick={_.partial(
                      this.copyToClipBoard,
                      `input-${operation.id}`
                    )}
                  >
                    {"copier lien export : "}
                  </div>
                  <input
                    type="text"
                    value={`http://orchestraconseil.fr/calendarexport/${operation.id}`}
                    id={`input-${operation.id}`}
                  />
                </div>

                <div className="link-export">
                  <div
                    onClick={_.partial(
                      this.copyToClipBoard,
                      `rdv-${operation.id}`
                    )}
                  >
                    {"copier lien rdv : "}
                  </div>
                  <input
                    type="text"
                    value={`http://orchestraconseil.fr/rdv/${operation.id}`}
                    id={`rdv-${operation.id}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </Scrollbars>
        {isAdmin && (
          <ActionButton
            clickAction={towardsCreateOperationPopup}
            label="Ajouter une opération"
            isLoading={false}
          />
        )}
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchOperations,
      createOperation,
      postDeleteOperation,
      fetchMyOperations,
    },
    dispatch
  );
// Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(OperationsPopup);
