import {
    Scene, ActionManager, StandardRenderingPipeline, IAnimatable, ParticleSystem, Animatable,
} from 'babylonjs';


export default class SceneManager {
    // Public members
    public static ActionManagers: IStringDictionary<ActionManager> = {};
    public static StandardRenderingPipeline: Nullable<StandardRenderingPipeline> = null;

    /**
     * Clears the scene manager
     */
    public static Clear(): void {
        this.ActionManagers = {};
    }

    /**
     * Returns the animatable objects
     * @param scene the scene containing animatables
     */
    public static GetAnimatables(scene: Scene): IAnimatable[] {
        const animatables: IAnimatable[] = [scene];

        if (this.StandardRenderingPipeline) animatables.push(this.StandardRenderingPipeline);

        scene.meshes.forEach(m => animatables.push(m));
        scene.lights.forEach(l => animatables.push(l));
        scene.cameras.forEach(c => animatables.push(c));
        scene.transformNodes.forEach(t => animatables.push(t));
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        scene.particleSystems.forEach(ps => animatables.push(<ParticleSystem>ps));

        return animatables;
    }

    /**
     * Returns the animation frame bounds (min frame, max frame)
     * @param animatables the animtables to check
     */
    public static GetAnimationFrameBounds(animatables: IAnimatable[]): { min: number, max: number, loop: boolean } {
        const bounds = {
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
            loop: false,
        };

        animatables.forEach((a: IAnimatable) => {
            a.animations = a.animations || []
            a.animations.forEach(a => {
                bounds.loop = a.loopMode === 1;
                const keys = a.getKeys();

                keys.forEach(k => {
                    if (k.frame < bounds.min)
                        bounds.min = k.frame;
                    if (k.frame > bounds.max)
                        bounds.max = k.frame;
                });
            });
        });

        return bounds;
    }

    /**
     * Plays all the animtables
     * @param scene: the scene containing the animatables
     * @param animatables the animatables to play
     */
    public static PlayAllAnimatables(scene: Scene, animatables: IAnimatable[]): void {
        const bounds = SceneManager.GetAnimationFrameBounds(animatables);
        animatables.forEach(a => scene.beginAnimation(a, bounds.min, bounds.max, bounds.loop, 1.0, undefined, undefined, true));
    }

    /**
     * Stops all the animatables
     * @param scene the scene containing the animatables
     * @param animatables the animatable objects
     */
    public static StopAllAnimatables(scene: Scene, animatables: IAnimatable[]): void {
        const bounds = SceneManager.GetAnimationFrameBounds(animatables);
        animatables.forEach((a: IAnimatable) => {
            let animatable = scene.getAnimatableByTarget(a);
            if (!animatable)
                animatable = new Animatable(scene, a, bounds.min, bounds.max, false, 1.0);

            animatable.appendAnimations(a, a.animations || []);
            animatable.stop();
            animatable.goToFrame(bounds.min);

        });
    }

}
