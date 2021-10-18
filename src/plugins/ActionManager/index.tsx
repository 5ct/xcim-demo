import React from 'react';
import { HighlightLayer, Scene, Color3, Mesh, Vector3, Matrix, AbstractMesh, PointerEventTypes } from 'babylonjs';
import BasicInfo from 'components/BasicInfo';
import BasicTable from 'components/BasicTable';
import axios from 'utils/axios';

interface IState {
    info: any;
    point: Vector3;
}

interface IProps {
    scene: Scene;
}

export default class MeshActionManager extends React.Component<IProps, IState> {

    public scene: Scene;

    public h1: HighlightLayer;

    // public actionManager: ActionManager;

    constructor(props: IProps) {
        super(props);
        this.scene = props.scene;
        this.state = {
            point: Vector3.Zero(),
            info: null
        }

        this.h1 = new HighlightLayer("hl", this.scene);
    }

    componentDidMount() {
        this.bindSceneObservable(this.scene);
    }

    /**
    * Returns the reference of the mesh that is under the pointer.
    * @param fastCheck Launch a fast check only using the bounding boxes. Can be set to null.
    */
    public getObjectUnderPointer(fastCheck: boolean = false): Nullable<AbstractMesh> {
        // Scene
        let scene = this.scene!;
        let x = scene.pointerX / (parseFloat(document.body.style.zoom ?? "") || 1);
        let y = scene.pointerY / (parseFloat(document.body.style.zoom ?? "") || 1);
        let pick = scene.pick(x, y, undefined, fastCheck);

        if (!pick) { return null; }

        return pick.pickedMesh;
    }

    private bindSceneObservable(scene: Scene) {
        let mesh: Nullable<AbstractMesh> = null;
        scene.registerAfterRender(() => {
            if (!mesh) { return; }
            // const positions = (mesh as any)._positions;
            this.setState({
                point: Vector3.Project(
                    // positions[Math.round(positions.length / 2)],
                    (mesh as any).getBoundingInfo().boundingBox.centerWorld,
                    Matrix.Identity(),
                    scene.getTransformMatrix(),
                    scene.activeCamera!.viewport.toGlobal(this.scene.getEngine().getRenderWidth(), this.scene.getEngine().getRenderHeight())
                )
            })
        })

        scene.onPointerObservable.add(async (pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERTAP:
                    if (pointerInfo.pickInfo && pointerInfo.pickInfo.pickedMesh) {
                        mesh = pointerInfo.pickInfo.pickedMesh

                        this.h1.removeAllMeshes();
                        this.setState({ info: null })
                        if (mesh.metadata && mesh.metadata.info) {
                            if (!this.h1.hasMesh(mesh) && (mesh instanceof Mesh)) {
                                // highlight mesh
                                this.h1.addMesh(mesh, new Color3(89 / 255, 86 / 255, 235 / 255));
                            }
                            this.setState({
                                info: mesh.metadata.info,
                            })
                        } else if (mesh.metadata && mesh.metadata.api) {
                            if (!this.h1.hasMesh(mesh) && (mesh instanceof Mesh)) {
                                // highlight mesh
                                this.h1.addMesh(mesh, new Color3(89 / 255, 86 / 255, 235 / 255));
                            }
                            const res = await axios.get(mesh.metadata.api)
                            this.setState({
                                info: res.data,
                            })
                        }
                    } else {
                        this.h1.removeAllMeshes();
                        this.setState({ info: null })
                    }
                    break;
            }
        });

    }

    render() {
        return (
            this.state.info ?
                // <BasicInfo data={this.state.info} point={this.state.point} />
                <BasicTable data={this.state.info} point={this.state.point} />
                : null
        )
    }

}