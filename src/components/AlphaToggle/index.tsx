import React from 'react';
import { Material, Scene } from 'babylonjs';
import { Switch, FormGroup } from '@blueprintjs/core';

interface IProps {
    scene: Scene
}

interface IStates {
    alpha: boolean;
}

class AlphaToggle extends React.Component<IProps, IStates> {

    public scene: Scene;

    public materials: Material[]

    constructor(props: IProps) {
        super(props);
        this.scene = props.scene;
        this.materials = this.scene.materials.filter(mat => mat.name.toLocaleLowerCase().indexOf('map') !== -1 || mat.name.toLocaleLowerCase().indexOf('building') !== -1)
        this.state = {
            alpha: false
        };
    }

    public handleAlphaChange = () => {
        this.materials.forEach(mat => {
            const meshes = mat.getBindedMeshes();
            meshes.forEach(mesh => mesh.isVisible = !this.state.alpha)
        })
        this.setState({ alpha: !this.state.alpha });
    }

    render() {

        return (
            <FormGroup
                label="透明度"
                inline
            >
               <Switch checked={this.state.alpha} onChange={this.handleAlphaChange} />
            </FormGroup>
        )
    }
}

export default AlphaToggle;