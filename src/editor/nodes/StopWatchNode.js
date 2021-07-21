import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";
import EditorNodeMixin from "./EditorNodeMixin";
import pink from "../../assets/time.png";
import loadTexture from "../utils/loadTexture";

let stopWatchTexture = null;

export default class StopWatchNode extends EditorNodeMixin(Object3D) {
  static componentName = "stopwatch";

  static nodeName = "StopWatch";

  static async load() {
    stopWatchTexture = await loadTexture(pink);
  }

  constructor(editor) {
    super(editor);

    const geometry = new PlaneBufferGeometry();
    const material = new MeshBasicMaterial();
    geometry.scale(1, 0.3, 0);
    material.map = stopWatchTexture;
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

    return this;
  }

  serialize() {
    return super.serialize({
      "stopwatch": {
        href: this.href
      }
    });
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);
    return node;
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);
    this.addGLTFComponent("stopwatch", {
      href: this.href
    });
    this.addGLTFComponent("networked", {
      id: this.uuid
    });
    this.replaceObject();
  }
}
