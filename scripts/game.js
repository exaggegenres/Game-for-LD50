
const ALL_BLOCKS = 10;

const tilesList = {
    "air":0,
    "pillar":1,
    "door1":2,
    "door2":3,
    "wall1":4,
    "wall2":5,
    "halfwall1":6,
    "halfwall2":7,
    "finishdoor1":8,
    "finishdoor2":9,
}

const SPRITES_TEXTURES_BASE = 22;
const ALL_SPRITES = 2;
const spritesList = {
    "key":0,
    "scissors":1,
}

const ALL_ITEMS = 2;
const itemsList = {
    "key":0,
    "scissors":1,
}

var curScreen;
var level = undefined;

class Screen {
    constructor(player) {
        this.player = player;
        this.buttons = [];

    }

    addButton(x, y, text) {
        this.buttons.push({
            "x":x,
            "y":y,
            "text":text,
        });
    }
    
    renderButton(x, y, cw, ch, text, r, g, b, r2, g2, b2) {

        uniform1ish(shader2d, "useTexture", 0);
        renderGradientButtonCentered(0.0, y, text.length*cw, ch+0.05, r, g, b, r2, g2, b2);
        
        uniform1ish(shader2d, "useTexture", 1);
        renderStringCentered(text, 0.0, y, cw, ch, 0.0, 0.0, 0.0);
        
    }

}

class MenuScreen extends Screen {
    constructor(player) {
        super(player);

        this.addButton(0.0, 0.3, "play");
        this.addButton(0.0, -0.1, "about");
        this.addButton(0.0, -0.5, "how to play");
        
        this.menu = true;
    }

    renderBackground() {
        addQuad(0.0, 0.0, 1.0, 1.0, 1.0, 1.0, -canvas.width/canvas.height, -1.0, (canvas.width/canvas.height)*2, 2.0, 1.0, 1.0, 1.0)
        
        bindTexture(guiTexLists[1]);

        setVBO(gl, vb, globalVertices);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
    }

    render() {
        uniform1ish(shader2d, "useTexture", 1);

        this.renderBackground();

        renderStringCentered("stuck in hot rooms", 0.0, 0.8, 0.15, 0.15, 0.0, 0.0, 0.0);
        uniform1ish(shader2d, "useTexture", 1);

        for(let i = 0; i < this.buttons.length; i++) {
            let button = this.buttons[i];
            
            if(i != option) {
                this.renderButton(button["x"], button["y"], 0.10, 0.10, button["text"], 0.6, 0.6, 0.6, 0.2, 0.2, 0.2);
                
            } else {
                
                this.renderButton(button["x"], button["y"], 0.10, 0.10, button["text"], 0.6, 0.6, 0.6, 0.2, 0.8, 0.8);
                
            }
        }
    }

    resolveOption(id) {
        if(id == 0) {
            level = new Level(32, 32, player);
            level.buildLevelData();
            player.init(level);
            curScreen = new InGameScreen(player);
        } else if(id == 1) {
            curScreen = new AboutScreen(player);
        } else if(id == 2) {
            curScreen = new HowToPlayScreen(player);
        }
        playSound("sounds/select.wav");
    }

    update() {
        if(apply2) {
            this.resolveOption(option);
        }
    }
}

class LoseScreen extends Screen {
    constructor(player) {
        super(player);
        
    }

    render() {

        this.renderButton(0.0, -0.8, 0.10, 0.10, "enter for restart", 0.6, 0.6, 0.6, 0.2, 0.2, 0.2);

        renderStringCentered("very hot. you dead", 0.0, 0.0, 0.10, 0.10, 0.0, 0.0, 0.0);
    }

    update() {

    }

    resolveOption(id) {
        if(id == 0) {
            curScreen = new InGameScreen();
            reloadLevel();
        }
    }

    update() {
        if(apply2) {
            this.resolveOption(0);
        }
    }
}

class AboutScreen extends Screen{
    constructor(player) {
        super(player);
        this.textArea = [];
        this.addText("game was made in april 3-4, 2022", 0.0, 0.6, 0.10);
        this.addText("for ludum dare 50", 0.0, 0.3, 0.10);
        this.addText("by exaggegen", 0.0, 0.0, 0.10);
        this.addText("on clear js/webgl", 0.0, -0.3, 0.10);
        this.addText("in 48 hours for compo mode", 0.0, -0.6, 0.10);
    }

    addText(text, x, y, size) {
        this.textArea.push({
            "text":text,
            "x":x,
            "y":y,
            "size":size,
        });
    }

    renderBackground() {
        addQuad(0.0, 0.0, 1.0, 1.0, 1.0, 1.0, -canvas.width/canvas.height, -1.0, (canvas.width/canvas.height)*2, 2.0, 1.0, 1.0, 1.0)
        
        bindTexture(guiTexLists[1]);

        setVBO(gl, vb, globalVertices);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
    }

    render() {

        uniform1ish(shader2d, "useTexture", 1);

        this.renderBackground();

        uniform1ish(shader2d, "useTexture", 1);

        for(let i = 0; i < this.textArea.length; i++) {
            let text = this.textArea[i];
            renderStringCentered(text["text"], text["x"], text["y"], text["size"], text["size"], 0.0, 0.0, 0.0);
        }
        uniform1ish(shader2d, "useTexture", 1);

        this.renderButton(0.0, -0.8, 0.10, 0.10, "enter for main menu", 0.6, 0.6, 0.6, 0.2, 0.2, 0.2);
        
    }

    resolveOption(id) {
            if(id == 0) {
                curScreen = new MenuScreen(this.player);
            }
    }

    update() {
        if(apply2) {
            this.resolveOption(0);
        }
    }
}

class HowToPlayScreen extends Screen {
    constructor(player) {
        super(player);
        this.del = 0;
        this.textArea = [];
        this.addText("ammunition depot dismantled, and everything began to fill", 0.0, 0.9, 0.05);
        this.addText("with heat. you need to have time to open the front", 0.0, 0.8, 0.05);
        this.addText("door before the heat takes you by surprise", 0.0, 0.7, 0.05);
        this.addText("which key to which door - unknown", 0.0, 0.6, 0.05);
        this.addText("try to find all the keys to all the doors in order to get out", 0.0, 0.5, 0.05);
        this.addText("before there is an explosion, or, more possible, heat hell.", 0.0, 0.4, 0.05);

        this.addText("wasd - movement", 0.0, 0.3, 0.05);
        this.addText("enter - interaction with doors", 0.0, 0.2, 0.05);
        this.addText("ctrl - acceleration", 0.0, 0.1, 0.05);
        this.addText("r - crouching", 0.0, 0.0, 0.05);
        
        this.addText("good luck", 0.0, -0.4, 0.05);
        
    }

    addText(text, x, y, size) {
        this.textArea.push({
            "text":text,
            "x":x,
            "y":y,
            "size":size,
        });
    }

    renderBackground() {
        addQuad(0.0, 0.0, 1.0, 1.0, 1.0, 1.0, -canvas.width/canvas.height, -1.0, (canvas.width/canvas.height)*2, 2.0, 1.0, 1.0, 1.0)
        
        bindTexture(guiTexLists[1]);

        setVBO(gl, vb, globalVertices);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
    }

    render() {

        uniform1ish(shader2d, "useTexture", 1);
        
        this.renderBackground();

        uniform1ish(shader2d, "useTexture", 1);

        for(let i = 0; i < this.textArea.length; i++) {
            let text = this.textArea[i];
            renderStringCentered(text["text"], text["x"], text["y"], text["size"], text["size"], 0.0, 0.0, 0.0);
        }

        this.renderButton(0.0, -0.8, 0.10, 0.10, "enter for main menu", 0.6, 0.6, 0.6, 0.2, 0.2, 0.2);
        
    }

    resolveOption(id) {
        curScreen = new MenuScreen(this.player);
    }

    update() {
        if(apply2) {
            this.resolveOption(option);
        }
    }
}

class NextLevelScreen extends Screen {
    constructor(player) {
        super(player);
        playSound("sounds/newLevel.wav");
        c = true;
    }

    render() {

        this.renderButton(0.0, -0.8, 0.10, 0.10, "enter for next level", 0.6, 0.6, 0.6, 0.2, 0.2, 0.2);
        
        renderStringCentered("level completed", 0.0, 0.0, 0.10, 0.10, 0.0, 1.0, 0.0);
        
    }

    update() {

    }

    resolveOption(id) {
        if(id == 0) {
            curScreen = new InGameScreen(this.player);
            nextLevel();
        }
    }

    update() {
        if(apply2) {
            this.resolveOption(0);
        }
    }
}

class InGameScreen extends Screen {
constructor(player) {
    super(player);
    this.inGame = true;
}

    renderSprites() {
        if(typeof this.player != "undefined") {
            for(let i = 0; i < this.player.slots.length; i++) {
                if(typeof this.player.slots[i] == "undefined") continue;
                addQuad(0.0, 0.0, 1.0, 1.0, 1.0, 1.0, -1.4+(i*0.4), 0.6, 0.4, 0.4, 1.0, 1.0, 1.0)
                bindTexture(texLists[SPRITES_TEXTURES_BASE]);

                setVBO(gl, vb, globalVertices);
                
                gl.bindBuffer(gl.ARRAY_BUFFER, vb);
                gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
            }
        }
    }

    render() {
        uniform1ish(shader2d, "useTexture", 1);
        
        this.renderSprites();
    }

    update() {

    }
}

class WinScreen extends Screen {
    constructor(player) {
        super(player);
        
    }

    render() {

        this.renderButton(0.0, -0.8, 0.10, 0.10, "enter for main menu", 0.6, 0.6, 0.6, 0.2, 0.2, 0.2);
        
        renderStringCentered("the final explosion happened, but you remained intact", 0.0, 0.2, 0.06, 0.06, 0.0, 1.0, 0.0);
        renderStringCentered("you won. congratulations", 0.0, 0.0, 0.10, 0.10, 0.0, 1.0, 0.0);
        
    }

    update() {

    }

    resolveOption(id) {
        if(id == 0) {
            curScreen = new MenuScreen(this.player);
        }
    }

    update() {
        if(apply2) {
            this.resolveOption(0);
        }
    }
}

class Sprite {
    constructor(tileX, tileZ, id, player) {
        this.tileX = tileX;
        this.tileZ = tileZ;
        this.xoffs = 8;
        this.yoffs = 4;
        this.zoffs = 8;
        this.door = undefined;
        this.id = id;
        this.player = player;
    }

    attachDoor(door) {
        this.door = door;
    }

    update() {

    }

    render() {
        renderSprite(this.tileX*16+this.xoffs, this.yoffs, this.tileZ*16+this.zoffs, 1.5, 2, true, this.player.angleX);

    }
}

class Item {
    constructor(owner, id) {
        this.owner = owner;
        this.id = id;
        this.data = {};
    }

    getKeysDoor() {
        return this.data["door"];
    }
}

class Player {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.xa = 0;
        this.ya = 0;
        this.za = 0;
        this.height = 10;
        this.y = this.height;
        this.wide = 12;
        this.angleX = 0;
        this.angleY = 0;
        this.speed = 0.25;
        this.stamina = 100;
        this.isJumping = false;
        this.isSprinting = false;
        this.collided = false;
        this.camera = undefined;
        this.currentSlot = 0;
        this.slots = [];
    }

    init(level) {
        this.level = level;
    }

    attachCamera(camera) {
        this.camera = camera;
    }

    setPos(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setRot(x, y) {
        this.angleX = x;
        this.angleY = y;
        if(this.angleY >= Math.PI/2-0.001) {
            this.angleY = Math.PI/2-0.001;
        }
        if(this.angleY <= -Math.PI/2+0.001) {
            this.angleY = -Math.PI/2+0.001;
        }
    }

    rotate(x, y) {
        this.angleX += x;
        this.angleY += y;
        if(this.angleY >= Math.PI/2-0.001) {
            this.angleY = Math.PI/2-0.001;
        }
        if(this.angleY <= -Math.PI/2+0.001) {
            this.angleY = -Math.PI/2+0.001;
        }
    }

    isCollide(xa, za) {
        let tile = this.level.getTile(Math.trunc((this.x+xa)/16), Math.trunc((this.z+za)/16));
        let tileNeighb1 = this.level.getTile(Math.trunc((this.x+xa)/16)+1, Math.trunc((this.z+za)/16));
        let tileNeighb2 = this.level.getTile(Math.trunc((this.x+xa)/16)+1, Math.trunc((this.z+za)/16)+1);
        let tileNeighb3 = this.level.getTile(Math.trunc((this.x+xa)/16), Math.trunc((this.z+za)/16)+1);
        let tileNeighb4 = this.level.getTile(Math.trunc((this.x+xa)/16)-1, Math.trunc((this.z+za)/16)+1);
        let tileNeighb5 = this.level.getTile(Math.trunc((this.x+xa)/16)-1, Math.trunc((this.z+za)/16));
        let tileNeighb6 = this.level.getTile(Math.trunc((this.x+xa)/16)-1, Math.trunc((this.z+za)/16)-1);
        let tileNeighb7 = this.level.getTile(Math.trunc((this.x+xa)/16), Math.trunc((this.z+za)/16)-1);
        let tileNeighb8 = this.level.getTile(Math.trunc((this.x+xa)/16)+1, Math.trunc((this.z+za)/16)-1);
        
        
            let c1 = this.checkCollisionWithTile(tile, xa, za);
            let c2 = this.checkCollisionWithTile(tileNeighb1, xa, za);
            let c3 = this.checkCollisionWithTile(tileNeighb2, xa, za);
            let c4 = this.checkCollisionWithTile(tileNeighb3, xa, za);
            let c5 = this.checkCollisionWithTile(tileNeighb4, xa, za);
            let c6 = this.checkCollisionWithTile(tileNeighb5, xa, za);
            let c7 = this.checkCollisionWithTile(tileNeighb6, xa, za);
            let c8 = this.checkCollisionWithTile(tileNeighb7, xa, za);
            let c9 = this.checkCollisionWithTile(tileNeighb8, xa, za);
            
            if(c1 || c2 || c3 || c4 || c5 || c6 || c7 || c8 || c9) {
                return true;
            }

        return false;
    }

    Collide2(xa, za) {
        let newX = Math.trunc(this.x/16);
        let newZ = Math.trunc(this.z/16);
        
        let item = this.level.sprites[newX+newZ*this.level.width];

        if(typeof item !== "undefined") {
            this.pickupItem(item);
        }
        this.level.sprites[newX+newZ*this.level.width] = undefined;
    }

    pickupItem(sprite) {
        playSound("sounds/pickup.wav");
        this.slots[this.currentSlot] = new Item(this, sprite.id);
        this.slots[this.currentSlot].data["door"] = sprite.door;
        this.currentSlot++;
    }

    checkCollisionWithTile(tile, xa, za) {

            if(typeof tile == "undefined" || tile.solid == false) return false;
            let tilePosX = tile.tileX*16;
            let tilePosZ = tile.tileZ*16;
            let tileW = tile.width;
            let tileD = tile.depth;
            let offs = 0.2;
            
            if(this.x+xa > (tilePosX+16/2)-tileW-offs && this.x+xa < (tilePosX+16/2)+tileW+offs) {
                if(this.z+za > (tilePosZ+16/2)-tileD-offs && this.z+za < (tilePosZ+16/2)+tileD+offs) {
                      
                    if(this.y < 8+tile.yoffs-tile.height && tile.id != tilesList["door1"] && tile.id != tilesList["door2"]) return false;
                    if(tile.id == tilesList["finishdoor1"] || tile.id == tilesList["finishdoor2"]) {
                        this.x = 10000;
                        this.z = 10000;
                        if(this.level.currentLevel != 4) {
                            curScreen = new NextLevelScreen(this);
                        } else {
                            curScreen = new WinScreen(this);
                        }
                    }
                    if(apply){
                        this.handleInteract(tile);
                    }
                    return true;
                }
            }
        return false;
    }

    handleInteract(tile) {
        if(tile.id == tilesList["door1"] || tile.id == tilesList["door2"]) {
            if(typeof tile.key == "undefined") {
                if(!tile.open) {
                    playSound("sounds/open.wav");
                }
                tile.open = true;
                
            } else {
                for(let i = 0; i < this.slots.length; i++) {
                    if(typeof this.slots[i] !== "undefined" && this.slots[i].id == itemsList["key"]) {
                        if(this.slots[i].data["door"] == tile.key) {
                            tile.open = true;
                            this.slots.splice(i, 1);
                            this.currentSlot--;
                            playSound("sounds/open.wav");
                        }
                    }
                }
            }
        }
    }

    isOnGround(yg) {
        if(this.y-yg > 0+this.height) {
            return false;
        }
        return true;
    }

    decreaseStamina(value) {
        if(this.stamina > 0) {
            this.stamina -= value;
        }
        if(this.stamina < 0) {
            this.stamina = 0;
        }
    }

    update() {
        let xa = 0;
        let za = 0;
        if(keys[0]) {
            za += Math.cos(this.angleX)*this.speed;
            xa += -Math.sin(this.angleX)*this.speed;
        }
        if(keys[1]) {
            za += Math.cos(this.angleX-Math.PI/2)*this.speed;
            xa += -Math.sin(this.angleX-Math.PI/2)*this.speed;
        }
        if(keys[2]) {
            za += -Math.cos(this.angleX)*this.speed;
            xa += Math.sin(this.angleX)*this.speed;
        }
        if(keys[3]) {
            za += Math.cos(this.angleX+Math.PI/2)*this.speed;
            xa += -Math.sin(this.angleX+Math.PI/2)*this.speed;
        }

        let a = false;
        let b = false;
        if(!this.isCollide(0, za)) {
            a = false;
            if(!this.isSprinting) {
                this.z += za;
            } else {
                if(this.stamina > 10) {
                    this.z += za*2;
                } else {
                    this.z += za;
                }
            }
        } else {
            this.collided = true;
        }

        if(!this.isCollide(xa, 0)) {
            b = false;
            if(!this.isSprinting) {
                this.x += xa;
            } else {
                if(this.stamina > 10) {
                    this.x += xa*2;
                } else {
                    this.x += xa;
                }
            }
        } else {
            this.collided = true;
        }

        if(!a && !b) {
            this.collided = false;
        }

        this.Collide2(xa, za);

        if(this.isSprinting) {
            this.decreaseStamina(0.8);
        }

        if(this.stamina < 100) {
            this.stamina += 0.3;
            if(this.stamina > 100) {
                this.stamina = 100;
            }
        }

        this.setRot(angleX, angleY);
        if(up) this.isJumping = true;
        else this.isJumping = false;
        if(down) this.isSprinting = true;
        else this.isSprinting = false;
        if(this.level.HotValue < 1.0) {
            if(sneak) {this.isCrouching = true; this.height = 2; this.speed = 0.10}
            else {if(this.isCrouching) this.y = 10;
                this.isCrouching = false; 
                this.height = 10; 
                this.speed = 0.25}
        }
        
        let speedScale = 1.0;
        let yg = speedScale-0.2;
        if(!this.isOnGround(yg)) {
            this.y -= yg;
        }
        if(this.isOnGround(yg)) {
            this.ya = 0;
        }
        
        if(this.isJumping && this.isOnGround(yg) && !this.isCrouching) {
            this.ya = speedScale;
        }

        this.x += this.xa;
        this.y += this.ya;
        this.z += this.za;

        this.xa *= 0.99;
        this.ya *= 0.99;
        this.za *= 0.99;
        
        if(typeof camera !== "undefined") {
            this.camera.setPos(this.x, this.y, this.z);
        }
    }
}

class Level {
    constructor(width, height, player) {
        this.levelData = [];
        this.sprites = [];
        this.width = width;
        this.height = height;
        this.player = player;
        this.currentLevel = 0;
        this.HotValue = 0.0;

        this.setup();
        this.respawnPlayer();
    }

    setup() {
        this.levelData = [];
        this.sprites = [];

        this.width = levels_configs[this.currentLevel]["width"];
        this.height = levels_configs[this.currentLevel]["height"];

        this.HotValue = 0.0;
    }

    respawnPlayer() {
        this.player.x = levels_configs[this.currentLevel]["playerX"]*16.0;
        this.player.height = 10;
        this.player.y = this.player.height;
        this.player.z = levels_configs[this.currentLevel]["playerZ"]*16.0;

        this.player.slots = [];
    }

    update() {
        for(let i = 0; i < this.width*this.height; i++) {
            if(typeof this.levelData[i] !== "undefined") {
                this.levelData[i].update();
            }
        }

        this.HotValue += levels_configs[this.currentLevel]["deadDeltaTime"];

        if(this.HotValue > 1.0) {
            if(!curScreen["c"]) {
                curScreen = new LoseScreen();
            }
            this.HotValue = 1.0;
            this.player.height = 1;
        }
    }

    setLevel(newLevel) {
        this.currentLevel = newLevel;
    }

    buildLevelData() {
        for(let x = 0; x < this.width; x++) {
            for(let z = 0; z < this.height; z++) {
                let levelDat = levels[this.currentLevel][x+z*this.width];

                if(levelDat < 60) {
                    this.setTile(x, z, this.resolveBlock(x, z, levelDat));
                }
                if(levelDat >= 60) {
                    let sprite = this.resolveSprite(x, z, levelDat);
                }
            }
        }
    }

    resolveSprite(x, z, id) {
        let sprite = undefined;
        if(id < 80) {
            let sprite = this.addSprite(x, z, 0, this.player);
            sprite.attachDoor(id-60);
        }
        return sprite;
    }

    resolveBlock(x, z, id) {
        let tile = undefined;
        if(id < 20) {
            tile = new Block(x, z, id);
        }
        if(id >= 20) {
            tile = new Block(x, z, 2);
            tile.key = id-20;
        }
        if(id >= 40) {
            tile = new Block(x, z, 3);
            tile.key = id-40;
        }
        return tile;
    }

    addSprite(x, z, id, player) {
        this.sprites[x+z*this.width] = new Sprite(x, z, id, player);
        return this.sprites[x+z*this.width];
    }

    setTile(x, z, b) {
        if(x >= 0 && z >= 0 && x < this.width && z < this.height) {
            this.levelData[x+z*this.width] = b;
        }
    }

    getTile(x, z) {
        if(x >= 0 && z >= 0 && x <= this.width && z <= this.height) {
            return this.levelData[x+z*this.width];
        }
    }

    isTileSet(x, z) {
        if(typeof this.getTile(x, z) !== "undefined") {
            return true;
        }
        return false;
    }

    isTileExist(x, z) {
        if(this.isTileSet(x, z) && typeof this.getTile(x, z).existance) {
            return true;
        }
        return false;
    }

    renderRoots(texBlockLoc) {
        renderSide2(0, 0, 0, 512, 512);

        activateUnit(gl.TEXTURE0);
        bindTexture(texLists[0]);

        uniform1ish(shader, "doubleWise", 1);
        gl.uniform1i(texBlockLoc, 0);

        setVBO(gl, vb, globalVertices);

        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.drawArrays(gl.TRIANGLES, 0, lastVertex);

        renderSide2(0, 16, 0, 512, 512);

        bindTexture(texLists[1]);

        setVBO(gl, vb, globalVertices);

        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
    }

    equalBlocksByName(id, name) {
        if(id == tilesList[name]) {
            return true;
        }
        return false;
    }

    renderingLevel(texBlockLoc) {
        let curBlockInRenderID = 1;
        while(curBlockInRenderID < ALL_BLOCKS) {
            if(curBlockInRenderID == tilesList["wall1"] || curBlockInRenderID == tilesList["wall2"]) {
                uniform1ish(shader, "doubleWise", 1);
            }
            clearglobalVertices();

            for(let x = 0; x < level.width; x++) {
                for(let z = 0; z < level.height; z++) {
                    if(this.isTileExist(x, z) && this.getTile(x, z).existance) {
                        if(this.getTile(x, z).id == curBlockInRenderID) {
                            let clamp = false;
                            if(this.equalBlocksByName(curBlockInRenderID, "door1")) clamp = true;
                            if(this.equalBlocksByName(curBlockInRenderID, "door2")) clamp = true;
                            if(this.equalBlocksByName(curBlockInRenderID, "finishdoor1")) clamp = true;
                            if(this.equalBlocksByName(curBlockInRenderID, "finishdoor2")) clamp = true;
                            
                            renderWallCentered((x*16)+8+this.getTile(x, z).xoffs, 8+this.getTile(x, z).yoffs, (z*16)+8+this.getTile(x, z).zoffs, this.getTile(x, z).width, this.getTile(x, z).height, this.getTile(x, z).depth, clamp);
                        }
                    }
                }
            }

            activateUnit(gl.TEXTURE0);
            bindTexture(texLists[2+curBlockInRenderID-1]);

            gl.uniform1i(texBlockLoc, 0);

            setVBO(gl, vb, globalVertices);

            gl.bindBuffer(gl.ARRAY_BUFFER, vb);
            gl.drawArrays(gl.TRIANGLES, 0, lastVertex);

            uniform1ish(shader, "doubleWise", 0);

            curBlockInRenderID++;
        }
    }

    renderSprites(texBlockLoc) {
        let cur = 0;
        while(cur < ALL_SPRITES) {
            clearglobalVertices();

            for(let i = 0; i < this.sprites.length; i++) {
                if(typeof this.sprites[i] !== "undefined" && this.sprites[i].id == cur) {
                    this.sprites[i].render();
                }
            }

            activateUnit(gl.TEXTURE0);
            bindTexture(texLists[SPRITES_TEXTURES_BASE+cur]);

            gl.uniform1i(texBlockLoc, 0);

            setVBO(gl, vb, globalVertices);

            gl.bindBuffer(gl.ARRAY_BUFFER, vb);
            gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
            cur++;
        }
    }

    connectNeighboors(x, z) {
        let tile = this.getTile(x, z);
        if(tile.id != 1) return;
        if(this.isTileExist(x+1) && this.getTile(x+1, z).id == tile.id) {
            this.getTile(x, z).connectedNeighboors[0] = this.getTile(x+1, z);
        }
        if(this.isTileExist(x+1) && this.getTile(x-1, z).id == tile.id) {
            this.getTile(x, z).connectedNeighboors[1] = this.getTile(x-1, z);
        }
        if(this.isTileExist(x+1) && this.getTile(x, z+1).id == tile.id) {
            this.getTile(x, z).connectedNeighboors[2] = this.getTile(x, z+1);
        }
        if(this.isTileExist(x+1) && this.getTile(x, z-1).id == tile.id) {
            this.getTile(x, z).connectedNeighboors[3] = this.getTile(x, z-1);
        }
    }
}

class Block {
    constructor(tileX, tileZ, id) {
        this.tileX = tileX;
        this.tileZ = tileZ;
        this.connectedNeighboors = [];
        this.connectionCompletes = [];
        this.existance = true;
        this.xoffs = 0;
        this.yoffs = 0;
        this.zoffs = 0;
        this.width = undefined;
        this.height = undefined;
        this.depth = undefined;
        this.solid = false;
        this.type = 0;
        this.id = id;

        this.resolve();
    }

    update() {
        if((this.id == this.getBlockId("door1") || this.id == this.getBlockId("door2")) && this.open) {
            if(this.yoffs < 15)this.yoffs+=0.06;
            if(this.yoffs>12) {
                this.solid = false;
            }
        }
    }

    defineAsDoor() {
        this.key = undefined;
        this.open = false;
    }

    defineAsFinishDoor() {
        this.open = false;
    }

    getBlockId(n) {
        return tilesList[n];
    }

    setType(t) {
        this.type = t;
        if(t == 0) {
            this.width = this.width;
            this.depth = this.depth;
        } else if(t == 1) {
            let w = this.width;
            this.width = this.depth;
            this.depth = w;
        }
    }

    resolve() {
        if(this.id == this.getBlockId("air")) {
            this.existance = false;
        } else if(this.id == this.getBlockId("pillar")) {
            this.solid = true;
            this.width = 5;
            this.height = 8;
            this.depth = 5;
        } else if(this.id == this.getBlockId("door1")) {
            this.solid = true;
            this.width = 1;
            this.depth = 11;
            this.setType(0);
            this.defineAsDoor();
            this.height = 8;
        } else if(this.id == this.getBlockId("door2")) {
            this.solid = true;
            this.width = 1;
            this.depth = 11;
            this.setType(1);
            this.defineAsDoor();
            this.height = 8;
        } else if(this.id == this.getBlockId("wall1")) {
            this.solid = true;
            this.width = 2;
            this.depth = 11;
            this.setType(0);
            this.height = 8;
        } else if(this.id == this.getBlockId("wall2")) {
            this.solid = true;
            this.width = 2;
            this.depth = 11;
            this.setType(1);
            this.height = 8;
        } else if(this.id == this.getBlockId("halfwall1")) {
            this.solid = true;
            this.width = 2;
            this.depth = 11;
            this.setType(0);
            this.height = 7;
            this.yoffs = 2;
        } else if(this.id == this.getBlockId("halfwall2")) {
            this.solid = true;
            this.width = 2;
            this.depth = 11;
            this.setType(1);
            this.height = 7;
            this.yoffs = 2;
        } else if(this.id == this.getBlockId("finishdoor1")) {
            this.solid = true;
            this.width = 1;
            this.depth = 11;
            this.setType(0);
            this.defineAsFinishDoor();
            this.height = 8;
        } else if(this.id == this.getBlockId("finishdoor2")) {
            this.solid = true;
            this.width = 1;
            this.depth = 11;
            this.setType(1);
            this.defineAsFinishDoor();
            this.height = 8;
        }
    }


}

class Camera {
    constructor(x, y, z, fov) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.fov 
    }

    setPos(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Settings {
    constructor() {
        this.lastOption = 0;
        this.options = {

        }
    }

    addOption(option, value) {
        this.options[option] = undefined;
        this.lastOption++;
    }

    getOption(option) {
        return this.options[option];
    }

    setupOption(option, value) {
        this.options[option] = value;
    }
}

let canvas = document.getElementById("game");
let gl = canvas.getContext("webgl2");

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

canvas.onclick = function() {
    canvas.requestPointerLock();
}

function initWebgl(r, g, b, a) {
    gl.enable(gl.ALPHA_TEST);
    gl.enable(gl.BLEND);
    gl.enable(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(r, g, b, a);
}

function playSound(src) {
    var audio = new Audio();
    audio.src = src;
    audio.play();
}

initTextureLists();

let camera = new Camera();
let player = new Player(64, 10, 64);
curScreen = new MenuScreen(player);

player.init(level);
if(typeof level != "undefined")
level.buildLevelData();
player.attachCamera(camera);

let vertShader = document.getElementById("vshader").text;
let fragShader = document.getElementById("fshader").text;

let vertShader2d = document.getElementById("vshader_2d").text;
let fragShader2d = document.getElementById("fshader_2d").text;

addKeyListeners();

let shader = createProgram(gl, vertShader, fragShader);
let shader2d = createProgram(gl, vertShader2d, fragShader2d);

let vb = gl.createBuffer();

setVBO(gl, vb, globalVertices);
setVAO(shader, "position", 3, 0, 5*4);
setVAO(shader, "texCoords", 2, 3*4, 5*4);

gl.useProgram(shader);

const project = mat4.create();
const model = mat4.create();
const view = mat4.create();
mat4.identity(project);
mat4.perspective(project, Math.PI/2, canvas.width/canvas.height, 0.1, 1000);

uniform4fvsh(shader, "project", project);

initWebgl(0.0, 0.0, 0.0, 1.0);


var t = 0;
let execUpdate = false;
updateAndRenderGame();

function updateAndRenderGame() {

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    if(imageInProcess > 0) {
        execUpdate = true;
    }   

    if(execUpdate) {
        t += 2;

        if(typeof level != "undefined")
        level.update();
        if(typeof player != "undefined" && typeof level != "undefined")
        player.update();
        
        let pxa = player.angleX;
        let pya = player.angleY;

        let xv = Math.sin(pxa)*Math.cos(pya);
        let yv = (1.0*Math.sin(pya));
        let zv = Math.cos(pxa)*Math.cos(pya);
        
        let x = camera.x;
        let y = camera.y;
        let z = camera.z;

        if(typeof level != "undefined") {
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(shader);
        
        setVAO(shader, "position", 3, 0, 5*4);
        setVAO(shader, "texCoords", 2, 3*4, 5*4);


        uniform3fvsh(shader, "cameraPos", [player.x, player.y, player.z]);
        uniform1fsh(shader, "hotValue", level.HotValue);
        uniform1ish(shader, "doubleWise", 0);

        mat4.identity(view);
        mat4.lookAt(view, vec3.fromValues(x, y, z), vec3.fromValues(x-xv, y+yv, z+zv), vec3.fromValues(0, 1, 0));
        uniform4fvsh(shader, "view", view);
        mat4.identity(model);

        mat4.translate(model, model, vec3.fromValues(Math.sin(t)*0.25*level.HotValue, 0.0, 0.0));
        uniform4fvsh(shader, "model", model);

        let texLocation1 = gl.getUniformLocation(shader, "u_texture");

        clearglobalVertices();
        level.renderingLevel(texLocation1);
        
        clearglobalVertices();
        level.renderSprites(texLocation1);

        clearglobalVertices();
        level.renderRoots(texLocation1);

        clearglobalVertices();
        }
        mat4.identity(model);
        mat4.identity(view);
        
        gl.useProgram(shader2d);

        uniform4fvsh(shader2d, "project", project);
        uniform4fvsh(shader2d, "view", view);
        uniform4fvsh(shader2d, "model", model);

        gl.disable(gl.DEPTH_TEST);

        renderGUI();
    }

    apply2 = false;
    requestAnimationFrame(updateAndRenderGame);
}

function renderGUI(texBlockLoc) {

    let texLocation1 = gl.getUniformLocation(shader2d, "u_texture");
    gl.uniform1i(texBlockLoc, 0);

    setVAO(shader2d, "position", 3, 0, 8*4);
    setVAO(shader2d, "texCoords", 2, 3*4, 8*4);
    setVAO(shader2d, "colorCoords", 3, 5*4, 8*4);
    
    if(typeof curScreen != "undefined") {
        curScreen.render();
        curScreen.update();
    }
}

function nextLevel() {
    level.setLevel(level.currentLevel+1);
    level.setup();
    level.buildLevelData();
    level.respawnPlayer();

}

function reloadLevel() {
    level.setLevel(level.currentLevel);
    level.setup();
    level.buildLevelData();
    level.respawnPlayer();

}

