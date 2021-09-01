import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { PowerOff } from "styled-icons/fa-solid/PowerOff";
import InputGroup from "../inputs/InputGroup";
import BooleanInput from "../inputs/BooleanInput";
import ColorInput from "../inputs/ColorInput";
import StringInput from "../inputs/StringInput";
import NumericInput from "../inputs/NumericInput";

export default class TextCubeNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = PowerOff;

  static description = "A cube for 3D mindmaps.\n";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }


  onChangeFrontText = frontText => {
    this.props.editor.setPropertiesSelected({ frontText });
  };

  onChangeBackText = backText => {
    this.props.editor.setPropertiesSelected({ backText });
  };

  onChangeRightText = rightText => {
    this.props.editor.setPropertiesSelected({ rightText });
  };

  onChangeLeftText = leftText => {
    this.props.editor.setPropertiesSelected({ leftText });
  };

  onChangeTopText = topText => {
    this.props.editor.setPropertiesSelected({ topText });
  };

  onChangeBottomText = bottomText => {
    this.props.editor.setPropertiesSelected({ bottomText });
  };

  onChangeTopBottom = topBottom => {
    this.props.editor.setPropertiesSelected({ topBottom });
  };

  onChangeBoxColor = boxColor => {
    this.props.editor.setPropertySelected("boxColor", boxColor);
  };

  onChangeTextColor = textColor => {
    this.props.editor.setPropertiesSelected("textColor", textColor);
  };

  onChangeTextScale = textScale => {
    this.props.editor.setPropertiesSelected({ textScale });
  }

  componentDidMount() {
    const options = [];

    const sceneNode = this.props.editor.scene;

    sceneNode.traverse(o => {
      if (o.isNode && o !== sceneNode) {
        options.push({ label: o.name, value: o.uuid, nodeName: o.nodeName });
      }
    });

    this.setState({ options });
  }

  render() {
    const { node, multiEdit } = this.props;

    return (
      <NodeEditor description={TextCubeNodeEditor.description} {...this.props}>
        <InputGroup name="Front Text" info="This text will be displayed on the front side.">
          <StringInput value={node.frontText} onChange={this.onChangeFrontText}></StringInput>
        </InputGroup>
        <InputGroup name="Back Text" info="This text will be displayed on the back side.">
          <StringInput value={node.backText} onChange={this.onChangeBackText}></StringInput>
        </InputGroup>
        <InputGroup name="Right Text" info="This text will be displayed on the right side.">
          <StringInput value={node.rightText} onChange={this.onChangeRightText}></StringInput>
        </InputGroup>
        <InputGroup name="Left Text" info="This text will be displayed on the left side.">
          <StringInput value={node.leftText} onChange={this.onChangeLeftText}></StringInput>
        </InputGroup>
        {node.topBottom === true && (
          <>
            <InputGroup name="Top Text" info="This text will be displayed on the top side.">
              <StringInput value={node.topText} onChange={this.onChangeTopText}></StringInput>
            </InputGroup>
            <InputGroup name="Bottom Text" info="This text will be displayed on the bottom side.">
              <StringInput value={node.bottomText} onChange={this.onChangeBottomText}></StringInput>
            </InputGroup>
          </>
        )}
        <InputGroup name="Top/Bottom Text"
          info="Decide fit this cube will show text on the top and bottom side.">
          <BooleanInput value={node.topBottom} onChange={this.onChangeTopBottom} />
        </InputGroup>
        <InputGroup name="Cube Color">
          <ColorInput value={node.boxColor} onChange={this.onChangeBoxColor} />
        </InputGroup>
        <InputGroup name="Text Color">
          <ColorInput value={node.textColor} onChange={this.onChangeTextColor} />
        </InputGroup>
        <InputGroup
          name="Text Scale"
          info="Text Scale">
          <NumericInput
            min={1}
            smallStep={1}
            mediumStep={4}
            largeStep={8}
            value={node.textScale}
            onChange={this.onChangeTextScale} />
        </InputGroup>
      </NodeEditor>
    );
  }
}