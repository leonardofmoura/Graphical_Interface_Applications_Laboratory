class GameInterface extends CGFobject{
    constructor(scene,orchestrator,mainTexure,buttonTextures) {
        super(scene);
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.mainTexture = mainTexure;
        this.buttonTextures = buttonTextures;

        this.init();
    }

    init() {
        this.texture = new CGFtexture(this.scene,this.mainTexture);
        this.menuMaterial = new CGFappearance(this.scene);
        this.menuMaterial.setAmbient(1.0, 1.0, 1.0, 1);
		this.menuMaterial.setDiffuse(1.0, 1.0, 1.0, 1);
		this.menuMaterial.setSpecular(1.0, 1.0, 1.0, 1);
        this.menuMaterial.setShininess(10);
        this.menuMaterial.setTexture(this.texture);

        this.rectangle = new MyRectangle(this.scene, null,-5,5,-5,5);

        this.createButtons();
    }

    undo() {
        this.orchestrator.notifyUndo();
    }
    
    createButtons() {
        let undo = function() {
            this.mainMenu.undo();
        }

        this.buttons = [
            new MainMenuButton(this.scene,this,80,this.buttonTextures[0],[-3,3,-4,-2],undo),
        ];
    }

    resetButtonHighlight() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].highlighted = false;
        }
    }

    updatePlayerMode(playerMode) {
        this.orchestrator.playerMode = playerMode;
    }

    updateButtons(t) {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].setTime(t);
        }
    }

    displayButtons() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].display();
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.17,0.17,0.17);
        this.scene.rotate(Math.PI/2,-1,0,0);
        this.menuMaterial.apply();
        this.rectangle.display();
        this.displayButtons();
        this.scene.popMatrix();
    }
}