import {
  Object3D,
  BoxBufferGeometry,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  Mesh,
  Vector3,
  DoubleSide
} from "three";
import EditorNodeMixin from "./EditorNodeMixin";

export const TriggerType = {
  TELEPORT: "teleport",
  VISIBILITY: "visibility",
  SWITCH: "switch active",
  MEGAPHONE: "megaphone",
  ROOM: "Change Room",
  SNAP: "snap",
  AUDIOZONE: "audiozone"
};

export default class FrameTriggerNode extends EditorNodeMixin(Object3D) {
  static componentName = "frame-trigger";

  static nodeName = "Frame Trigger";

  static _geometry = new BoxBufferGeometry();

  constructor(editor) {
    super(editor);

    this.triggerType = TriggerType.MEGAPHONE;
    this.target = null;
    this.targetName = null;
    this.cMask = 4;
    this.channel = 1;
    this.newRoomUrl = "";
    this.switchActive = true;


    const box = new Mesh(
      FrameTriggerNode._geometry,
      new ShaderMaterial({
        uniforms: {
          opacity: { value: 1 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main()
            {
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              vUv = uv;
            }
          `,
        fragmentShader: `
            // adapted from https://www.shadertoy.com/view/Mlt3z8
            float bayerDither2x2( vec2 v ) {
              return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );
            }
            float bayerDither4x4( vec2 v ) {
              vec2 P1 = mod( v, 2.0 );
              vec2 P2 = mod( floor( 0.5  * v ), 2.0 );
              return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );
            }

            varying vec2 vUv;
            uniform float opacity;
            void main() {
              float alpha = max(step(0.45, abs(vUv.x - 0.5)), step(0.45, abs(vUv.y - 0.5))) - 0.5;
              if( ( bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) ) ) / 16.0 >= alpha * opacity ) discard;
              gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
          `,
        side: DoubleSide
      })
    );

    const previewMaterial = new MeshBasicMaterial();
    previewMaterial.side = DoubleSide;
    previewMaterial.transparent = true;
    previewMaterial.opacity = 0.5;

    //const previewMesh = new Mesh(new PlaneBufferGeometry(1, 1, 1, 1), previewMaterial);
    //box.add(previewMesh);

    //previewMesh.layers.set(1);
    box.layers.set(1);

    this.helper = box;
    this.add(box);

    this.onDeselect();
  }

  onSelect() {
    this.helper.material.uniforms.opacity.value = 1.0;
  }

  onDeselect() {
    this.helper.material.uniforms.opacity.value = 0.5;
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
    this.triggerType = source.triggerType;
    this.target = source.target;
    this.targetName = source.targetName;
    this.cMask = source.cMask;
    this.channel = source.channel;
    this.newRoomUrl = source.newRoomUrl;
    this.switchActive = source.switchActive;

    return this;
  }

  serialize() {
    return super.serialize({
      "frame-trigger": {
        triggerType: this.triggerType,
        target: this.target,
        targetID: this.target,
        targetName: this.targetName,
        cMask: this.cMask,
        channel: this.channel,
        newRoomUrl: this.newRoomUrl,
        switchActive: this.switchActive
      }
    });
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);
    const props = json.components.find(c => c.name === "frame-trigger").props;
    node.triggerType = props.triggerType;
    node.target = props.target;
    node.targetName = props.targetName;
    node.cMask = props.cMask;
    node.channel = props.channel;
    node.newRoomUrl = props.newRoomUrl;
    node.switchActive = props.switchActive;
    return node;
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);
    this.addGLTFComponent("frame-trigger", {
      triggerType: this.triggerType,
      bounds: new Vector3().copy(this.scale),
      target: this.gltfIndexForUUID(this.target),
      targetID: this.target,
      targetName: this.targetName,
      cMask: this.cMask,
      channel: this.channel,
      newRoomUrl: this.newRoomUrl,
      switchActive: this.switchActive
    });
    // We use scale to configure bounds, we don't actually want to set the node's scale
    this.scale.setScalar(1);
    //console.log("Exporting with target room: " + this.newRoomUrl);
    this.addGLTFComponent("networked", {
      id: this.uuid
    });
  }
}
