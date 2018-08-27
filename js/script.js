const FPS = 30; // Frames per second
const MATCH_HEAD = 6; // size of match heads
const STICK_WIDTH = 5; // width of stick
const STICK_LENGTH = 60; // stick length
const MATCH_STICK_COLOR = "#ffe6cc";
const COIN_BINDING = false; // toggles the binding circle for coins
        
let canv = document.getElementById("canv");


let ctx = canv.getContext("2d");
canv.width
let matches = [];
let coins = [];

function newMatch(x, y) {

    let match = {

        x: x,
        y: y, 
        a: Math.random() * Math.PI * 2, // in radians
        drag: false,
        rotate: false,

        burnt: false // matches natural boolean property

    }

    return match;

}

function addCoin(val) {
    switch (val) {
        case "penny":
            coins.push(newCoin(50, 50, 1));
            break;

        case "nickel":
            coins.push(newCoin(130, 50, 5));
            break;

        case "dime":
            coins.push(newCoin(210, 50, 10));
            break;

        case "quarter":
            coins.push(newCoin(290, 50, 25));
            break;
    }
}

function newCoin(x,y, num) {

    let coin = {

        x: x,
        y: y,
        r: 0, // radius placeholder
        a: Math.random()* Math.PI * 2,
        drag: false,
        rotate: false,

        heads: (Math.floor(Math.random() * 2) < 1? true: false), //heads (true) of tails (false)
        value: '' // placeholder for value
        
    }

    switch(num) {
        case 1:
            coin.value = "penny";
            coin.r = 34;
            
            break;
        case 5:
            coin.value = "nickel";
            coin.r = 38;
            break;
        case 10:
            coin.value = 'dime';
            coin.r = 32;
            break;
        case 25:
            coin.value = 'quarter';
            coin.r = 43;

    }

    return coin;
}

function distBetweenPoints(x1, y1, x2, y2) {

    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

}

function slopeOfLine(x1, y1, x2, y2) {

    return ((y2, - y1) / (x2 - x1));

}

function angleBetweenPoints(x1, y1, x2, y2) {

    return -Math.atan2(y2 - y1, x2 - x1);

}

function playerControlMouse(event) {

    let msEvt = event;
    let context_action = false;
    let context_index = -1;
    let coin_action = false;

    for (let c = 0; c < coins.length; c++){
        if (distBetweenPoints(coins[c].x, coins[c].y, msEvt.offsetX, msEvt.offsetY) < coins[c].r) {
            if (msEvt.shiftKey) {
                coins.splice(c, 1);
            }
            else {
                coins[c].heads = !(coins[c].heads);
            }
            coin_action = true;
            break;
        }
    }

    if (!coin_action) {
        for (let m = 0; m < matches.length; m++) {
        
            if (distBetweenPoints(matches[m].x, matches[m].y, msEvt.offsetX, msEvt.offsetY) < MATCH_HEAD) {
                context_action = true;
                context_index = m;
            }
        }

        if (context_action) {
            if (msEvt.shiftKey) {
                matches.splice(context_index, 1);
            }
            else {
                matches[context_index].burnt = true;
            }
        }
        else {
            matches.push(newMatch(msEvt.offsetX, msEvt.offsetY));
        }
    }

}

function myDrag(event) {

    let msEvt = event;

    for (let m = 0; m < matches.length; m++) {
        //if clicked on match head, drag entire match
        if (distBetweenPoints(matches[m].x, matches[m].y, msEvt.offsetX, msEvt.offsetY) < MATCH_HEAD) {
            matches[m].drag = true;
        }
        
        //if clicked on match stick, change angel (a) of match to same angle as match head - mouse pointer
        if (distBetweenPoints(matches[m].x + STICK_LENGTH * (2 * Math.cos(matches[m].a)),
            matches[m].y - STICK_LENGTH * (2 * Math.sin(matches[m].a)), msEvt.offsetX, msEvt.offsetY) < 3) {
            matches[m].rotate = true;
        } 
    }

    for (let c = 0; c < coins.length; c++) {
        if (distBetweenPoints(coins[c].x, coins[c].y, msEvt.offsetX, msEvt.offsetY) < (Math.floor(coins[c].r * 2/3))) {
            coins[c].drag = true;
        }
    }
	
	canv.onmousemove = myMove;

}

function myDrop () {
    
    for (let m = 0; m < matches.length; m++) {
        matches[m].drag = false;
        matches[m].rotate = false;
        
    }

    for (let c = 0; c < coins.length; c++) {
        coins[c].drag = false;
        coins[c].rotate = false;
    }
    canv.onmousemove = null;

}

function myMove(event) {

    let msEvt = event;

    for (let m = 0; m < matches.length; m++) {
        //drag match
        if (matches[m].drag == true) {
            matches[m].x = msEvt.offsetX;
            matches[m].y = msEvt.offsetY;
            
        }
        //angle match
        if (matches[m].rotate == true) {
            matches[m].a = angleBetweenPoints(matches[m].x, matches[m].y, msEvt.offsetX, msEvt.offsetY);
            
        }

    }

    for (let c = 0; c < coins.length; c++) {
        if (coins[c].drag == true) {
            coins[c].x = msEvt.offsetX;
            coins[c].y = msEvt.offsetY;
        }
        // push other coins with this coin
        for (let i = 0; i < coins.length; i++) {
            //as long as it's not the coin we are holding
            if (coins[i] !== coins[c]) {
                //check if the binding circles overlap
                while (distBetweenPoints(coins[i].x, coins[i].y, coins[c].x, coins[c].y) < coins[i].r + coins[c].r) {
                    //move coins[i] away from coins[c] until 
                    if (coins[i].x < coins[c].x){
                        coins[i].x -= 3;
                    }
                    if (coins[i].x > coins[c].x){
                        coins[i].x += 3;
                    }
                    if (coins[i].y < coins[c].y){
                        coins[i].y -= 3;
                    }
                    if (coins[i].y > coins[c].y){
                        coins[i].y += 3;
                    }

                }
            }

        }
    }
    
}

function update() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    // matches
    for (let m = 0; m < matches.length; m ++) {
        // stick
        ctx.strokeStyle=MATCH_STICK_COLOR;
        ctx.lineWidth = STICK_WIDTH;
        ctx.beginPath();
        ctx.moveTo(
            matches[m].x + (MATCH_HEAD /2) * Math.cos(matches[m].a),
            matches[m].y - (MATCH_HEAD /2) * Math.sin(matches[m].a)
        );
        ctx.lineTo(
            matches[m].x + STICK_LENGTH * (2 * Math.cos(matches[m].a)),
            matches[m].y - STICK_LENGTH * (2 * Math.sin(matches[m].a))
        );
        ctx.closePath();
        ctx.stroke();

        // match head
        if (!matches[m].burnt) {
            ctx.fillStyle = "red";
        }
        else {
            ctx.fillStyle = "gray";
        }
        ctx.beginPath();
        ctx.arc(matches[m].x, matches[m].y, MATCH_HEAD, 0, Math.PI * 2, false);
        ctx.fill();

    }
    
    //coins
    for (let c = 0; c < coins.length; c++) {
        //rotate canvas to coin angle
        ctx.translate(coins[c].x, coins[c].y);
        ctx.rotate(coins[c].a);
        //draw coin
        coins[c].img = document.getElementById(coins[c].value + "-" + (coins[c].heads? "heads" : "tails"));
        ctx.drawImage(coins[c].img, -coins[c].r, -coins[c].r);
        
        //draw binding circle for coin
        if (COIN_BINDING) {
            ctx.strokeStyle = "green";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, coins[c].r, 0, 2*Math.PI, false);
            ctx.stroke();
        }

        //return canvas to original position
        ctx.rotate((2 * Math.PI)-coins[c].a);
        ctx.translate(0-(coins[c].x), 0-(coins[c].y));
    }

}

canv.addEventListener("dblclick", playerControlMouse);
canv.onmousedown = myDrag;
canv.onmouseup = myDrop;

setInterval(update, 1000 / FPS);