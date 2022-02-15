import {
  Object3D,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  DoubleSide
} from "three";
import EditorNodeMixin from "./EditorNodeMixin";
import pin from "../../assets/pin.png";
import loadTexture from "../utils/loadTexture";

export const EventType = {
  TELEPORT: "teleport",
  SCALE: "Scale",
  SWITCH: "switch active",
  MEGAPHONE: "megaphone",
  ROOM: "Change Room",
  SNAP: "snap"
};

let pinTexture = null;

export default class PinCodeNode extends EditorNodeMixin(Object3D) {
  static componentName = "pin-code";

  static nodeName = "Pin Code";

  static async load() {
    pinTexture = await loadTexture(pin);
  }

  constructor(editor) {
    super(editor);

    this.inputCode = 9999;
    this.hiddenInput = false;
    this.eventType = EventType.MEGAPHONE;
    this.target = null;
    this.targetName = null;
    this.size = 1;
    this.channel = 1;
    this.newRoomUrl = "";
    this.switchActive = true;


    const geometry = new PlaneBufferGeometry();
    const material = new MeshBasicMaterial();
    geometry.scale(0.5, 0.5, 0);
    material.map = pinTexture;
    material.side = DoubleSide;
    material.transparent = false;
    this.helper = new Mesh(geometry, material);
    this.helper.layers.set(1);
    this.add(this.helper);
  }

  copy(source, recursive = true) {
    if (recursive) {
      this.remove(this.helper);
    }

    super.copy(source, recursive);

    if (recursive) {
      const helperIndex = source.children.findIndex(child => child === source.helper);

      if (helperIndex !== -1) {
        this.helper = this.children[helperIndex];
      }
    }
    this.inputCode = source.inputCode;
    this.hiddenInput = source.hiddenInput;
    this.eventType = source.eventType;
    this.target = source.target;
    this.targetName = source.targetName;
    this.size = source.size;
    this.channel = source.channel;
    this.newRoomUrl = source.newRoomUrl;
    this.switchActive = source.switchActive;

    return this;
  }

  serialize() {
    return super.serialize({
      "pin-code": {
        inputCode: this.inputCode,
        hiddenInput: this.hiddenInput,
        eventType: this.eventType,
        target: this.target,
        targetID: this.target,
        targetName: this.targetName,
        size: this.size,
        channel: this.channel,
        newRoomUrl: this.newRoomUrl,
        switchActive: this.switchActive
      }
    });
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);
    const props = json.components.find(c => c.name === "pin-code").props;
    node.inputCode = props.inputCode;
    node.hiddenInput = props.hiddenInput;
    node.eventType = props.eventType;
    node.target = props.target;
    node.targetName = props.targetName;
    node.size = props.size;
    node.channel = props.channel;
    node.newRoomUrl = props.newRoomUrl;
    node.switchActive = props.switchActive;
    return node;
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);
    this.addGLTFComponent("pin-code", {
      inputCode: this.inputCode,
      hiddenInput: this.hiddenInput,
      eventType: this.eventType,
      bounds: new Vector3().copy(this.scale),
      targetName: this.targetName,
      size: this.size,
      channel: this.channel,
      newRoomUrl: this.newRoomUrl,
      switchActive: this.switchActive
    });
    console.log("Exported PinCode:");
    console.log(this);
    // We use scale to configure bounds, we don't actually want to set the node's scale
    this.scale.setScalar(1);
    //console.log("Exporting with target room: " + this.newRoomUrl);
    this.addGLTFComponent("networked", {
      id: this.uuid
    });
  }
}
