import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { Download } from "styled-icons/fa-solid/Download";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import StringInput from "../inputs/StringInput";
import { TriggerType } from "../../editor/nodes/FrameTriggerNode";

const triggerTypeOptions = [
  { label: "Megaphone", value: TriggerType.MEGAPHONE },
  { label: "Teleport", value: TriggerType.TELEPORT },
  { label: "Visibility (debug)", value: TriggerType.VISIBILITY },
  { label: "Switch active", value: TriggerType.SWITCH }
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


  onChangeTriggerType = triggerType => {
    this.props.editor.setPropertiesSelected({ triggerType });
  };

  onChangeText = text => {
    this.props.editor.setPropertiesSelected({ text });
  };

  onChangeTarget = target => {
    this.props.editor.setPropertiesSelected({
      target,
      enterComponent: null,
      enterProperty: null,
      enterValue: null,
      leaveComponent: null,
      leaveProperty: null,
      leaveValue: null
    });
  };

  onChangeSwitchActive = switchActive => {
    this.props.editor.setPropertiesSelected({ switchActive });
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
        <InputGroup name="Button Text" info="This text will be displayed on the button later.">
          <StringInput value={node.text} onChange={this.onChangeText}></StringInput>
        </InputGroup>
        <InputGroup name="Trigger Types" info="Define the action of this triggered">
          <SelectInput options={triggerTypeOptions} value={node.triggerType} onChange={this.onChangeTriggerType} />
        </InputGroup>
        {node.triggerType !== TriggerType.MEGAPHONE && (
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
            {node.triggerType === TriggerType.SWITCH && (
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