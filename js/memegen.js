'use strict'

var gElCanvas;
var gCtx;
var gCurrSerachNum = 0;
var gStartPos;
var isReSize = false;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function init() {
    createImges();
    renderImgs();
    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    addListeners();
    renderSearches();
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        if (document.querySelector('.imgs-container').classList.contains('hide')) renderCanvas();
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('click', onClickCanvas);
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    var meme = getgMeme();
    const pos = getEvPos(ev)
    var lineClick = islineClick(ev);
    if (!lineClick || meme.selectedLineIdx !== lineClick.id) return
    setLineDrag(true);
    gStartPos = pos;
    document.body.style.cursor = 'grabbing'
}

function onUp(ev) {
    onClickCanvas(ev);
    setLineDrag(false)
    document.body.style.cursor = 'unset'
}

function onMove(ev) {
    const memeLine = getgMeme().lines[getgMeme().selectedLineIdx];
    if (memeLine.isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(memeLine, dx, dy)
        gStartPos = pos;
        renderCanvas()
        drawRect(memeLine);
    }
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function moveLine(memeLine, dx, dy) {
    memeLine.x += dx;
    memeLine.y += dy;
    memeLine.rectSize.pos.x += dx;
    memeLine.rectSize.pos.y += dy;
}

function renderImgs(imgs = getgImgs()) {
    var strHTML = '';
    imgs.forEach((img, idx) => {
        strHTML += `<img class="galery-img" data-id="${idx}" src="${img.url}" alt="" onclick="drawImg(this)">`
    });
    var elImgs = document.querySelector('.imgs-container');
    elImgs.innerHTML = strHTML;
    document.querySelector('footer').style.bottom = 0;
}

function renderSearches() {
    var strHTML = '';
    var keys = getgKeys();
    var keyMap = getObjMapSearches();
    for (var i = gCurrSerachNum; i < gCurrSerachNum + 5; i++) {
        if (!keys[i]) break;
        var size = 16 + keyMap[keys[i]] * 2 + 'px';
        strHTML += `<span class="keys" onclick="filterImg(this.innerText)" style="font-size: ${size};">${keys[i]}</span>`;
        if (keys[i + 1] && i !== gCurrSerachNum + 4) strHTML += `<span class="border">|</span> `;
    }
    document.querySelector('.searched-show').innerHTML = strHTML;
}

function moreSearch() {
    var keys = getgKeys();
    gCurrSerachNum += 5;
    if (gCurrSerachNum >= keys.length) gCurrSerachNum = 0;
    renderSearches();
}

function getObjMapSearches() {
    var keyMap = {};
    var imgs = getgImgs();
    imgs.forEach(function(img) {
        var keysInImg = img.keywords;
        keysInImg.forEach(function(key) {
            if (!keyMap[key]) keyMap[key] = 0;
            keyMap[key]++;
        })
    })
    return keyMap;
}

function filterImg(text) {
    text = text.toLowerCase();
    var imgs = getgImgs();
    var imgsToDisplay = imgs.filter(img =>
        img.keywords.find(key => key.includes(text))
    )
    renderImgs(imgsToDisplay);
}

function onImgInput(ev) {
    loadImageFromInput(ev, addImg);
    document.querySelector('.add-img').classList.remove('hide');
}

function addImgToGallery() {
    renderImgs();
    document.querySelector('.add-img').classList.add('hide');
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    reader.onload = function(event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])

}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetWidth;
    renderCanvas();
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var meme = getgMeme();
    if (meme) drawImg(meme.elImg);
}

function onClickCanvas(ev) {
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;
    var lineClick = islineClick(ev)
    if (lineClick) {
        const idxLine = meme.lines.findIndex(line =>
            line === lineClick
        )
        document.querySelector('.text-line').value = lineClick.text;
        renderCanvas();
        drawRect(lineClick);
        meme.selectedLineIdx = idxLine;
    } else {
        renderCanvas();
    }
}

function islineClick(ev) {
    var meme = getgMeme()
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }

    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return meme.lines.find(line =>
        pos.x > line.rectSize.pos.x &&
        pos.x < (line.rectSize.pos.x + line.rectSize.width) &&
        pos.y > line.rectSize.pos.y &&
        pos.y < (line.rectSize.pos.y + line.rectSize.height)
    )
}


function drawImg(elImg) {
    if (document.querySelector('.editor-container').classList.contains('hide')) openEditor();
    var meme = getgMeme()
    if (!meme) resizeCanvas();
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
    var meme = getgMeme();
    if (!meme || !meme.lines.length) {
        UpdateMeme(elImg);
        return;
    }
    meme.lines.forEach((line, idx) => writeText(idx, true))
}

function writeText(lineIdx, isBackUpTexted = false) {
    var meme = getgMeme();
    var memeLine = meme.lines[lineIdx];
    if (!isBackUpTexted) {
        renderCanvas();
        drawRect(memeLine);
    }
    gCtx.strokeStyle = memeLine.colorStroke;
    gCtx.lineWidth = 2;
    gCtx.textAlign = memeLine.align;
    gCtx.fillStyle = memeLine.color;
    gCtx.font = `${memeLine.size}px Impact`;
    gCtx.fillText(memeLine.text, memeLine.x, memeLine.y);
    gCtx.strokeText(memeLine.text, memeLine.x, memeLine.y);
}

function drawRect(memeLine) {
    var x0 = memeLine.rectSize.pos.x;
    var y0 = memeLine.rectSize.pos.y;
    var x1 = memeLine.rectSize.pos.x + gElCanvas.width - 40;
    var y1 = memeLine.rectSize.pos.y + memeLine.size + 7;
    var r = 70;
    var w = x1 - x0;
    var h = y1 - y0;
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    gCtx.beginPath();
    gCtx.moveTo(x1 - r, y0);
    gCtx.quadraticCurveTo(x1, y0, x1, y0 + r);
    gCtx.lineTo(x1, y1 - r);
    gCtx.quadraticCurveTo(x1, y1, x1 - r, y1);
    gCtx.lineTo(x0 + r, y1);
    gCtx.quadraticCurveTo(x0, y1, x0, y1 - r);
    gCtx.lineTo(x0, y0 + r);
    gCtx.quadraticCurveTo(x0, y0, x0 + r, y0);
    gCtx.closePath();
    gCtx.strokeStyle = 'red';
    gCtx.stroke();
}

function MoveLine(deff) {
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;
    var lineNum = meme.selectedLineIdx;
    var currLine = meme.lines[lineNum];
    currLine.y += deff;
    currLine.rectSize.pos.y += deff;
    renderCanvas();
    drawRect(currLine);
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
    if ((meme.selectedLineIdx === 0)) meme.selectedLineIdx = meme.lines.length - 1;
    else meme.selectedLineIdx--;
    renderCanvas();
    drawRect(meme.lines[meme.selectedLineIdx]);
    document.querySelector('.text-line').value = meme.lines[meme.selectedLineIdx].text;
}

function changeColor() {
    var elColor = document.querySelector('.color-input');
    gMeme.lines[gMeme.selectedLineIdx].color = elColor.value;
    renderCanvas();
}

function changeColorStroke() {
    var elColor = document.querySelector('.color-input-stroke');
    gMeme.lines[gMeme.selectedLineIdx].colorStroke = elColor.value;
    renderCanvas();
}
//switch between gallery and editor 

function openEditor() {
    var elEditor = document.querySelector('.editor-container');
    elEditor.classList.remove('hide');
    var elEditor = document.querySelector('.gallery');
    elEditor.classList.add('hide');
}

function openGallery() {
    var elEditor = document.querySelector('.editor-container');
    elEditor.classList.add('hide');
    var elEditor = document.querySelector('.gallery');
    elEditor.classList.remove('hide');
    gMeme = null;
    document.querySelector('.text-line').value = '';
}

function getgElCanvas() {
    return gElCanvas;
}

function OpenMenu() {
    document.body.classList.toggle('menu-open');
}