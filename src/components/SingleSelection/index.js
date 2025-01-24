import React, { Component } from "react";
import classNames from "classnames";
import "./styles.scss";

export default class SingleSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledKey: props.defaultToggledKey,
    };
  }

  setToggle = (key) => {
    const { applyKey, id } = this.props;
    const { toggledKey } = this.state;
    const newKey = `${key}/${_.get(_.split(toggledKey, "/"), "[1]", "nca")}`;
    this.setState({ toggledKey: newKey }, () => {
      applyKey(id, newKey);
    });
  };

  setIsca = (isca) => {
    const { applyKey, id } = this.props;
    const { toggledKey } = this.state;
    const newKey = `${_.split(toggledKey, "/")[0]}/${isca ? "ca" : "nca"}`;
    this.setState({ toggledKey: newKey }, () => {
      applyKey(id, newKey);
    });
  };

  render() {
    const { toggledKey } = this.state;
    const { keyValues, showLabels, name } = this.props;

    const white = "#ffffff";
    const black = "#000000";
    const blue = _.isEmpty(this?.props?.color) ? "#43d8c9" : this?.props?.color;

    const isca = _.isEqual(_.get(_.split(toggledKey, "/"), "[1]", "nca"), "ca");

    return (
      <div className="single-selection">
        <div className="labels">
          {showLabels &&
            _.map(keyValues, (keyValue) => (
              <div className="value-label">{keyValue.value}</div>
            ))}
          {showLabels && <div className="value-label">{"C/A"}</div>}
        </div>
        <div className="boxes">
          <div className="name">{name}</div>
          {_.map(keyValues, (keyValue) => {
            const isToggled = _.isEqual(
              _.split(toggledKey, "/")[0],
              keyValue.key
            );

            const sidebarClass = classNames({
              "sidebar-container": true,
              "sidebar-container--toggled": isToggled,
            });

            const sidebarLabelClass = classNames({
              "sidebar-item-label": true,
              "sidebar-item-label--toggled": isToggled,
            });
            return (
              <div
                className="checkbox"
                onClick={_.partial(this.setToggle, keyValue.key)}
              >
                <svg viewBox="0 0 512 512" width="20" height="20">
                  <path
                    d="m512 58.667969c0-32.363281-26.304688-58.667969-58.667969-58.667969h-394.664062c-32.363281
                              0-58.667969 26.304688-58.667969 58.667969v394.664062c0 32.363281 26.304688 58.667969 58.667969
                              58.667969h394.664062c32.363281 0 58.667969-26.304688 58.667969-58.667969zm0 0"
                    fill={blue}
                  />
                  <path
                    d="m385.75 171.585938c8.339844 8.339843 8.339844 21.820312 0 30.164062l-138.667969 138.664062c-4.160156
                              4.160157-9.621093 6.253907-15.082031 6.253907s-10.921875-2.09375-15.082031-6.253907l-69.332031-69.332031c-8.34375-8.339843-8.34375-21.824219
                              0-30.164062 8.339843-8.34375 21.820312-8.34375 30.164062 0l54.25 54.25 123.585938-123.582031c8.339843-8.34375 21.820312-8.34375 30.164062 0zm0 0"
                    fill={isToggled ? black : blue}
                  />
                </svg>
              </div>
            );
          })}
          <div className="checkbox" onClick={_.partial(this.setIsca, !isca)}>
            <svg viewBox="0 0 512 512" width="20" height="20">
              <path
                d="m512 58.667969c0-32.363281-26.304688-58.667969-58.667969-58.667969h-394.664062c-32.363281
                              0-58.667969 26.304688-58.667969 58.667969v394.664062c0 32.363281 26.304688 58.667969 58.667969
                              58.667969h394.664062c32.363281 0 58.667969-26.304688 58.667969-58.667969zm0 0"
                fill={blue}
              />
              <path
                d="m385.75 171.585938c8.339844 8.339843 8.339844 21.820312 0 30.164062l-138.667969 138.664062c-4.160156
                              4.160157-9.621093 6.253907-15.082031 6.253907s-10.921875-2.09375-15.082031-6.253907l-69.332031-69.332031c-8.34375-8.339843-8.34375-21.824219
                              0-30.164062 8.339843-8.34375 21.820312-8.34375 30.164062 0l54.25 54.25 123.585938-123.582031c8.339843-8.34375 21.820312-8.34375 30.164062 0zm0 0"
                fill={isca ? black : blue}
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
