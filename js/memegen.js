'use strict'

var gElCanvas;
var gCtx;

function init() {
    createImges();
    renderImgs();
    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function renderImgs() {
    var imgs = getgImgs();
    var strHTML = '';
    imgs.forEach(img => {
        strHTML += `<img height="200px" src="${img.url}" alt="" onclick="drawImg(this)">`
    });
    var elImgs = document.querySelector('.imgs-container');
    elImgs.innerHTML = strHTML;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetWidth;
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var meme = getgMeme();
    drawImg(meme.elImg);
}

function drawImg(elImg) {
    openEditor();
    resizeCanvas();
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
    var meme = getgMeme();
    if (!meme) {
        UpdateMeme(elImg);
        return;
    }
    for (var i = 0; i < meme.lines.length; i++) {
        writeText(i, false);
        console.log('yes');
    }
}

function writeText(lineIdx, isFirstLine = true) {
    var meme = getgMeme();
    var memeLine = meme.lines[lineIdx];
    if (isFirstLine) renderCanvas();
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 2;
    gCtx.textAlign = memeLine.align;
    gCtx.fillStyle = memeLine.color;
    gCtx.font = `${memeLine.size}px Impact`;
    var xPos = getPosXToWrite();
    gCtx.fillText(memeLine.text, xPos, memeLine.y);
    gCtx.strokeText(memeLine.text, xPos, memeLine.y);
}

function openEditor() {
    var elEditor = document.querySelector('.editor-container');
    elEditor.classList.remove('hide');
    var elEditor = document.querySelector('.imgs-container');
    elEditor.classList.add('hide');
}

function openGallery() {
    var elEditor = document.querySelector('.editor-container');
    elEditor.classList.add('hide');
    var elEditor = document.querySelector('.imgs-container');
    elEditor.classList.remove('hide');
    gMeme = null;
}

function addLine() {
    document.querySelector('.text-line').value = '';
    addLineTogMeme();
}

function getgElCanvas() {
    return gElCanvas;
}