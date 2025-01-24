import React, { Component } from "react";
import "./styles.scss";
import { Scrollbars } from "react-custom-scrollbars";

class OperationCard extends Component {
  generateRGBAFromHex = (hex, a) => {
    return (
      "rgba(" +
      parseInt(hex?.substring(1, 3) || "dd", 16) +
      "," +
      parseInt(hex?.substring(3, 5) || "dd", 16) +
      "," +
      parseInt(hex?.substring(5, 7) || "dd", 16) +
      "," +
      a +
      ")"
    );
  };

  render() {
    const { amos } = this.props;

    const operation = this.props?.operation || {
      color: "",
      data: "",
      documents: "",
      name: "",
    };
    const { color, data, documents, name } = operation;

    return (
      <div
        className="operation-card-container"
        style={{ backgroundColor: this.generateRGBAFromHex(color, 0.3) }}
      >
        <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={260}>
          <div className="op-card-title">{name}</div>
          <div className="op-card-desc">{data}</div>
          <div className="op-card-desc">{documents}</div>
          <div className="op-card-amos">
            {_.map(amos, (amo) => (
              <div className="op-card-amo">
                <b>{amo?.name}</b>
                {` : ${
                  _.get(amo, "phone", "pas de téléphone renseigné") ||
                  "Pas de téléphone renseigné"
                }`}
              </div>
            ))}
          </div>
        </Scrollbars>
      </div>
    );
  }
}

export default OperationCard;
