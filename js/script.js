const FPS = 30; // Frames per second
const MATCH_HEAD = 6; // size of match heads
const STICK_WIDTH = 5; // width of stick
const STICK_LENGTH = 60; // stick length
const MATCH_STICK_COLOR = "#ffe6cc";
        
let canv = document.getElementById("canv");


let ctx = canv.getContext("2d");
canv.width
let matches = [];

function newMatch(x, y) {

    let match = {

        x: x,
        y: y, 
        a: Math.random() * Math.PI * 2, // in radians
        drag: false,
        rotate: false

    }

    return match;

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

    for (let m = 0; m < matches.length; m++) {
        
        if (distBetweenPoints(matches[m].x, matches[m].y, msEvt.offsetX, msEvt.offsetY) < MATCH_HEAD) {
            context_action = true;
            context_index = m;

        }
    }
    if (context_action) {
        matches.splice(context_index, 1);
    }
    else {
        matches.push(newMatch(msEvt.offsetX, msEvt.offsetY));
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
	
	canv.onmousemove = myMove;

}

function myDrop () {
    
    for (let m = 0; m < matches.length; m++) {
        matches[m].drag = false;
        matches[m].rotate = false;
        canv.onmousemove = null;
    }

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
    
}

function update() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

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
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(matches[m].x, matches[m].y, MATCH_HEAD, 0, Math.PI * 2, false);
        ctx.fill();

    }

}

canv.addEventListener("dblclick", playerControlMouse);
canv.onmousedown = myDrag;
canv.onmouseup = myDrop;

setInterval(update, 1000 / FPS);