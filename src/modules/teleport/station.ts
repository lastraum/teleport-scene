import { Display } from "./display";

export class TeleportStation extends Entity {
    private display1;
    private display2;

    locations:any[]=[]



    /**
     * create Teleport Station.
     * @param transform - transform for station.
     * @param useHotkeys - boolean which defines whether to use hotkeys E and F to scroll locations, or not.
     */
    constructor(transform: TranformConstructorArgs, useHotkeys: boolean) {

        super("teleport_station")

        const shape = new GLTFShape("src/modules/teleport/teleport_models/portal.glb")
        shape.isPointerBlocker = false
        this.addComponentOrReplace(shape)
        this.addComponentOrReplace(transform)
        engine.addEntity(this)

        executeTask(async()=>{
            let res = await fetch("https://raw.githubusercontent.com/lastraum/teleport-scene/main/locations.json")
            let coords = await res.json()
            this.locations = coords

            this.display1 = new Display(this, useHotkeys, true)
            this.display1.addComponentOrReplace(new Transform({
                position: new Vector3(0, 1.75, -0.029),
                rotation: Quaternion.Euler(0, 180, 0),
                scale: new Vector3(0.45, 0.9, 0.1)
            }))
    
            this.display2 = new Display(this, useHotkeys, false)
            this.display2.addComponentOrReplace(new Transform({
                position: new Vector3(0, 1.75, 0.029),
                scale: new Vector3(0.45, 0.9, 0.1)
            }))
            if (!useHotkeys) return
            const input = Input.instance
            input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
                this.inputForScroll(false)
            })
            input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
                this.inputForScroll(true)
            })
        })
    }


    /**
     * scroll to the next location in array.
     * @param plus - if true: scroll to the next frame, if false: scroll to the previous.
     */
    public inputForScroll(plus: boolean) {
        this.display1.scroll(plus)
        this.display2.scroll(plus)
    }

}

