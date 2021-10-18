import React from 'react';
import { Scene } from 'babylonjs';
import { Switch, FormGroup } from '@blueprintjs/core';

import { SceneSettings } from '../../scene/settings';

interface IProps {
    scene: Scene
}

interface IStates {
    isRenderingPipeline: boolean;
}

class DefaultRenderingPipeline extends React.Component<IProps, IStates> {
    public scene: Scene;

    constructor(props: IProps) {
        super(props)

        this.scene = this.props.scene;
        this.state = {
            isRenderingPipeline: SceneSettings.IsDefaultPipelineEnabled()
        }
    }

    public toggleDefaultRenderingPipeline = () => {
        SceneSettings.SetDefaultPipelineEnabled(this.scene, !this.state.isRenderingPipeline);
        this.setState({
            isRenderingPipeline: !this.state.isRenderingPipeline
        })
    }

    render() {

        return (
            <FormGroup
                inline
                label="后处理"
            >
                <Switch checked={this.state.isRenderingPipeline} onChange={this.toggleDefaultRenderingPipeline}></Switch>
            </FormGroup>
        )
    }
}

export default DefaultRenderingPipeline;