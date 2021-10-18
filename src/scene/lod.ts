import { Mesh } from 'babylonjs';

export class LOD {

    public static Building(mesh: Mesh) {
        if (mesh.name.toLowerCase().indexOf('building') !== -1) {
            if (mesh.metadata.height < 3.5) {
                mesh.addLODLevel(150, null);
            } else if (mesh.metadata.height < 6) {
                mesh.addLODLevel(300, null);
            }
        }
    }

}