/**
 * MyCylinder2
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param base - Radius of the base
 * @param top - Radius of the top
 * @param height - Height of the cylinder
 * @param slices - Number of divisions in rotation
 * @param stacks - Number of divisions in height
 */

class MyCylinder2 extends Primitive {
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    /**
     * Initializes the buffers of the primitive
     */
    initBuffers(){

        this.raioalturabase = 4/3 * this.base;
        this.raioalturatop= 4/3 * this.top;

        if (this.base > this.top){
            this.declivex = (this.base-this.top)/this.height;
            this.meiox = this.declivex*(this.height/2) + this.top;
            this.meioy = 4/3*this.meiox;
        }else if (this.base < this.top){
            this.declivex = (this.top-this.base)/this.height;
            this.meiox = this.declivex*(this.height/2) + this.base;
            this.meioy = 4/3*this.meiox;
        }else{
            this.meiox = this.base;
            this.meioy = this.raioalturabase;
        }

        this.controlpoints1 = [
            [ -this.base, 0.0, 0, 1 ],
            [ -this.base, this.raioalturabase, 0, 1 ],
            [ this.base,  this.raioalturabase, 0, 1 ],
            [ this.base,  0, 0, 1 ],
            [ -this.meiox, 0.0, this.height/2, 1 ],
            [ -this.meiox, this.meioy, this.height/2, 1 ],
            [ this.meiox,  this.meioy, this.height/2, 1 ],
            [ this.meiox,  0, this.height/2, 1 ],
            [ -this.top, 0.0,this.height, 1 ],
            [ -this.top, this.raioalturatop, this.height, 1 ],
            [ this.top,  this.raioalturatop, this.height, 1 ],
            [ this.top,  0, this.height, 1 ],
        ];

        this.controlpoints2 = [
            [ -this.top, 0.0, this.height, 1 ],
            [ -this.top, -this.raioalturatop, this.height, 1 ],
            [ this.top,  -this.raioalturatop, this.height, 1 ],
            [ this.top,  0, this.height, 1 ],
            [ -this.meiox, 0.0, this.height/2, 1 ],
            [ -this.meiox, -this.meioy, this.height/2, 1 ],
            [ this.meiox,  -this.meioy, this.height/2, 1 ],
            [ this.meiox,  0, this.height/2, 1 ],
            [ -this.base, 0.0, 0, 1 ],
            [ -this.base, -this.raioalturabase, 0, 1 ],
            [ this.base,  -this.raioalturabase, 0, 1 ],
            [ this.base,  0, 0, 1 ]
        ];



        this.patch1 = new MyPatch(this.scene, 3,4,this.slices/2,this.stacks,this.controlpoints1);
        this.patch2 = new MyPatch(this.scene, 3,4,this.slices/2,this.stacks,this.controlpoints2);

    }

    /**
     * Displays the primitive
     */
    display(){
        this.patch1.display();
        this.patch2.display();
    }
}