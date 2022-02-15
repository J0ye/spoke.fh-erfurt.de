import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { Lock } from "styled-icons/fa-solid/Lock"; //Lock
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import NumericInput from "../inputs/NumericInput";
import StringInput from "../inputs/StringInput";
import { EventType } from "../../editor/nodes/PinCodeNode";

const eventTypeOptions = [
  { label: "Megaphone", value: EventType.MEGAPHONE },
  { label: "Teleport", value: EventType.TELEPORT },
  { label: "Change Room", value: EventType.ROOM },
  { label: "Scale", value: EventType.SCALE },
  { label: "Switch active", value: EventType.SWITCH },
  { label: "Snap", value: EventType.SNAP }
];

export default class PinCodeNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = Lock;

  static description = "A pin code field to enter a certain code an trigger an effect.\n";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }

  onChangeInputCode = inputCode => {
    this.props.editor.setPropertiesSelected({ inputCode });
  };

  onChangeHiddenInput = hiddenInput => {
    this.props.editor.setPropertiesSelected({ hiddenInput });
  };

  onChangeEventType = eventType => {
    this.props.editor.setPropertiesSelected({ eventType });
    console.log("event type is:", eventType);
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

  onChangeScale = size => {
    this.props.editor.setPropertiesSelected({ size });
    console.log("new size  is:", size);
  };

  onChangeRoomURL = newRoomUrl => {
    this.props.editor.setPropertiesSelected({ newRoomUrl });
    console.log("URL is:", newRoomUrl);
  };

  onChangeSwitchActive = switchActive => {
    this.props.editor.setPropertiesSelected({ switchActive });
    console.log("collision mask is:", switchActive);
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
      <NodeEditor description={PinCodeNodeEditor.description} {...this.props}>
        <InputGroup
          name="Code"
          info="Define the correct code">
          <NumericInput
            min={0}
            smallStep={1}
            mediumStep={4}
            largeStep={8}
            value={node.inputCode}
            onChange={this.onChangeInputCode} />
        </InputGroup>
        <InputGroup name="Hidden Input"
          info=".">
          <BooleanInput value={node.hiddenInput} onChange={this.onChangeHiddenInput} />
        </InputGroup>
        <InputGroup name="Event Type" info="Define the action of this pin code field">
          <SelectInput options={eventTypeOptions} value={node.eventType} onChange={this.onChangeEventType} />
        </InputGroup>
        {node.eventType === EventType.ROOM && (
          <InputGroup
            name="Target Room URL"
            info="Define the URL of the target room this trigger is supposed to change to.">
            <StringInput value={node.newRoomUrl} required={true} onChange={this.onChangeRoomURL} />
          </InputGroup>
        )}
        {node.eventType === EventType.SCALE && (
          <InputGroup
            name="Scale"
            info="Define a new scale">
            <NumericInput
              min={0.01}
              smallStep={0.01}
              mediumStep={0.1}
              largeStep={1}
              value={node.size}
              onChange={this.onChangeScale} />
          </InputGroup>
        )}
        {node.eventType !== EventType.MEGAPHONE && node.eventType !== EventType.SNAP && node.eventType !== EventType.ROOM && node.eventType !== EventType.SCALE && (
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
            {node.eventType === EventType.SWITCH && (
              // only ask for a switch, if the trigger type is a switch object active type 
              <>
                <InputGroup name="New state of target"
                  info="The state of the target will be set to either active (true) or inactive (false), when the trigger is activated.">
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
