/* Middle Screen */
let x = 640;
let y = 305;
let ruleta; 
let puntero;

let bars = [];
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

    /* Formmualrios */
        let formElem;
    /*  */

class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    } 
 
    preload(){  
        this.load.image('Base', './assets/Base_1.png');
        this.load.image('ruleta', './assets/ruleta1-circulo.png');
        this.load.image('fondo-2', './assets/fondo-2.jpg');
        this.load.image('fondo-3', './assets/Fondo-3.jpg');
        this.load.image('header', './assets/header.png');
        this.load.image('header', './assets/header.png');
        this.load.image('puntero', './assets/puntero-ruleta1.png');
        this.load.html('formulario', './form.html');

        let rect2 = this.make.graphics().fillStyle(0xFFFFFF).fillRect(50, 50, 130, 25);
        rect2.generateTexture('rectangle', 70, 25);
    }
  
    create(){
        this.add.image((this.sys.game.canvas.width/2), (this.sys.game.canvas.height/2), 'fondo-2').setScale(.7);
        this.add.image(900, 450, 'Base').setScale(.7);
        this.add.image(480, 250, 'header').setScale(.5);
        ruleta = this.add.sprite(900, 250, 'ruleta').setScale(.7);
        puntero = this.physics.add.sprite(900, 80, 'puntero').setScale(.45);
        puntero.setSize(true, 100, 120);
        
        bars = this.setBars(divisiones, this);

        text = this.add.text(10, 50, '', { font: '16px Courier', fill: '#ffffff' });

        const circle = new Phaser.Geom.Circle(900, 250, 160);
        this.group = this.add.group({ key: 'rectangle', frameQuantity: 14 });
        Phaser.Actions.PlaceOnCircle(bars, circle);


        /* Form */
        this.add.image((this.sys.game.canvas.width/2), (this.sys.game.canvas.height/2), 'fondo-3').setScale(.7);
            formElem = this.add.dom((this.sys.game.canvas.width/2), (this.sys.game.canvas.height/6)).createFromCache('formulario');
        /* --- */
    }

    /* Calcula los rangos de la ruleta 
        360/14 = 25.7
        -157.5 + 360 = 202.5 
        360/divisiones = grados de cada division
        grado

        IDEA DESECHADA
    */
    // getRangos(divisiones){
    //     let rangos = [];
    //     let grados = 360/divisiones;
    //     let cont;
    //     let acumGrados = 0;
        
    //     cont = 0;
    //     while(cont < divisiones){
    //         rangos.push({
    //             min: acumGrados,
    //             max: (acumGrados += grados),
    //             premio: premios[cont]
    //         });
    //         cont++;
    //     }
    //     return rangos;
    // }

    /*  
        Crea un arreglo con elementos 
        - Inserta el nombre del premio
        - Los elementos se ordenan en el circulo de arriba hacia abajo, 
           De derecha a izquierda
    */
    setBars(divisiones, context){
        let cont = 0;
        let bars = [];
        let elem;

        while(cont < divisiones){
            elem = context.physics.add.sprite(0, 0, 'rectangle');
            elem.premio = premios[cont];
            elem.visible = false;
            bars.push(elem);
            cont++;
        }
        console.log(bars);
        return bars;
    }


    getPremio(){
        // Hace rotar las barras al ángulo del a ruleta (RotateAroundDistance funciona con radianes)
        Phaser.Actions.RotateAroundDistance(bars, { x: 900, y: 250 }, ruleta.rotation, 160);
        /* 
            El comportamiento normal del evento es ser ejecutado todo el tiempo mientrras este se cumpla.
            Con esto logro ejecutarlo solo una vez.
        */
        bars.forEach((elem) => {
            this.physics.add.collider(elem, puntero, function(bar = elem){
                alert(bar.premio);
                bar.disableBody(true, true);
            });
        });

    }

    rotar(){
        velocidad = 1;
        rotate = !rotate;
        // Veolicdad aleatoria
        limite = this.getRndInteger(15, 30);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    update(){
        if (rotate){
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

            if (velocidad < 0){
                rotate = !rotate;
                valocity_handler = !valocity_handler;
                puntero.setAngle(0);
                this.getPremio();
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
    dom: {
        createContainer: true
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            // gravity: { y: 350 }
        }
    }
}

// Inicializacion del objeto
game = new Phaser.Game(config)