import {
    DefaultRenderingPipeline, SerializationHelper, PostProcessRenderPipeline, MotionBlurPostProcess, SSAO2RenderingPipeline, ScreenSpaceReflectionPostProcess, Scene
} from "babylonjs";

export class SceneSettings {
    /**
   * Defines the reference to the SSAO rendering pipeline.
   */
    public static SSAOPipeline: Nullable<SSAO2RenderingPipeline> = null;
    /**
     * Defines the reference to the screen space reflections post-process.
     */
    public static ScreenSpaceReflectionsPostProcess: Nullable<ScreenSpaceReflectionPostProcess> = null;
    /**
     * Defines the reference to the default rendering pipeline.
     */
    public static DefaultPipeline: Nullable<DefaultRenderingPipeline> = null;
    /**
     * Defines the reference to the motion blur post-process.
     */
    public static MotionBlurPostProcess: Nullable<MotionBlurPostProcess> = null;

    private static _SSAOPipelineEnabled: boolean = true;
    private static _ScreenSpaceReflectionsEnabled: boolean = false;
    private static _DefaultPipelineEnabled: boolean = true;
    private static _MotionBlurEnabled: boolean = false;


    /**
     * Returns the SSAO rendering pipeline.
     * @param scene the scene reference.
     */
    public static GetSSAORenderingPipeline(scene: Scene): SSAO2RenderingPipeline {
        if (this.SSAOPipeline) { return this.SSAOPipeline; }

        const ssao = new SSAO2RenderingPipeline("ssao", scene!, { ssaoRatio: 0.5, blurRatio: 0.5 }, this._SSAOPipelineEnabled ? [scene!.activeCamera!] : [], true);
        ssao.radius = 3.5;
        ssao.totalStrength = 1.3;
        ssao.expensiveBlur = true;
        ssao.samples = 16;
        ssao.maxZ = 250;
        this.SSAOPipeline = ssao;

        return ssao;
    }

    /**
     * Returns wether or not SSAO pipeline is enabled.
     */
    public static IsSSAOEnabled(): boolean {
        return this._SSAOPipelineEnabled;
    }

    /**
     * Sets wether or not SSAO is enabled
     * @param scene the scene reference.
     * @param enabled wether or not the SSAO pipeline is enabled.
     */
    public static SetSSAOEnabled(scene: Scene, enabled: boolean): void {
        if (this._SSAOPipelineEnabled === enabled) { return; }
        this._SSAOPipelineEnabled = enabled;
        this.ResetPipelines(scene);
    }

    /**
     * Returns the default rendering pipeline.
     * @param scene the scene reference.
     */
    public static GetDefaultRenderingPipeline(scene: Scene): DefaultRenderingPipeline {
        if (this.DefaultPipeline) { return this.DefaultPipeline; }

        const pipeline = new DefaultRenderingPipeline("default", true, scene!, this._DefaultPipelineEnabled ? [scene!.activeCamera!] : []);
        // const curve = new ColorCurves();
        // curve.globalHue = 200;
        // curve.globalDensity = 80;
        // curve.globalSaturation = 80;
        // curve.highlightsHue = 20;
        // curve.highlightsDensity = 80;
        // curve.highlightsSaturation = -80;
        // curve.shadowsHue = 2;
        // curve.shadowsDensity = 80;
        // curve.shadowsSaturation = 40;
        // pipeline.imageProcessing.colorCurves = curve;
        pipeline.depthOfField.focalLength = 150;
        pipeline.bloomEnabled = true;
        this.DefaultPipeline = pipeline;

        return pipeline;
    }

    /**
     * Returns wether or not default pipeline is enabled.
     */
    public static IsDefaultPipelineEnabled(): boolean {
        return this._DefaultPipelineEnabled;
    }

    /**
     * Sets wether or not default pipeline is enabled
     * @param scene the scene reference.
     * @param enabled wether or not the default pipeline is enabled.
     */
    public static SetDefaultPipelineEnabled(scene: Scene, enabled: boolean) {
        if (this._DefaultPipelineEnabled === enabled) { return; }
        this._DefaultPipelineEnabled = enabled;
        this.ResetPipelines(scene);
    }

    /**
     * Returns the reference to the motion blur post-process.
     * @param scene defines the refenrece to the scene.
     */
    public static GetMotionBlurPostProcess(scene: Scene): MotionBlurPostProcess {
        if (this.MotionBlurPostProcess) { return this.MotionBlurPostProcess; }

        this.MotionBlurPostProcess = new MotionBlurPostProcess("motionBlur", scene!, 1.0, scene!.activeCamera, undefined, undefined, undefined, undefined, undefined, true);
        return this.MotionBlurPostProcess;
    }

    /**
     * Returns wether or not Motion Blur is enabled.
     */
    public static IsMotionBlurEnabled(): boolean {
        return this._MotionBlurEnabled;
    }

    /**
     * Sets wether or not motion blur post-process is enabled.
     * @param scene defines the reference to the scene.
     * @param enabled defines wether or not motion blur post-process is enabled.
     */
    public static SetMotionBlurEnabled(scene: Scene, enabled: boolean): void {
        if (this._MotionBlurEnabled === enabled) { return; }
        this._MotionBlurEnabled = enabled;
        this.ResetPipelines(scene);
    }

    /**
     * Returns the reference to the screen space reflections post-process.
     * @param scene defines the reference to the scene.
     */
    public static GetScreenSpaceReflectionsPostProcess(scene: Scene): ScreenSpaceReflectionPostProcess {
        if (this.ScreenSpaceReflectionsPostProcess) { return this.ScreenSpaceReflectionsPostProcess; }

        this.ScreenSpaceReflectionsPostProcess = new ScreenSpaceReflectionPostProcess("ssr", scene!, 1.0, scene!.activeCamera!, undefined, undefined, undefined, undefined, undefined, true);
        return this.ScreenSpaceReflectionsPostProcess;
    }

    /**
     * Returns wether or not screen space reflections is enabled.
     */
    public static IsScreenSpaceReflectionsEnabled(): boolean {
        return this._ScreenSpaceReflectionsEnabled;
    }

    /**
     * Sets wether or not screen space reflection post-process is enabled.
     * @param scene defines the reference to the scene.
     * @param enabled defines wether or not screen space reflections post-process is enabled.
     */
    public static SetScreenSpaceReflectionsEnabled(scene: Scene, enabled: boolean): void {
        if (this._ScreenSpaceReflectionsEnabled === enabled) { return; }
        this._ScreenSpaceReflectionsEnabled = enabled;
        this.ResetPipelines(scene);
    }

    /**
     * Resets the rendering pipelines.
     * @param scene the scene reference.
     */
    public static ResetPipelines(scene: Scene): void {
        scene!.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("ssao", scene!.cameras);
        scene!.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("default", scene!.cameras);

        const ssrSource = this.ScreenSpaceReflectionsPostProcess?.serialize();
        this.ScreenSpaceReflectionsPostProcess?.dispose(scene!.activeCamera!);
        this.ScreenSpaceReflectionsPostProcess = null;

        const motionBlurSource = this.MotionBlurPostProcess?.serialize();
        this.MotionBlurPostProcess?.dispose(scene!.activeCamera!);
        this.MotionBlurPostProcess = null;

        // SSAO
        if (this.SSAOPipeline) {
            const source = this.SSAOPipeline.serialize();
            this.SSAOPipeline.dispose(false);
            this.SSAOPipeline = null;
            try {
                this.GetSSAORenderingPipeline(scene);
                SerializationHelper.Parse(() => this.SSAOPipeline, source, scene!);
                scene!.render();
            } catch (e) {
                this._DisposePipeline(scene, this.SSAOPipeline);
            }
        }

        // Screen spsace reflections
        if (this._ScreenSpaceReflectionsEnabled) {
            try {
                this.GetScreenSpaceReflectionsPostProcess(scene);
                if (ssrSource) {
                    SerializationHelper.Parse(() => this.ScreenSpaceReflectionsPostProcess, ssrSource, scene!, "");
                }
                scene!.render();
            } catch (e) {
                this.ScreenSpaceReflectionsPostProcess!.dispose(scene!.activeCamera!);
            }
        }

        // Default
        if (this.DefaultPipeline) {
            const source = this.DefaultPipeline.serialize();
            this.DefaultPipeline.dispose();
            this.DefaultPipeline = null;

            try {
                this.GetDefaultRenderingPipeline(scene);
                SerializationHelper.Parse(() => this.DefaultPipeline, source, scene!);
                scene!.render();
            } catch (e) {
                this._DisposePipeline(scene, this.DefaultPipeline);
            }
        }

        // Motion Blur
        if (this._MotionBlurEnabled) {
            try {
                this.GetMotionBlurPostProcess(scene);
                if (motionBlurSource) {
                    SerializationHelper.Parse(() => this.MotionBlurPostProcess, motionBlurSource, scene!, "");
                }
                scene!.render();
            } catch (e) {
                this.MotionBlurPostProcess!.dispose(scene!.activeCamera!);
            }
        }
    }

    /**
     * Detaches the given rendering pipeline.
     */
    private static _DisposePipeline(scene: Scene, pipeline: Nullable<PostProcessRenderPipeline>): void {
        if (!pipeline) { return; }
        scene!.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(pipeline._name, scene!.cameras);
    }

}