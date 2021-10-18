import React, { lazy } from 'react';
import { Engine, Scene, SceneLoader, FreeCamera, Vector3, ArcRotateCamera, Tools, Mesh } from 'babylonjs'
import 'babylonjs-materials'
import { isMobile } from 'react-device-detect';
import { FocusStyleManager } from '@blueprintjs/core';

import ToolsPanel from './components/ToolsPanel';

// Scene 
import CustomLoadingScreen from './scene/loading-screen';
import SceneManager from './scene/manager';
import UVOffset from './scene/uv-offset';
// import { SceneSettings } from './scene/settings';
import { SceneSign } from './scene/sign';
import { LOD } from './scene/lod';
import axios from 'utils/axios';
import style from './App.module.scss';

interface IProps {

}

interface IState {
  loadedPercent: number;

  plugins: any;

  isOpen: boolean;
}

const importPlugin = (pluginName: String) =>
  lazy(() =>
    import(`./plugins/${pluginName}`).catch(() => import(`./plugins/NullPlugin`))
  );

class App extends React.Component<IProps, IState> {

  public canvasRef: React.RefObject<any>;

  public engine!: Engine;

  public scene!: Scene;

  public camera!: ArcRotateCamera | FreeCamera;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      loadedPercent: 0,
      plugins: {},
      isOpen: false
    }
  }

  componentDidMount() {
    FocusStyleManager.onlyShowFocusOnTabs();
    setTimeout(() => {
      this.init()
    }, 0);
  }

  init() {
    this.engine = new Engine(this.canvasRef.current, true, {
      antialias: true,
      audioEngine: false,
      disableWebGL2Support: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
      useHighPrecisionFloats: true,
      preserveDrawingBuffer: true,
      stencil: true,
    }, true);

    window.addEventListener("resize", () => this.engine.resize());
    this.scene = new Scene(this.engine);
    
    const loadingScreen = new CustomLoadingScreen("加载中!!");
    // replace the default loading screen
    this.engine.loadingScreen = loadingScreen;
    // show the loading screen
    this.engine.displayLoadingUI();

    SceneLoader.Append(
      "splitscene/",
      "scene.babylon",
      this.scene,
      scene => {
       /*  this.scene.dispose()
        this.scene = scene; */

        // Set ArcRotateCamera for the mobile device.
        if (isMobile) {
          this.camera = new ArcRotateCamera("camera", 0, 0, 10, new Vector3(0, 50, -10), this.scene, false)
          this.camera.setTarget(Vector3.Zero());
          this.camera.attachControl(this.canvasRef.current, true);
          this.scene.activeCamera = this.camera;
        } else {
          if (!this.scene.activeCamera) {
            this.camera = new FreeCamera("camera", new Vector3(0, 50, -10), this.scene);
            this.camera.setTarget(Vector3.Zero());
            this.camera.attachControl(this.canvasRef.current, false);
            this.scene.activeCamera = this.camera;
          } else {
            this.scene.activeCamera!.attachControl(this.canvasRef.current, false);
            // TODO: put animations to editorproject file
            // Camera animations
            if (this.scene.activeCamera.animations.length > 0) {
              const bounds = SceneManager.GetAnimationFrameBounds([this.scene.activeCamera]);
              this.scene.beginAnimation(this.scene.activeCamera, bounds.min, bounds.max, bounds.loop, 1.0);
            }
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
        this.scene.executeWhenReady(async () => {
          const promises = [];
          let splitsceneLength= "3";
          for (let index = 1; index < Number(splitsceneLength); index++) {
            promises.push(new Promise(async (resolve) => {
              await SceneLoader.AppendAsync('splitscene/', `meshes_${index}.babylon`, this.scene)
              resolve(null)
            }))
          }
  
          await Promise.all(promises);
          this.scene.meshes.forEach(mesh => {
            // Animations begin
            if (mesh.animations.length > 0 && !mesh.metadata.action) {
              const bounds = SceneManager.GetAnimationFrameBounds([mesh]);
              this.scene.beginAnimation(mesh, bounds.min, bounds.max, bounds.loop, 1.0);
            }
  
            if (mesh.metadata) {
              // Mesh Sign
              if (mesh.metadata.signEnable && mesh.metadata.signText) new SceneSign(scene, mesh, mesh.metadata.signText);
              // Mesh LOD
              if (mesh instanceof Mesh && mesh.metadata.height) LOD.Building(mesh);
            }
          });
          if (this.scene.metadata && Array.isArray(this.scene.metadata.vOffset)) {
            UVOffset.init(this.scene, this.scene.metadata.vOffset)
          }
          this.engine.runRenderLoop(() => {
            this.scene.render();
          });
        /*================新增插件系统=========pengwei.zhao============= */
        /*  // Default plugins 
          this.scene.metadata = {
            plugins: ['ActionManager']
          }
          // Dynamic load plugins component from the scene metadata
          if (this.scene.metadata && Array.isArray(this.scene.metadata.plugins)) {
            this.scene.metadata.plugins.forEach((pluginName: string) => {
              if (!this.state.plugins[pluginName]) {
                const Plugin = importPlugin(pluginName);
                this.setState({ plugins: { ...this.state.plugins, [pluginName]: Plugin } });
              };
            })
          }*/
           // Default plugins 
           this.scene.metadata = {
            plugins: [],
            ...this.scene.metadata
          }
          const {plugins} = this.scene.metadata;
          // Dynamic load plugins component from the scene metadata
          plugins.forEach((plugin: any) => {
            (window as any).Function(plugin.windowPlugin)();
            if((window as any).xcimPlugin){
              const p:any = (window as any).xcimPlugin[plugin.pluginCode];
              const newPlugin = new p({scene:this.scene,axios});
              plugin.records.forEach((values:any) => {
                newPlugin.submit(values);
              });
            }
          })
          /*==========END======新增插件系统=========pengwei.zhao======== */
        })
      },
      evt => {
        // onProgress
        let loadedPercent: any = 0;

        if (evt.lengthComputable) {
          loadedPercent = (evt.loaded * 100 / evt.total).toFixed();
        } else {
          var dlCount = evt.loaded / (1024 * 1024);
          loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        }
        this.setState({ loadedPercent })
      },
      (scene, message, exception) => {
        console.log(scene, message, exception);
      }
    );
  }
  render() {

    // Plugin Components
    const PluginList: any = ({ plugins }: any) =>
      Object.values(plugins).map((Plugin: any) => (
        <Plugin key={Tools.RandomId()} scene={this.scene} />
      ));

    return (
      <div className={style.App}>
        <div className="loading" id="loadingScreen">
          <div>
            <img className="loading-icon" src="Xcim.gif" alt="xim" />
          </div>
          <div className="loading-progress">{this.state.loadedPercent}%</div>
        </div>
        <canvas ref={this.canvasRef} style={{ width: "100%", height: "100%", position: "unset", top: "0", touchAction: "none" }}></canvas>
        <div className={style.pluginsContainer}>
          <React.Suspense fallback="Loading plugins...">
            <div className={style.pluginContainer}>
              <PluginList plugins={this.state.plugins} />
            </div>
          </React.Suspense>
        </div>
        <ToolsPanel scene={this.scene}></ToolsPanel>
      </div>
    );
  }
}

export default App;
