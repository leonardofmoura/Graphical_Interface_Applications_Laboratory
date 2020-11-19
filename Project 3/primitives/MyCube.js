/**
 * MyCube
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param x - Scale of Cube in X
 * @param y - Scale of Cube in Y
 * @param z - Scale of Cube in Z
 */

class MyCube extends Primitive {

    constructor(scene,x,y,z){
        super(scene);
        this.x = x;
        this.y = y;
        this.z = z;
        this.initBuffers();
    }

    initBuffers() {

        this.rectangle = new MyRectangle2(this.scene)


    }

    display() {

        this.deg2rad=Math.PI/180.0;
        const a_rad = 90.0 * this.deg2rad;
        //Face de cima
        this.scene.pushMatrix();
        this.scene.translate(0,0.5*this.y,0);
        this.scene.rotate(-a_rad,1,0,0);
        this.scene.scale(this.x,this.z,1);
        this.rectangle.display();
        this.scene.popMatrix();

        //Face de baixo
        this.scene.pushMatrix();
        this.scene.translate(0,-0.5*this.y,0);
        this.scene.rotate(a_rad,1,0,0);
        this.scene.scale(this.x,this.z,1);
        this.rectangle.display();
        this.scene.popMatrix();


        //Face Lateral paralelo ao plano xy com z positivo
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5*this.z);
        this.scene.scale(this.x,this.y,1);
        this.rectangle.display();
        this.scene.popMatrix();


        //Face Lateral paralelo ao plano yz com x negativo
        this.scene.pushMatrix();
        this.scene.translate(-0.5*this.x,0,0);
        this.scene.rotate(-a_rad,0,1,0);
        this.scene.scale(this.z,this.y,1);
        this.rectangle.display();
        this.scene.popMatrix();


        //Face Lateral paralelo ao plano xy com z negativo
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5*this.z);
        this.scene.rotate(-a_rad*2,0,1,0);
        this.scene.scale(this.x,this.y,1);
        this.rectangle.display();
        this.scene.popMatrix();


        //Face Lateral paralelo ao plano yz com x positivo
        this.scene.pushMatrix();
        this.scene.translate(0.5*this.x,0,0);
        this.scene.rotate(a_rad,0,1,0);
        this.scene.scale(this.z,this.y,1);
        this.rectangle.display();
        this.scene.popMatrix();


    }

}