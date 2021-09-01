import { Material, BoxBufferGeometry, Object3D, Mesh, BoxHelper } from "three";
import EditorNodeMixin from "./EditorNodeMixin";

export default class TextCubeNode extends EditorNodeMixin(Object3D) {
  static componentName = "text-cube";

  static nodeName = "text-cube";

  static _geometry = new BoxBufferGeometry();

  static _material = new Material();

  constructor(editor) {
    super(editor);

    this.frontText = "Front";
    this.backText = "Back";
    this.rightText = "Right";
    this.leftText = "Left";
    this.topText = "Top";
    this.bottomText = "Bottom";
    this.topBottom = true;
    this.textScale = 1;

    const boxMesh = new Mesh(TextCubeNode._geometry, TextCubeNode._material);
    const box = new BoxHelper(boxMesh, 0xffff00);
    box.layers.set(1);
    this.helper = box;
    this.add(box);
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
