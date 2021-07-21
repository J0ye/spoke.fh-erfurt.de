import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";
import EditorNodeMixin from "./EditorNodeMixin";
import pink from "../../assets/pink.png";
import loadTexture from "../utils/loadTexture";

let buttonTexture = null;

export const ButtonType = {
  TELEPORT: "teleport",
  VISIBILITY: "visibility",
  MEGAPHONE: "megaphone",
  ROOM: "Change Room",
  ANIMATION: "Animation"
};

export default class ButtonNode extends EditorNodeMixin(Object3D) {
  static componentName = "action-button";

  static nodeName = "Action Button";

  static async load() {
    buttonTexture = await loadTexture(pink);
  }

  constructor(editor) {
    super(editor);

    this.buttonLabel = "Button";
    this.isSwitchButton = true;
    this.buttonStatus = false;
    this.buttonType = ButtonType.VISIBILITY;
    this.target = null;
    this.targetName = "";
    this.newRoomUrl = "";

    const geometry = new PlaneBufferGeometry();
    const material = new MeshBasicMaterial();
    geometry.scale(1, 0.3, 0);
    material.map = buttonTexture;
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

    this.buttonLabel = source.buttonLabel;
    this.buttonType = source.buttonType;
    this.buttonStatus = source.buttonStatus;
    this.target = source.target;
    this.targetName = source.targetName;
    this.isSwitchButton = source.isSwitchButton;
    this.newRoomUrl = source.newRoomUrl;

    return this;
  }

  serialize() {
    return super.serialize({
      "action-button": {
        href: this.href,
        buttonLabel: this.buttonLabel,
        buttonType: this.buttonType,
        buttonStatus: this.buttonStatus,
        target: this.target,
        targetName: this.targetName,
        newRoomUrl: this.newRoomUrl,
        isSwitchButton: this.isSwitchButton
      }
    });
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);
    const props = json.components.find(c => c.name === "action-button").props;
    node.buttonType = props.buttonType;
    node.buttonLabel = props.buttonLabel;
    node.buttonStatus = props.buttonStatus;
    node.target = props.target;
    node.targetName = props.targetName;
    node.newRoomUrl = props.newRoomUrl;
    node.isSwitchButton = props.isSwitchButton;
    return node;
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);
    this.addGLTFComponent("action-button", {
      href: this.href,
      buttonType: this.buttonType,
      buttonLabel: this.buttonLabel,
      buttonStatus: this.buttonStatus,
      button: this.target,
      targetName: this.targetName,
      newRoomUrl: this.newRoomUrl,
      isSwitchButton: this.isSwitchButton
    });
    console.log("This:");
    console.log(this);
    this.addGLTFComponent("networked", {
      id: this.uuid
    });
    this.replaceObject();
  }
}
