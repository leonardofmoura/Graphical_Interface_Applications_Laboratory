class MainMenuButton extends PickableObject {
    constructor(scene,mainMenu,id,textureFilename,dimenstions,execution) {
        super(scene);
        this.scene = scene;
        this.mainMenu = mainMenu;
        this.id = id;

        this.textureFilename = textureFilename;
        this.dimenstions = dimenstions;
        this.execution = execution;
        this.highlighted = false;

        this.init();
    }

    execPick() {
        this.execution();
    }

    init() {
        this.texture = new CGFtexture(this.scene,this.textureFilename);
        this.menuMaterial = new CGFappearance(this.scene);
        this.menuMaterial.setAmbient(1.0, 1.0, 1.0, 1);
		this.menuMaterial.setDiffuse(1.0, 1.0, 1.0, 1);
		this.menuMaterial.setSpecular(1.0, 1.0, 1.0, 1);
        this.menuMaterial.setShininess(10);
        this.menuMaterial.setTexture(this.texture);

        this.rectangle = new MyRectangle(this.scene, null,this.dimenstions[0],this.dimenstions[1],this.dimenstions[2],this.dimenstions[3]);
        this.shader = new CGFshader(this.scene.gl, "shaders/buttonHighlight.vert","shaders/buttonHighlight.frag");
    }

    /**
     * Sets the time_factor in the fragment shader
     * @param {Integer} time - The current time in milliseconds
     */
    setTime(time) {
        this.shader.setUniformsValues({ time_factor: time / 100 % 1000 });
    }

    display() {
        this.scene.registerForPick(this.id,this);
        this.menuMaterial.apply();
        if (this.highlighted) {
            this.scene.setActiveShader(this.shader);
        }
        this.scene.translate(0,0,0.1);
        this.rectangle.display();
        if (this.highlighted) {
            this.scene.setActiveShader(this.scene.defaultShader);
        }
        this.scene.clearPickRegistration();
    }
}