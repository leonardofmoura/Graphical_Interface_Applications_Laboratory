/**
 * MyGameBoardSection
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param boardpl - Game Board matrix received from prolog
 * @param boardinf - Board list of influences
 */

class MyGameBoardSection extends Primitive {

    constructor(scene){
        super (scene);
        //this.boardpl = boardpl;
        //this.boardinf = boardinf;
        this.initBuffers();
        this.texturesApplied = false;
    }



    initBuffers() {

        this.cube1 = new MyCube(this.scene,2,0.05,2);
        this.cube2 = new MyCube(this.scene,0.05, 0.05,2);
        this.cube3 = new MyCube(this.scene, 2, 0.05,0.05);

        //Dimensoes das peças a inserir (x,y,z) = (0.6,0.05,0.6)

        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.boardMaterial.setDiffuse(1.0, 1.0, 1.0, 1);
        this.boardMaterial.setSpecular(1.0, 1.0, 1.0, 1);
        this.boardMaterial.setShininess(10);

        this.boardSeparatorMaterial = new CGFappearance(this.scene);
        this.boardSeparatorMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.boardSeparatorMaterial.setDiffuse(1.0, 1.0, 1.0, 1);
        this.boardSeparatorMaterial.setSpecular(1.0, 1.0, 1.0, 1);
        this.boardSeparatorMaterial.setShininess(10);

    }

    setTextures(boardTex,sepTex) {
        this.texture = new CGFtexture(this.scene,boardTex);
        this.boardMaterial.setTexture(this.texture);
        this.sepTex = new CGFtexture(this.scene,sepTex);
        this.boardSeparatorMaterial.setTexture(this.sepTex);
        this.texturesApplied = true;
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(-0.1,0,-0.1)

        this.scene.pushMatrix();
        if (this.texturesApplied) {
            this.boardMaterial.apply();
        }
        this.scene.translate(0,-0.05,0);
        this.cube1.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        if (this.texturesApplied) {
            this.boardSeparatorMaterial.apply();
        }
        this.scene.translate(-0.975,0,0);
        this.cube2.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-0.3,0,0);
        this.cube2.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0.35,0,0);
        this.cube2.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(1,0,0);
        this.cube2.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0,0,1);
        this.cube3.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.35);
        this.cube3.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.3);
        this.cube3.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.975);
        this.cube3.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }



}