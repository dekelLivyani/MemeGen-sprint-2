'use strict'

var gElCanvas;
var gCtx;

function init() {
    createImges();
    renderImgs();
    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas();
    addListeners();
}

function addListeners() {
    addMouseListeners();
    // addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('click', onClickCanvas);
    // gElCanvas.addEventListener('mousemove', onMove)
    // gElCanvas.addEventListener('mousedown', onDown)
    // gElCanvas.addEventListener('mouseup', onUp)
}

// function addTouchListeners() {
//     gElCanvas.addEventListener('touchmove', onMove)
//     gElCanvas.addEventListener('touchstart', onDown)
//     gElCanvas.addEventListener('touchend', onUp)
// }

function onClickCanvas(ev) {
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;
    const lineClicked = meme.lines.find(line =>
        ev.offsetX > line.rectSize.pos.x &&
        ev.offsetX < (line.rectSize.pos.x + line.rectSize.width) &&
        ev.offsetY > line.rectSize.pos.y &&
        ev.offsetY < (line.rectSize.pos.y + line.rectSize.height)
    )
    if (lineClicked) {
        const idxLine = meme.lines.findIndex(line =>
            line === lineClicked
        )
        document.querySelector('.text-line').value = lineClicked.text;
        renderCanvas();
        drawRect(lineClicked);
        meme.selectedLineIdx = idxLine;
    }
}

function renderImgs() {
    var imgs = getgImgs();
    var strHTML = '';
    imgs.forEach((img, idx) => {
        strHTML += `<img height="200px" data-id="${idx}" src="${img.url}" alt="" onclick="drawImg(this)">`
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
    if (!meme || !meme.lines.length) {
        UpdateMeme(elImg);
        return;
    }
    for (var i = 0; i < meme.lines.length; i++) {
        writeText(i, true);
    }
}

function writeText(lineIdx, isBackUpTexted = false) {
    var meme = getgMeme();
    var memeLine = meme.lines[lineIdx];
    if (!isBackUpTexted) {
        renderCanvas();
        drawRect(memeLine);
    }
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 2;
    gCtx.textAlign = memeLine.align;
    gCtx.fillStyle = memeLine.color;
    gCtx.font = `${memeLine.size}px Impact`;
    var xPos = getPosXToWrite(lineIdx);
    gCtx.fillText(memeLine.text, xPos, memeLine.y);
    gCtx.strokeText(memeLine.text, xPos, memeLine.y);
}

function drawRect(memeLine) {
    gCtx.beginPath()
    gCtx.rect(20, memeLine.y - memeLine.size + 3, gElCanvas.width - 40, memeLine.size + 7);
    gCtx.strokeStyle = 'red'
    gCtx.stroke()
}

function MoveLine(deff) {
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;
    var lineNum = meme.selectedLineIdx;
    var currLine = meme.lines[lineNum];
    currLine.y += deff;
    currLine.rectSize.pos.y += deff;
    writeText(lineNum);
}

function addLine() {
    document.querySelector('.text-line').value = '';
    document.querySelector('.text-line').focus();
    addLineTogMeme(false); // false = if lines empty
}

function trashLine() {
    document.querySelector('.text-line').value = '';
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;

    var currlineIdx = meme.selectedLineIdx;
    meme.lines.splice(currlineIdx, 1);
    if (meme.lines.length) {
        renderCanvas()
        if (currlineIdx) {
            drawRect(meme.lines[currlineIdx - 1])
            meme.selectedLineIdx = currlineIdx - 1;
        } else {
            drawRect(meme.lines[0])
            meme.selectedLineIdx = 0;
        }

    } else {
        addLineTogMeme(true); //true = if is line empty
        renderCanvas()
    }
}

function switchLine() {
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;
    var currlineNum = meme.selectedLineIdx;
    var nextLineNum;
    var nextTextLine;
    var tempCurrTextLine = meme.lines[currlineNum].text;

    if (meme.lines[currlineNum - 1]) {
        nextLineNum = meme.selectedLineIdx - 1;
        nextTextLine = meme.lines[currlineNum - 1].text;
    } else {
        nextLineNum = meme.lines.length - 1;
        nextTextLine = meme.lines[nextLineNum].text;
    }

    meme.lines[currlineNum].text = meme.lines[nextLineNum].text;
    meme.lines[nextLineNum].text = tempCurrTextLine;
    writeText(nextLineNum);
    gMeme.selectedLineIdx = nextLineNum;
}

function changeColor() {
    var elColor = document.querySelector('.color-input');
    gMeme.lines[gMeme.selectedLineIdx].color = elColor.value;
    renderCanvas();
}

//switch between gallery and editor 

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


function getgElCanvas() {
    return gElCanvas;
}