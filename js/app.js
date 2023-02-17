/* Middle Screen */
let x = 640;
let y = 305;
let ruleta;
let puntero;

let elems = [];
// Grados de cada división de la ruleta
let divisiones = 14;
let premios = ['TRaje solo', 'tres trajes', 'impresora', 'camion-frente', 'repetir', 'chat', 'tres baolado', 'repetir', 'camion lado', 'camiseta', 'Mascaras', 'Gorra', 'barco?', 'engrane cabeza'];
let rotate = false;

let text;

/* Velocidad */
    let velocidad = 1;
    let valocity_handler = true;
    let limite;
/* --- */

    let vueltas = 0;

class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    } 
 
    preload(){  
        this.load.image('Base', './assets/Base_1.png');
        this.load.image('ruleta', './assets/ruleta1-circulo.png');
        this.load.image('fondo-2', './assets/fondo-2.jpg');
        this.load.image('fondo-2', './assets/fondo-2.jpg');
        this.load.image('header', './assets/header.png');
        this.load.image('header', './assets/header.png');
        this.load.image('puntero', './assets/puntero-ruleta1.png');

        let rect2 = this.make.graphics().fillStyle(0xFFFFFF).fillRect(0, 0, 130, 25);
        rect2.generateTexture('rectangle', 70, 25);
    }
 
    create(){
        this.add.image((this.sys.game.canvas.width/2), (this.sys.game.canvas.height/2), 'fondo-2').setScale(.7);
        this.add.image(900, 450, 'Base').setScale(.7);
        this.add.image(480, 250, 'header').setScale(.5);
        ruleta = this.add.sprite(900, 250, 'ruleta').setScale(.7);
        this.add.image(480, 250, 'ruleta').setScale(.7).setAngle(270)
        
        ruleta.setAngle(0);

        text = this.add.text(10, 50, '', { font: '16px Courier', fill: '#ffffff' });

        const circle = new Phaser.Geom.Circle(900, 250, 160);
        this.group = this.add.group({ key: 'rectangle', frameQuantity: 14 });

        Phaser.Actions.PlaceOnCircle(elems, circle);
    }

    /* Calcula los rangos de la ruleta 
        360/14 = 25.7
        -157.5 + 360 = 202.5 
        360/divisiones = grados de cada division
        grado
    */
    getRangos(divisiones){
        let rangos = [];
        let grados = 360/divisiones;
        let cont;
        let acumGrados = 0;
        
        cont = 0;
        while(cont < divisiones){
            rangos.push({
                min: acumGrados,
                max: (acumGrados += grados),
                premio: premios[cont]
            });
            cont++;
        }
        return rangos;
    }

    getPremio(angle, rangos){
        if (angle < 0){
            angle = angle + 360;
        }

        // puntero.setAngle(angle);

        // 270
        console.log(angle);
        console.log(rangos);
        rangos.forEach((elem) => {
            if (angle >= elem.min && angle < elem.max){
                console.log(elem.premio);
            }
        });
    }

    rotar(){
        velocidad = 1;
        rotate = !rotate;
        limite = this.getRndInteger(15, 25);
        // console.log("Límite: "+limite);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    update(){
        if (rotate){
            // console.log(velocidad);
            /*
            Aumenta la velocidada cada PASO.
            Hasta el límmite. 
            Luego resta la velocidad hasta cero.
             */
            if (valocity_handler && velocidad > limite){
                valocity_handler = !valocity_handler;
            }

            if (valocity_handler && !(velocidad == 0)){
                velocidad += 1;
            }

            if (!valocity_handler && !(velocidad <= 0)){
                velocidad -= .1;
            }
            ruleta.angle += velocidad;
            console.log("X: "+ruleta.x);
            console.log("Y: "+ruleta.y);
            Phaser.Actions.RotateAroundDistance(elems, { x: 900, y: 250 }, ruleta.angle, 160);
            
            if (velocidad < 0){
                rotate = !rotate;
                valocity_handler = !valocity_handler;
                this.getPremio(ruleta.angle, this.getRangos(divisiones));
            }

            text.setText([
                'Sprite Rotation',
                'Angle: ' + ruleta.angle.toFixed(2),
                'Rotation: ' + ruleta.rotation.toFixed(2)
            ]);
        }
    }
}


// Configuracion general
const config = {
    // Phaser.AUTO, intenta usa WebGL y si el navegador no lo tiene, usa canva.
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 610,
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            // gravity: { y: 350 }
        }
    }
}

// Inicializacion del objeto
game = new Phaser.Game(config)