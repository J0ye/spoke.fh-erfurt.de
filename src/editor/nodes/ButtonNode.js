import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";
import TriggerType from "./FrameTriggerNode"
import EditorNodeMixin from "./EditorNodeMixin";
import linkIconUrl from "../../assets/link-icon.png";
import loadTexture from "../utils/loadTexture";

let linkHelperTexture = null;

export default class ButtonNode extends EditorNodeMixin(Object3D) {
  static legacyComponentName = "link";

  static nodeName = "Custom Button";

  static async load() {
    linkHelperTexture = await loadTexture(linkIconUrl);
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const props = json.components.find(c => c.name === "button").props;

    node.text = props.text;

    return node;
  }

  constructor(editor) {
    super(editor);

    this.text = "Button";

    // Button effects
    this.triggerType = TriggerType.MEGAPHONE;
    this.target = null;
    this.switchActive = true;

    const geometry = new PlaneBufferGeometry();
    const material = new MeshBasicMaterial();
    material.map = linkHelperTexture;
    material.side = DoubleSide;
    material.transparent = true;
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

    this.text = source.text;

    this.triggerType = source.triggerType;
    this.target = source.target;
    this.switchActive = source.switchActive;

    return this;
  }

  serialize() {
    return super.serialize({
      link: {
        href: this.href,
        triggerType: this.triggerType,
        target: this.target,
        switchActive: this.switchActive
      }
    });
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);
    this.addGLTFComponent("button", {
      href: this.href,
      triggerType: this.triggerType,
      target: this.gltfIndexForUUID(this.target),
      targetID: this.target,
      switchActive: this.switchActive
    });
    this.addGLTFComponent("networked", {
      id: this.uuid
    });
    this.replaceObject();
  }
}
