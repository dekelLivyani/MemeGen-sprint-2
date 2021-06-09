'use strict'

var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas)
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var meme = getgMeme();
    drawImg(meme.elImg);
}

function drawImg(elImg) {
    UpdateMeme(elImg);
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function writeText(text) {
    var meme = getgMeme();
    var memeLine = meme.lines[0];
    memeLine.text = text;
    renderCanvas();
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 2;
    gCtx.textAlign = memeLine.align;
    gCtx.fillStyle = memeLine.color;
    gCtx.font = `${memeLine.size}px Impact`;
    var xPos = getPosXToWrite(meme);
    gCtx.fillText(text, xPos, memeLine.y);
    gCtx.strokeText(text, xPos, memeLine.y);
}

function getPosXToWrite(meme) {
    var xPos;
    switch (meme.lines[0].align) {
        case 'start':
            {
                xPos = 50;
                break;
            }
        case 'center':
            {
                xPos = gElCanvas.width / 2;
                break;
            }
        case 'end':
            {
                xPos = gElCanvas.width - 50;
                break;
            }
    }
    meme.x = xPos;
    return xPos;
}