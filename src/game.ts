import { TeleportStation } from "./modules/teleport/station";



const tpTransform = new Transform({
    position: new Vector3(8, 0, 16),
    scale: new Vector3(1.25, 1.25, 1.25),
    rotation: Quaternion.Euler(0,0,0)
})
const tp = new TeleportStation(tpTransform, true)
