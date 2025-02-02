import { MeshStandardMaterial, BoxBufferGeometry, CircleBufferGeometry, Object3D, Mesh, Color } from "three";
import EditorNodeMixin from "./EditorNodeMixin";

export default class TextCubeNode extends EditorNodeMixin(Object3D) {
  static componentName = "text-cube";

  static nodeName = "text-cube";

  static _geometry = new BoxBufferGeometry();

  constructor(editor) {
    super(editor);

    this.boxColor = new Color(0x000000);
    this.frontText = "Front";
    this.backText = "Back";
    this.rightText = "Right";
    this.leftText = "Left";
    this.topText = "Top";
    this.bottomText = "Bottom";
    this.topBottom = true;
    this.textColor = new Color(0x000000);
    this.textScale = 1;

    const material = new MeshStandardMaterial({ roughness: 0.7, metalness: 0.5, color: "#FFFFFF" });
    const mesh = new Mesh(TextCubeNode._geometry, material);
    this.mesh = mesh;
    this.add(this.mesh);
  }

  get color() {
    return this.mesh.material.color;
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

    this.color.copy(source.color);
    this.boxColor = this.color;
    this.textColor.copy(source.textColor);

    this.frontText = source.frontText;
    this.backText = source.backText;
    this.rightText = source.rightText;
    this.leftText = source.leftText;
    this.topText = source.topText;
    this.bottomText = source.bottomText;
    this.topBottom = source.topBottom;
    this.textScale = source.textScale;
    return this;
  }

  serialize() {
    this.boxColor = this.color;
    return super.serialize({
      "text-cube": {
        href: this.href,
        frontText: this.frontText,
        backText: this.backText,
        rightText: this.rightText,
        leftText: this.leftText,
        topText: this.topText,
        bottomText: this.bottomText,
        topBottom: this.topBottom,
        boxColor: this.boxColor,
        textColor: this.textColor,
        textScale: this.textScale
      }
    });
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);
    const props = json.components.find(c => c.name === "text-cube").props;
    node.frontText = props.frontText;
    node.backText = props.backText;
    node.rightText = props.rightText;
    node.leftText = props.leftText;
    node.topText = props.topText;
    node.bottomText = props.bottomText;
    node.topBottom = props.topBottom;

    const { boxColor } = json.components.find(c => c.name === "text-cube").props;

    node.boxColor.set(boxColor);

    const { textColor } = json.components.find(c => c.name === "text-cube").props;

    node.textColor.set(textColor);
    node.textScale = props.textScale;
    return node;
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);
    this.addGLTFComponent("text-cube", {
      href: this.href,
      cubeColor: this.cubeColor,
      frontText: this.frontText,
      backText: this.backText,
      rightText: this.rightText,
      leftText: this.leftText,
      topText: this.topText,
      bottomText: this.bottomText,
      topBottom: this.topBottom,
      boxColor: this.boxColor,
      textColor: this.textColor,
      textScale: this.textScale
    });
    console.log("This:");
    console.log(this);
    this.addGLTFComponent("networked", {
      id: this.uuid
    });
    this.replaceObject();
  }
}
