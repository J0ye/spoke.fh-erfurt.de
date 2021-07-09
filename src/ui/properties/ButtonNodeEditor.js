import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { Download } from "styled-icons/fa-solid/Download";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import StringInput from "../inputs/StringInput";
import { ButtonType } from "../../editor/nodes/ButtonNode";

const ButtonTypeOptions = [
  { label: "Megaphone", value: ButtonType.MEGAPHONE },
  { label: "Teleport", value: ButtonType.TELEPORT },
  { label: "Visibility", value: ButtonType.VISIBILITY },
  { label: "Change Room", value: ButtonType.ROOM }
];

export default class ButtonNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = Download;

  static description = "A button to trigger actions.\n";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }


  onChangeButtonType = buttonType => {
    this.props.editor.setPropertiesSelected({ buttonType });
  };

  onChangeButtonLabel = buttonLabel => {
    this.props.editor.setPropertiesSelected({ buttonLabel });
  };

  onChangeTarget = target => {
    this.props.editor.setPropertiesSelected({ target });
    let targetName;
    for (let i = 0; i < this.state.options.length; i++) {
      if (this.state.options[i].value === target) {
        targetName = this.state.options[i].label;
        console.log("Target: ", targetName);
      }
    }
    this.props.editor.setPropertiesSelected({ targetName });
  };

  onChangeSwitchActive = switchActive => {
    this.props.editor.setPropertiesSelected({ switchActive });
  };

  onChangeIsSwitchButton = isSwitchButton => {
    this.props.editor.setPropertiesSelected({ isSwitchButton });
  };

  onChangeButtonStatus = buttonStatus => {
    this.props.editor.setPropertiesSelected({ buttonStatus });
  };

  onChangeRoomURL = newRoomUrl => {
    this.props.editor.setPropertiesSelected({ newRoomUrl });
    console.log("URL is:", newRoomUrl);
  };

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

    const targetOption = this.state.options.find(o => o.value === node.target);
    const target = targetOption ? targetOption.value : null;
    const targetNotFound = node.target && target === null;

    return (
      <NodeEditor description={ButtonNodeEditor.description} {...this.props}>
        <InputGroup name="Button Label" info="This text will be displayed on the button later.">
          <StringInput value={node.buttonLabel} onChange={this.onChangeButtonLabel}></StringInput>
        </InputGroup>
        <InputGroup name="Flip Switch"
          info="The button will be turned into a switch, if it is marked as an flip switch.">
          <BooleanInput value={node.isSwitchButton} onChange={this.onChangeIsSwitchButton} />
        </InputGroup>
        {node.isSwitchButton === true && (
          <InputGroup name="Switch Status"
            info="Determine the state of the switch at start">
            <BooleanInput value={node.buttonStatus} onChange={this.onChangeButtonStatus} />
          </InputGroup>
        )}
        <InputGroup name="Button Type" info="Define the action of this button">
          <SelectInput options={ButtonTypeOptions} value={node.buttonType} onChange={this.onChangeButtonType} />
        </InputGroup>
        {node.buttonType === ButtonType.ROOM && (
          <InputGroup
            name="Target Room URL"
            info="Define the URL of the target room this button is supposed to change to.">
            <StringInput value={node.newRoomUrl} required={true} onChange={this.onChangeRoomURL} />
          </InputGroup>
        )}
        {node.buttonType !== ButtonType.MEGAPHONE && node.buttonType !== ButtonType.ROOM && (
          // do not ask for a target if it is a megphone trigger
          <>
            <InputGroup name="Target">
              <SelectInput
                error={targetNotFound}
                placeholder={targetNotFound ? "Error missing node." : "Select node..."}
                value={node.target}
                onChange={this.onChangeTarget}
                options={this.state.options}
                disabled={multiEdit}
              />
            </InputGroup>
            {node.ButtonType === ButtonType.VISIBILITY && (
              // only ask for a switch, if the trigger type is a switch object active type 
              <>
                <InputGroup name="New state of target"
                  info="The state of the target will be set to either active (true) or inactive (false), when the button is pressed.">
                  <BooleanInput value={node.switchActive} onChange={this.onChangeSwitchActive} />
                </InputGroup>
              </>
            )}
          </>
        )}
      </NodeEditor>
    );
  }
}