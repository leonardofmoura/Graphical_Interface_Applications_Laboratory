/**
 * MyRectangle
 * @constructor
 * @extends CGFobject
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
	constructor(scene) {
        super(scene);
        this.scene = scene;
        this.texture = null;

        this.init();
    }

    /**
     * Inializes all the atributes of the security camera
     */
    init() {
        this.rectangle = new MyRectangle(this.scene,null,0.5,1.0,-1,-0.5);

        this.recTex = new CGFtexture(this.scene,"shaders/rec.png");
        this.shader = new CGFshader(this.scene.gl, "shaders/security_camera.vert","shaders/security_camera.frag");
        this.shader.setUniformsValues({ uSampler2 : 1});
    }

    /**
     * Sets the render to texture of the security camera
     * @param {CGFtextureRTT} rtt - Render to texture object
     */
    setTex(rtt) {
        this.texture = rtt;
    }

    /**
     * Sets the time_factor in the fragment shader
     * @param {Integer} time - The current time in milliseconds
     */
    setTime(time) {
        this.shader.setUniformsValues({ time_factor: time / 100 % 1000 });
    }
    
    /**
     * Displays the security camera
     */
    display() {
        if (this.texture == null) {
            return;
        }

        this.recTex.bind(1);
        this.scene.setActiveShader(this.shader);
        this.texture.bind();
        this.rectangle.display();
        this.texture.unbind();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}

