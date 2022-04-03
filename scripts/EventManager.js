var keysData = ['w', 'a', 's', 'd'];
var keys = [false, false, false, false]
var angleX = 0;
var angleY = 0;
var up = false;
var down = false;
var apply = false;
var apply2 = false;
var sneak = false;

let option = 0;

var mouseSpeed = {
    x: 0,
    y: 0,
}

function addKeyListeners() {
        document.addEventListener("keydown", (e) => {
            if(typeof curScreen !== "undefined" && curScreen["inGame"]) {
            if(e.key == keysData[0]) {
                keys[0] = true;
            }
            if(e.key == keysData[1]) {
                keys[1] = true;
            }
            if(e.key == keysData[2]) {
                keys[2] = true;
            }
            if(e.key == keysData[3]) {
                keys[3] = true;
            }
            if(e.key == ' ') {
                up = true;
            }
            if(e.keyCode == 17) {
                down = true;
            }
            if(e.keyCode == 13) {
                apply = true;
            }
            if(e.keyCode == 82) {
                sneak = true;
            }
        }
        })

        document.addEventListener("keyup", (e) => {
            if(typeof curScreen !== "undefined" && curScreen["inGame"]) {
            if(e.key == keysData[0]) {
                keys[0] = false;
            }
            if(e.key == keysData[1]) {
                keys[1] = false;
            }
            if(e.key == keysData[2]) {
                keys[2] = false;
            }
            if(e.key == keysData[3]) {
                keys[3] = false;
            }
            if(e.key == ' ') {
                up = false;
            }
            if(e.keyCode == 17) {
                down = false;
            }
            if(e.keyCode == 13) {
                apply = false;
            }
            if(e.keyCode == 82) {
                sneak = false;
            }
        }
        })
    }

    document.addEventListener("mousemove", (e) => {
        if(typeof curScreen !== "undefined" && curScreen["inGame"]) {
        mouseSpeed.x = e.movementX;
        mouseSpeed.y = e.movementY;

        angleX += mouseSpeed.x/200;
        angleY -= mouseSpeed.y/200;
        
        if(angleY >= Math.PI/2-0.001) {
            angleY = Math.PI/2-0.001;
        }
        if(angleY <= -Math.PI/2+0.001) {
            angleY = -Math.PI/2+0.001;
        }
    }
    })

    document.addEventListener("keypress", (e) => {
        if(e.key == 'w') {
            option--;
            if(typeof curScreen != "undefined") {
                if(curScreen["menu"])playSound("sounds/choose.wav");
            if(option < 0) {
                option = curScreen.buttons.length;
            }
        }
            
        }
        if(e.key == 's') {
            option++;
            if(typeof curScreen != "undefined") {
                if(curScreen["menu"])playSound("sounds/choose.wav");
            if(option > curScreen.buttons.length) {
                option = 0;
            }
            }
        }
        if(e.keyCode == 13) {
            apply2 = true;
        }
    })