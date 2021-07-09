import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { ObjectGroup } from "styled-icons/fa-solid/ObjectGroup";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import NumericInput from "../inputs/NumericInput";
import StringInput from "../inputs/StringInput";
import useSetPropertySelected from "./useSetPropertySelected";
import { TriggerType } from "../../editor/nodes/FrameTriggerNode";
import EditorNodeMixin from "../../editor/nodes/EditorNodeMixin";

const triggerTypeOptions = [
  { label: "Megaphone", value: TriggerType.MEGAPHONE },
  { label: "Teleport", value: TriggerType.TELEPORT },
  { label: "Change Room", value: TriggerType.ROOM },
  { label: "Scale", value: TriggerType.SCALE },
  { label: "Visibility (debug)", value: TriggerType.VISIBILITY },
  { label: "Switch active", value: TriggerType.SWITCH },
  { label: "Snap", value: TriggerType.SNAP },
  { label: "Audiozone", value: TriggerType.AUDIOZONE }
];

const CollisionMask = {
  AVATAR: 4,
  OBJECT: 1,
  BOTH: 5,
};

const collisionMaskOptions = [
  { label: "Avatar", value: CollisionMask.AVATAR },
  { label: "Object", value: CollisionMask.OBJECT },
  { label: "Both", value: CollisionMask.BOTH }
];

export default class FrameTriggerNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = ObjectGroup;

  static description = "A frame to trigger actions.\n";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }


  onChangeTriggerType = triggerType => {
    this.props.editor.setPropertiesSelected({ triggerType });
    console.log("trigger type is:", triggerType);
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

  onChangeCollisionMask = cMask => {
    this.props.editor.setPropertiesSelected({ cMask });
    console.log("collision mask is:", cMask);
  };

  onChangeChannel = channel => {
    this.props.editor.setPropertiesSelected({ channel });
    console.log("channel is:", channel);
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
      <NodeEditor description={FrameTriggerNodeEditor.description} {...this.props}>
        <InputGroup name="Trigger Types" info="Define the action of this triggered">
          <SelectInput options={triggerTypeOptions} value={node.triggerType} onChange={this.onChangeTriggerType} />
        </InputGroup>
        {node.triggerType !== TriggerType.SNAP && node.triggerType !== TriggerType.AUDIOZONE && node.triggerType !== TriggerType.ROOM && (
          <InputGroup
            name="Collision Mask"
            info="Define a mask of the possible layers for a collision.">
            <SelectInput options={collisionMaskOptions} value={node.cMask} onChange={this.onChangeCollisionMask} />
          </InputGroup>
        )}
        {node.triggerType === TriggerType.ROOM && (
          <InputGroup
            name="Target Room URL"
            info="Define the URL of the target room this trigger is supposed to change to.">
            <StringInput value={node.newRoomUrl} required={true} onChange={this.onChangeRoomURL} />
          </InputGroup>
        )}
        {node.triggerType === TriggerType.AUDIOZONE && (
          <InputGroup
            name="Channel"
            info="Define an audio channel">
            <NumericInput
              min={1}
              smallStep={1}
              mediumStep={4}
              largeStep={8}
              value={node.channel}
              onChange={this.onChangeChannel} />
          </InputGroup>
        )}
        {node.triggerType === TriggerType.SCALE && (
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
        {node.triggerType !== TriggerType.MEGAPHONE && node.triggerType !== TriggerType.SNAP && node.triggerType !== TriggerType.AUDIOZONE && node.triggerType !== TriggerType.ROOM && node.triggerType !== TriggerType.SCALE && (
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

/*
To Do
Interactable Button
Position oder  Canvas für Text anzeigen bei Counter
*/
