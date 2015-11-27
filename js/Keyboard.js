(function() {
    function parseSecond(val) {
        var result = "Not found",
        tmp = [];
        var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
        }
        return result;
    }


    // Matter aliases
    var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    RenderPixi = Matter.RenderPixi,
    Events = Matter.Events,
    Bounds = Matter.Bounds,
    Vector = Matter.Vector,
    Vertices = Matter.Vertices,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Query = Matter.Query;

    // MatterTools aliases
    //if (window.MatterTools) {
    //    var Gui = MatterTools.Gui,
    //        Inspector = MatterTools.Inspector;
    //}
    var Keyboard = {};

    var _engine,
    _gui,
    _inspector,
    _sceneName,
    _mouseConstraint,
    _sceneEvents = [],
    _useInspector = window.location.hash.indexOf('-inspect') !== -1,
    _isMobile = /(ipad|iphone|ipod|android)/gi.test(navigator.userAgent);
    
    // initialise the Keyboard
    Keyboard.init = function() {
        var container = document.getElementById('canvas-container');

        // some example engine options
        var options = {
            //width: 1920,
            //height: 1080,
            background: '#111111',
            positionIterations: 6,
            velocityIterations: 4
        };

        // create a Matter engine
        // NOTE: this is actually Matter.Engine.create(), see the aliases at top of this file
        _engine = Engine.create(container, options);

        // add a mouse controlled constraint
        _mouseConstraint = MouseConstraint.create(_engine);
        World.add(_engine.world, _mouseConstraint);

        // run the engine
        Engine.run(_engine);
        
        // set up a scene with bodies
        Keyboard.keyboard();
    };

    // each Keyboard scene is set up in its own function, see below
    Keyboard.keyboard = function() {
        var _world = _engine.world;

        //Keyboard.reset();
        _world.bodies = [];
        
        var renderOptions = _engine.render.options;
        renderOptions.background = './img/black.jpg';
        renderOptions.showAngleIndicator = false;
        renderOptions.wireframes = false;
    };

    Keyboard.addObstacle = function() {
        var options = { 
            background: '#FF0000',
            isStatic: true,
            label: "keyboard",
            render: {
                visible: false
            }
        };

        var _world = _engine.world;
        World.add(_world, [Bodies.rectangle(keyboardX, keyboardY, keyboardSX, keyboardSY, options)]);
    };

    Keyboard.deleteObstacle = function() {
        var _world = _engine.world;
        var bodies = Composite.allBodies(_world);

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            if(body.label == "keyboard"){
                World.remove(_world, body);
            }
        }
    };

    var sound;

    Keyboard.shootLetter = function(charCode) {
        var _world = _engine.world;

        //Calculate appropriate x emission for the position of the letter on the keyboard
        //Standard QWERTY keyboard
        var x_fraction = .5;
        var letter = String.fromCharCode(charCode);

        var line1 = "1234567890";
        var line2 = "QWERTYUIOP";
        var line3 = "ASDFGHJKL";
        var line4 = "ZXCVBNM";
        if(line1.indexOf(letter) != -1){
            x_fraction = line1.indexOf(letter)/10;                        
        }
        else if(line2.indexOf(letter) != -1){
            x_fraction = line2.indexOf(letter)/10;                        
        }
        else if(line3.indexOf(letter) != -1){
            x_fraction = line3.indexOf(letter)/10;                        
        }
        else if(line4.indexOf(letter) != -1){
            x_fraction = line4.indexOf(letter)/10+1/10;                        
        }

        //scaling down and offseting to the left
        x_fraction = x_fraction*0.8-0.2; 

        //window.alert(x_fraction);

        //Add letter to the world
        World.add(_world, [
            Bodies.rectangle(keyboardX + (-0.5+x_fraction)*keyboardSX/2, keyboardY - keyboardSY/2-5, 14, 14, {
                render: {
                    strokeStyle: '#ffffff',
                    sprite: {
                        texture: './img/courierNew/'+charCode+'.png',
                        xScale: .52,
                        yScale: .58
                    }
                }
            })
            ]); 
        
        //Add a shooting force
        var bodies = Composite.allBodies(_world);
        var body = bodies[bodies.length-1];
        Body.applyForce(body, { x: keyboardX + (-0.5+x_fraction)*keyboardSX/1.7, y: keyboardY - keyboardSY/2-1 }, { 
            x: Math.random()*0.001, 
            y: -.008
        });

        //Sound
        sound = document.getElementById('sound'+(Math.round(Math.random()*2)+1));
        sound.currentTime = 0;
        sound.play();

    };

    Keyboard.explode = function() {
        var _world = _engine.world;

        var bodies = Composite.allBodies(_world);

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            Body.applyForce(body, { x: 0, y: 0 }, { 
                x: 0.04*(Math.random()-.5), 
                y: 0.04*(Math.random()-.5)
            });
        }

        var sound = document.getElementById('sound'+(Math.round(Math.random()*1)+4));
        sound.currentTime = 0;
        sound.play();
    };

    Keyboard.destroyFallenLetters = function() {
        var _world = _engine.world;
        var bodies = Composite.allBodies(_world);

        console.log("nb Bodies = "+bodies.length);
        console.log("1ere lettre y = "+bodies[1].position.y+" 1ere lettre x = "+bodies[1].position.x);

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            var y = body.position.y;
            //console.log("y = "+y);

            if(body.position.y > 600 || body.position.x > 800 || body.position.x < 0 || body.position.y < 0){
                World.remove(_world, body);            
            }

        }
        
    };

    Keyboard.deleteLast = function() {        
            //TODO: animate before death - shrink or pop out
            var _world = _engine.world;

            var bodies = Composite.allBodies(_world);
            var body = bodies[bodies.length-1];
            Body.applyForce(body, { x: 0, y: 0 }, { 
                x: 0, 
                y: -.5
            });
            //window.setTimeout('', 2000);
            World.remove(_world, body)
        };

    window.onkeydown = function(e) {
        var _world = _engine.world;

        if(_world.bodies.length > 0){

                //var i = Math.round(Math.random()*2);
                //document.getElementById('sound'+i).play();

                var key = e.keyCode ? e.keyCode : e.which;

                if(key < 91 && key > 47){
                    Keyboard.shootLetter(key);
                }
                
                if(key == 32){
                    Keyboard.explode();
                }
                
                if(key == 46){
                    Keyboard.deleteLast();
                }

                Keyboard.destroyFallenLetters();
            }

            //Light Keyboard
            $("#keyboardLight").fadeIn(100);
        }

        window.onkeyup = function(e) {
            //Light Keyboard
            $("#keyboardLight").fadeOut(100);
        }

    // call init when the page has loaded fully    
    if (window.addEventListener) {
        window.addEventListener('load', Keyboard.init);
    } 
    else if (window.attachEvent) {
        window.attachEvent('load', Keyboard.init);
    }

    window.onload = function() {
        document.getElementById("startPlay").addEventListener("click", function(){
            Keyboard.addObstacle();
        });

        document.getElementById("backToCalibration").addEventListener("click", function(){
            Keyboard.deleteObstacle();
        });
    };
    
})();