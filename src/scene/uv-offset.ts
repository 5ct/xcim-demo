import { Scene, Texture } from 'babylonjs';

class UVOffset {

    public static init(scene: Scene, uvOffsets: any[]) {

        uvOffsets.forEach(uvOffset => {
            // Get material
            const material: any = scene.getMaterialByID(uvOffset.id);
            if (material) {

                // Animate vOffset
                if (material.emissiveTexture && material.emissiveTexture instanceof Texture) {
                    scene.registerAfterRender(() => {
                        material.emissiveTexture.vOffset += uvOffset.value;
                    })
                }

                if (material.opacityTexture && material.opacityTexture instanceof Texture) {
                    scene.registerAfterRender(() => {
                        material.opacityTexture.vOffset += uvOffset.value;
                    })
                }
            }
        });

    }
}

export default UVOffset;