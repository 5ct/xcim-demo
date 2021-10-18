import React from 'react';
import { FreeCamera, ArcRotateCamera, Scene, Vector3 } from 'babylonjs';
import { Switch, FormGroup } from '@blueprintjs/core';
import { isMobile } from 'react-device-detect';
import SceneManager from '../../scene/manager';

import style from './index.module.scss';
import { SceneSettings } from '../../scene/settings';

interface IProps {
    scene: Scene
}

interface IStates {
    animating: boolean;
}

class Roaming extends React.Component<IProps, IStates> {
    public scene: Scene;

    constructor(props: IProps) {
        super(props)

        this.scene = this.props.scene;
        this.state = {
            animating: this.scene.activeCamera ? (this.scene.activeCamera.animations.length > 0) : false
        }
    }

    public toggleAnimation = () => {
        if (this.state.animating) {
            this.scene.stopAnimation(this.scene.activeCamera);
            const noAnimatbaleCamera = this.scene.cameras.find(camera => camera.animations.length === 0);
            if (isMobile) {
                if (noAnimatbaleCamera instanceof ArcRotateCamera) {
                    noAnimatbaleCamera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
                    this.scene.activeCamera = noAnimatbaleCamera;
                } else {
                    const camera = new ArcRotateCamera("camera", 0, 0, 10, new Vector3(0, 50, -10), this.scene, false)
                    camera.setTarget(Vector3.Zero());
                    camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
                    this.scene.activeCamera = camera;
                }
            } else {
                if (noAnimatbaleCamera) {
                    noAnimatbaleCamera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
                    this.scene.activeCamera = noAnimatbaleCamera;
                } else {
                    const camera = new FreeCamera("camera", new Vector3(0, 50, -10), this.scene);
                    camera.setTarget(Vector3.Zero());
                    camera.attachControl(this.scene.getEngine().getRenderingCanvas(), false);
                    this.scene.activeCamera = camera;
                }
            }

            if (this.scene.activeCamera instanceof FreeCamera || this.scene.activeCamera instanceof ArcRotateCamera) {
                // Traditional WASD controls
                this.scene.activeCamera.keysUp.push(87); // "W"
                this.scene.activeCamera.keysLeft.push(65); // "A"
                this.scene.activeCamera.keysDown.push(83); // "S"
                this.scene.activeCamera.keysRight.push(68); //"D"

                if (this.scene.activeCamera instanceof FreeCamera) {
                    this.scene.activeCamera.keysUpward.push(81) // "Q"
                    this.scene.activeCamera.keysDownward.push(69) // "E"
                }
                this.scene.activeCamera.speed = 2
            }
        } else {
            const animatableCamera = this.scene.cameras.find(camera => camera.animations.length > 0);
            if (animatableCamera) {
                this.scene.activeCamera = animatableCamera;
                const bounds = SceneManager.GetAnimationFrameBounds([animatableCamera]);
                this.scene.beginAnimation(this.scene.activeCamera, bounds.min, bounds.max, bounds.loop, 1.0);
            }
        }
        SceneSettings.ResetPipelines(this.scene);
        this.setState({
            animating: !this.state.animating
        })
    }

    render() {

        return (
            <FormGroup
                inline
                label="漫游"
            >
                <Switch className={style.switch} checked={this.state.animating} onChange={this.toggleAnimation} />
            </FormGroup>
        )
    }
}

export default Roaming;