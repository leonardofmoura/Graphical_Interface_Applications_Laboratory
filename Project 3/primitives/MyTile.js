/**
 * MyTile
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param row - Row in which the Tile is in
 * @param col - Column in which the Tile is in
 */

class MyTile extends PickableObject {

    constructor(scene,row,col,pickID){
        super(scene);
        this.piece = null;
        this.pickID = pickID;
        this.row = row;
        this.col = col;
        this.pickEnabeled = false;
        this.highlighted = false;
        this.textureSet = false;
        this.initBuffers();

    }

    initBuffers() {
        this.rectangle = new MyRectangle2(this.scene);
        this.shader = new CGFshader(this.scene.gl, "shaders/tile_highlight.vert","shaders/tile_highlight.frag");

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1);
        this.material.setDiffuse(1.0, 1.0, 1.0, 1);
        this.material.setSpecular(1.0, 1.0, 1.0, 1);
        this.material.setShininess(10);
    }

    setOrchestrator(orchestrator) {
        this.orchestrator = orchestrator;
        if (this.piece != null) {
            this.piece.setOrchestrator(orchestrator);
        }
    }

    setTexture(texture) {
        this.texture = new CGFtexture(this.scene,texture);
        this.material.setTexture(this.texture);
        this.textureSet = true;
    }

    /**
     * Registers the tile to be pickable
     * Should be called before the tile is displayed 
     */
    enablePick() {
        if (this.piece == null) {
            this.pickEnabeled = true;
        }
    }

    execPick() {
        this.orchestrator.notifyPlayMade([this.row,this.col]); 
    }

    highlight() {
        this.highlighted = true;
    }

    unhighlight() {
        this.highlighted = false;
    }

    setTime(time) {
        if (this.piece != null) {
            this.piece.setTime(time);
        }
        this.shader.setUniformsValues({ time_factor: time / 100 % 1000 });
    }

    /**
     * Sets a Piece on the Tile
     * @param piece piece that is set on the tile
     */
    setPiece(piece){
        this.piece = piece;
    }


    /**
     * Unsets a Piece on the Tile
     */
    unsetPiece(){
        this.piece = null;
    }

    /**
     * Gets the piece that is on the Tile
     */
    getPiece(){
        return this.piece;

    }

    /**
     * Needs to be a seperate function because of the animations
     */
    displayPiece() {
        if (this.piece != null) {
            this.piece.display();
        }
    }

    display() {

        this.deg2rad=Math.PI/180.0;
        const a_rad = 90.0 * this.deg2rad;
        this.scene.pushMatrix();
        this.scene.translate(0,-0.05,0);
        this.scene.rotate(-a_rad,1,0,0);
        this.scene.scale(0.6,0.6,1);

        if (this.highlighted) {
            this.scene.registerForPick(this.pickID,this); // The piece is only Pickable if highlihted
            this.scene.setActiveShader(this.shader);
        }

        if (this.textureSet) {
            this.material.apply();
        }

        this.rectangle.display();

        if (this.highlighted) {
            this.scene.setActiveShader(this.scene.defaultShader);
            this.pickEnabeled = false; //Picking disabeled by default
            this.scene.clearPickRegistration();
        }

        this.scene.popMatrix();

        if (this.piece != null) {
            this.piece.display();
        }
    }
}