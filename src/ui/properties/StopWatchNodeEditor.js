import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { Stopwatch } from "styled-icons/fa-solid/Stopwatch";
export default class ButtonNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = Stopwatch;

  static description = "A placeholder for a stopwatch.\n";

  render() {
    return (
      <NodeEditor description={ButtonNodeEditor.description} {...this.props}>
      </NodeEditor>
    );
  }
}