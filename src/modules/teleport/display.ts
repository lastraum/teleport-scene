import * as utils from '@dcl/ecs-scene-utils'


export class Display extends Entity {

    private parent;
    private display;
    private currentframe = 0;

    private framecount = 0;

    private modelsPath =  "src/modules/teleport/teleport_models/"
    private buttonsPath = ["button1.glb", "button2.glb", "button3.glb", "button4.glb", "button5.glb", "button6.glb"]

    private locationsArray = [
        "-117,-35",
        "-80,-57",
        "-120,-16",
        "64,13",
        "95,-117",
        "73,15",
        "94,-13",
        "2,19",
        "2,16",
        "-49,69",
        "109,-16",
        "-86,108",
        "-109,21",
        "55,14",
        "73,13",
        "-91,-13",
    ]


    //
    public nearDisplay = false;
    //


    constructor(_parent: IEntity, withHotkeysTips: boolean, diff: boolean) {
        super()
        log("this framecount = " + this.framecount)
        this.framecount = this.locationsArray.length - 1;
        this.parent = _parent
        this.setParent(_parent)


        let triggerPosition = 1.5
        if (diff) triggerPosition = -1.5
        let triggerBox = new utils.TriggerBoxShape(new Vector3(6, 4, 6), new Vector3(0, 0, 0))
        this.addComponentOrReplace(
            new utils.TriggerComponent(
                triggerBox,
                {
                    //enableDebug: true,
                    onCameraEnter: () => {
                        this.nearDisplay = true
                        log("playerHere!")
                    },
                    onCameraExit: () => {
                        this.nearDisplay = false
                    }
                }
            )
        )

        const displayTexture = new Material()
        displayTexture.albedoTexture = new Texture("src/modules/teleport/fw_brand_sprites.png")
        displayTexture.albedoColor = new Color3(1.5, 1.5, 1.5)
        displayTexture.transparencyMode = 1
        displayTexture.alphaTest = 0.3
        // displayTexture.emissiveColor = Color3.Gray()
        // displayTexture.emissiveIntensity = 3

        const displayShape = new PlaneShape()
        this.currentframe = this.randomFrame()
        displayShape.uvs = this.setUVS(this.currentframe)
        this.display = displayShape

        this.addComponent(displayShape)
        this.addComponent(displayTexture)



        let pathnums = []
        if (diff) pathnums = [0, 1, 2]
        else pathnums = [3, 4, 5]

        let names = ["", "", ""]
        if (withHotkeysTips) names = ["\nPress: E", "\nScroll: E/F", "\nPress: F"]

        const clickLeft = this.scrollButton("Scroll Left " + names[0], this.buttonsPath[pathnums[0]], false)
        const clickmiddle = this.teleportButton("Click: Teleport" + names[1], this.buttonsPath[pathnums[1]])
        const clickRight = this.scrollButton("Scroll Right " + names[2], this.buttonsPath[pathnums[2]], true)


        this.addComponentOrReplace(new OnPointerDown((e) => {
            this.teleportTo()
        },
            {
                button: ActionButton.POINTER,
                showFeedback: true,
                distance: 3,
                hoverText: "Click: Teleport" + names[1],
            }
        ))


    }




    teleportButton(htext, model) {
        const btn = new Entity()
        let shape = new GLTFShape(this.modelsPath + model)
        btn.addComponentOrReplace(shape)

        btn.setParent(this.parent)
        const clickeffect = new OnPointerDown((e) => {
            this.teleportTo()
        },
            {
                button: ActionButton.POINTER,
                showFeedback: true,
                distance: 3,
                hoverText: htext,
            }
        )

        btn.addComponentOrReplace(clickeffect)

        return btn;
    }
    public teleportTo() {
        teleportTo(this.locationsArray[this.currentframe])
    }




    scrollButton(htext, model, plus) {

        const btn = new Entity()
        let shape = new GLTFShape(this.modelsPath + model)
        btn.addComponentOrReplace(shape)


        btn.setParent(this.parent)
        const clickeffect = new OnPointerDown((e) => {
            this.scroll(plus)
        },
            {
                button: ActionButton.POINTER,
                showFeedback: true,
                distance: 3,
                hoverText: htext,
            }
        )

        btn.addComponentOrReplace(clickeffect)

        return btn;
    }
    public scroll(plus: boolean) {
        //dostuff
        if (!this.nearDisplay) return;
        if (plus) {
            let number = this.currentframe + 1
            if (number <= this.framecount) {
                this.currentframe++
            }
            else {
                this.currentframe = 0
            }

        }
        else {
            let number = this.currentframe - 1
            if (number >= 0) {
                this.currentframe--
            }
            else {
                this.currentframe = this.framecount
            }
        }


        this.display.uvs = this.setUVS(this.currentframe)
        log("this curframe = " + this.currentframe)

    }


    randomFrame() {
        let num = Math.floor(Math.random() * this.locationsArray.length)
        return num
    }



    setUVS(frame) {
        const newX = (frame % 8) * 0.125;
        const newY = 0.5 - (0.5 * Math.floor(frame / 8));
        return [
            newX, newY,
            0.125 + newX, newY,
            0.125 + newX, newY + 0.5,
            newX, newY + 0.5,

            0, 0,
            0, 0,
            0, 0,
            0, 0,
        ]
    }
}

