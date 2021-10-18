
import { Nullable, AbstractMesh } from 'babylonjs';
import 'babylonjs-gui';

export class SceneSign {

    private _advancedTexture!: BABYLON.GUI.AdvancedDynamicTexture;
    public text!: BABYLON.GUI.TextBlock;
    private _label!: BABYLON.GUI.Rectangle;
    private _line!: BABYLON.GUI.Line;
    private _line2!: BABYLON.GUI.Line;

    public constructor(scene: any, mesh: Nullable<AbstractMesh>, text: string) {
        // GUI
        if (!mesh) return;
        this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        this._label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
        this._label.height = "35px";
        this._label.width = "240px";
        this._label.thickness = 0;
        this._label.linkOffsetX = 240;
        this._label.linkOffsetY = -120;
        this._label.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._advancedTexture.addControl(this._label);
        this._label.linkWithMesh(mesh as any)

        this._line = new BABYLON.GUI.Line();
        this._line.alpha = 0.5;
        this._line.lineWidth = 2;
        this._line.x2 = -120
        this._line.y2 = 20;
        this._line.color = '#F8E71C'
        this._advancedTexture.addControl(this._line);
        this._line.linkWithMesh(mesh as any)
        this._line.connectedControl = this._label;

        this._line2 = new BABYLON.GUI.Line();
        this._line2.alpha = 0.5;
        this._line2.lineWidth = 2;
        this._line2.linkOffsetX = 119
        this._line2.linkOffsetY = -100;
        this._line2.color = '#F8E71C'
        this._line2.x2 = 300
        this._line2.y2 = -50;
        this._advancedTexture.addControl(this._line2);
        this._line2.linkWithMesh(mesh as any)
        this._line2.connectedControl = this._line;

        this.text = new BABYLON.GUI.TextBlock();
        this.text.text = text;
        this.text.textWrapping = true;
        this.text.color = "#F8E71C";
        this._label.addControl(this.text);
    }

    public remove() {
        this._advancedTexture.dispose();
        this._label.dispose()
        this._line.dispose()
        this._line2.dispose()
        this.text.dispose()
    }
}