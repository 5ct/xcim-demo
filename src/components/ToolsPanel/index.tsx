import { useState } from 'react';
import { Scene } from 'babylonjs';
import { Button, ButtonGroup, Drawer, Tooltip } from '@blueprintjs/core';
import AlphaToggle from '../AlphaToggle';
import Roaming from '../Roaming';
// import DefaultRenderingPipeline from '../DefaultRenderingPipeline'

import style from './index.module.scss';

interface IProps {
    scene: Scene
}

const ToolsPanel = (props: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { scene } = props;

    function handleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
    }

    return (
        <div className={style.toolbar}>
            <ButtonGroup>
                <Tooltip content="场景设置">
                    <Button icon="settings" minimal className={style.btn} onClick={() => setIsOpen(true)}></Button>
                </Tooltip>
                <Tooltip content="全屏">
                    <Button icon="maximize" minimal className={style.btn} onClick={handleFullscreen}></Button>
                </Tooltip>
            </ButtonGroup>
            <Drawer
                size={Drawer.SIZE_SMALL}
                isOpen={isOpen}
                title="场景设置"
                onClose={() => setIsOpen(false)}
                usePortal={true}
            >
                <div className={style.settings}>
                    <AlphaToggle scene={scene} />
                    <Roaming scene={scene} />
                    {/* <DefaultRenderingPipeline scene={scene} /> */}
                </div>
            </Drawer>
        </div>
    )
}

export default ToolsPanel;