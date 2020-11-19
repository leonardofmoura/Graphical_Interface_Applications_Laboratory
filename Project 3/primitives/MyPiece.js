/**
 * MyPiece
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param type - Type of Piece (its number in this game)
 * @param Player - Play to which this piece belongs to.
 * @param startTime - the start time of the animation
 * @param initPos the initial position in the board referential
 * @param finalPos the final position in the tile referential
 * @param pickID - the id of the piece for picking
 */
class MyPiece extends PickableObject {

    constructor(scene,type, player,startTime,initPos,finalPos,pickID,textureFile){
        super(scene);
        this.scene = scene;
        this.initPos = initPos;
        this.finalPos = finalPos;
        this.startTime = startTime;
        this.animation = null;
        this.animationComplete = false;
        this.textureFileName = textureFile;

        if (type > 8 && type < 0) {
            throw new Error("Invalid Piece Type");
        }

        if (player != Player.playerOne && player != Player.playerTwo) {
            throw new Error("Invalid Player");
        }

        this.pickID = pickID;

        this.type = type;
        this.player = player;
        this.pickEnabeled = false;
        this.highlighted = false;

        this.initBuffers()
    }

    initBuffers() {
        this.cube = new MyCube(this.scene, 0.6,0.05,0.6);
        this.shader = new CGFshader(this.scene.gl, "shaders/piece_highlight.vert","shaders/piece_highlight.frag");
        if (this.initPos != null && this.startTime != null) {
            let startPos = [this.initPos[0]-this.finalPos[0],this.initPos[1]-this.finalPos[1],this.initPos[2]-this.finalPos[2]];
            this.animation = new KeyFrameAnimation(this.scene); 
            this.animation.setStartingTime(this.startTime);
            let keyframe1 = new KeyFrame(0);
            keyframe1.setTranslation(startPos[0],startPos[1],startPos[2]);
            let keyframe2 = new KeyFrame(0.2);
            keyframe2.setTranslation(startPos[0]/2,0.5,startPos[2]/2);
            let keyframe3 = new KeyFrame(0.4);
            keyframe3.setTranslation(startPos[0]/4,1,startPos[2]/4);
            let keyframe4 = new KeyFrame(0.6);
            keyframe4.setTranslation(startPos[0]/6,0.5,startPos[2]/6);
            let keyframe5 = new KeyFrame(0.8);
            keyframe5.setTranslation(0,0,0);
            this.animation.addKeyFrame(keyframe1);
            this.animation.addKeyFrame(keyframe2);
            this.animation.addKeyFrame(keyframe3);
            this.animation.addKeyFrame(keyframe4);
            this.animation.addKeyFrame(keyframe5);
        }
        if (this.textureFileName != null) {
            this.initTexture();
        }
    }

    initTexture() {
        this.texture = new CGFtexture(this.scene,this.textureFileName);
        this.pieceMaterial = new CGFappearance(this.scene);
        this.pieceMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.pieceMaterial.setDiffuse(1.0, 1.0, 1.0, 1);
        this.pieceMaterial.setSpecular(1.0, 1.0, 1.0, 1);
        this.pieceMaterial.setShininess(10);
        this.pieceMaterial.setTexture(this.texture);
    }

    setOrchestrator(orchestrator) {
        this.orchestrator = orchestrator;
    }

    setTexture(texFile) {
        this.textureFileName = texFile;
        this.initTexture();
    }

    /**
     * Sets the time_factor in the shaders
     * @param {Integer} time - The current time in milliseconds
     */
    setTime(time) {
        if (this.animation != null) {
            this.animation.update(time);
        }
        this.shader.setUniformsValues({ time_factor: time / 100 % 1000 });
    }

    /**
     * Registers the piece to be pickable
     * Should be called before the piece is displayed 
     */
    enablePick() {
        this.pickEnabeled = true;
    }

    highlight() {
        this.highlighted = true;
    }

    unhighlight() {
        this.highlighted = false;
    }

    execPick() {
        this.orchestrator.notifyPieceSelection(this.type,this.player);
    }

    /**
     * Gets the type of a given Piece
     */
    getType(){
        return this.type;
    }

    /**
     * Sets the Type of a given Piece
     * @param tipo the type the piece is set to
     */
    setType(tipo){
        this.type = tipo;
    }

    display(){
        if (this.pickEnabeled) {
            this.scene.registerForPick(this.pickID,this);
        }

        if (this.highlighted) {
            this.scene.setActiveShader(this.shader);
        }

        if (this.animation != null && !this.animationComplete) {
            let compare = mat4.create();
            if (MyMath.equals(compare,this.animation.animation_matrix)) {
                this.animationComplete = true;
                this.orchestrator.notifyAnimationComplete();
            }
            else {
                this.scene.pushMatrix();
                this.animation.apply();
                if (this.player == Player.playerTwo) {
                    this.scene.rotate(Math.PI,0,1,0); //Rotate piece in player 2 animation
                }
            }
        }

        if (this.textureFileName != null) {
            this.pieceMaterial.apply();
        }

        this.cube.display();

        if (this.animation != null && !this.animationComplete) {
            this.scene.popMatrix();
        } 

        if (this.highlighted) {
            this.scene.setActiveShader(this.scene.defaultShader);
        }

        if (this.pickEnabeled) {
            this.pickEnabeled = false; //Picking disabeled by default
            this.scene.clearPickRegistration();
        }
    }
}