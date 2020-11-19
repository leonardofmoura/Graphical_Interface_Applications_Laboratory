/**
 * @param scene
 * @param {String} mainTexure the texture of the menu
 * @param {String Array} buttonTextures the textures to be used in the buttons in order
 */
class MainMenu extends CGFobject {
    constructor(scene,orchestrator,transformationMatrix,mainTexure,buttonTextures,pieceTextures,score) {
        super(scene);
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.mainTexture = mainTexure;
        this.buttonTextures = buttonTextures;
        this.transformationMatrix = transformationMatrix;
        this.pieceTextures = pieceTextures;
        this.score = score;

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
    
    createButtons() {
    let playButton = function() {
            this.mainMenu.startGame();
        }

        let twoPlayers = function() {
            if (this.highlighted) {
                this.mainMenu.updatePlayerMode(PlayerMode.none);
                this.highlighted = false;
            }
            else {
                this.mainMenu.resetButtonHighlight();
                this.mainMenu.updatePlayerMode(PlayerMode.twoPlayers);
                this.highlighted = true;
            }
        }

        let playerBot = function() {
            if (this.highlighted) {
                this.mainMenu.updatePlayerMode(PlayerMode.none);
                this.highlighted = false;
            }
            else {
                this.mainMenu.resetButtonHighlight();
                this.mainMenu.updatePlayerMode(PlayerMode.playerBot);
                this.highlighted = true;
            }
        }

        let twoBots = function() {
            if (this.highlighted) {
                this.mainMenu.updatePlayerMode(PlayerMode.none);
                this.highlighted = false;
            }
            else {
                this.mainMenu.resetButtonHighlight();
                this.mainMenu.updatePlayerMode(PlayerMode.twoBots);
                this.highlighted = true;
            }
        }

        this.buttons = [
            new MainMenuButton(this.scene,this,1,this.buttonTextures[0],[-3,3,-4,-2],playButton),
            new MainMenuButton(this.scene,this,2,this.buttonTextures[1],[-3,-1.25,-1.5,-0.5],twoPlayers),
            new MainMenuButton(this.scene,this,3,this.buttonTextures[2],[-1,0.75,-1.5,-0.5],playerBot),
            new MainMenuButton(this.scene,this,4,this.buttonTextures[3],[1,3,-1.5,-0.5],twoBots),
            new MainMenuButton(this.scene,this,null,this.pieceTextures[0][this.score[0]],[-2.5,-1,0,2.5],null),
            new MainMenuButton(this.scene,this,null,this.pieceTextures[1][this.score[1]],[1,2.5,0,2.5],null),
        ];
    }

    startGame() {
        if (this.orchestrator.playerMode != PlayerMode.none) {
            this.orchestrator.manageEvent(GameEvent.startPlay);
        }
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
        this.scene.multMatrix(this.transformationMatrix);
        this.menuMaterial.apply();
        this.rectangle.display();
        this.displayButtons();
        this.scene.popMatrix();
    }
}