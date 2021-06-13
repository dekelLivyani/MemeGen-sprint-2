'use strict'

var gElCanvas;
var gCtx;
var gCurrSerachNum = 0;
var gStartPos;


const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function init() {
    renderGlobleInService();
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

//Gallery

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
    for (var i = gCurrSerachNum; i < gCurrSerachNum + 4; i++) {
        if (!keys[i]) break;
        var size = 16 + keyMap[keys[i]] * 2 + 'px';
        strHTML += `<span class="keys" onclick="filterImg(this.innerText)" style="font-size: ${size};">${keys[i]}</span>`;
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
    imgs.forEach(function (img) {
        var keysInImg = img.keywords;
        keysInImg.forEach(function (key) {
            if (!keyMap[key]) keyMap[key] = 0;
            keyMap[key]++;
        })
    })
    return keyMap;
}

function filterImg(text) {
    if(!text) text = document.querySelector('.filter-img').value;
    console.log(text);
    text = text.toLowerCase();
    var imgs = getgImgs();
    var imgsToDisplay = imgs.filter(img =>
        img.keywords.find(key => key.toLowerCase().includes(text))
    )
    renderImgs(imgsToDisplay);
}

function onImgInput(ev) {
    loadImageFromInput(ev, addImg);
}

function addImgToGallery(btnAddImg) {
    if(btnAddImg.innerText === 'Upload'){
        document.getElementById('getFile').click();
       setTimeout(() => {
           btnAddImg.innerText = 'Add';
           btnAddImg.classList.add('add-img');
    },  1000); 
    }else {
        btnAddImg.innerText = 'Upload';
        btnAddImg.classList.remove('add-img');
    }
    renderImgs();
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])

}

//Editor

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

function drawImg(elImg) {
    if (document.querySelector('.editor-container').classList.contains('hide')) openEditor();
    var meme = getgMeme()
    if (!meme) resizeCanvas();
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
    var meme = getgMeme();
    if (!meme || !meme.lines.length) {
        UpdateMeme(elImg);
        renderCanvas();
        return;
    }
    meme.lines.forEach((line, idx) => writeText(idx, true))
}

function onClickCanvas(ev) {
    const pos = getEvPos(ev);
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;
    var lineClick = islineClick(ev);
    if (lineClick) {
        const idxLine = meme.lines.findIndex(line =>
            line === lineClick
        )
        if (lineClick.text === 'Never be afriad' && lineClick.id === 0) {
            document.querySelector('.text-line').value = '';
        } else document.querySelector('.text-line').value = lineClick.text;
        renderCanvas();
        drawRect(lineClick);
        meme.selectedLineIdx = idxLine;
    } else {
        if (!isHaveStickerInCanvas() || !isCircleClicked(pos)) renderCanvas();
    }
}

function onDown(ev) {
    var meme = getgMeme();
    const pos = getEvPos(ev)
    var lineClick = islineClick(ev);
    if (isHaveStickerInCanvas() && isCircleClicked(pos)) {
        setCircleDrag(true);
        gStartPos = pos;
        document.body.style.cursor = 'grabbing'
    } else {
        if (!lineClick || meme.selectedLineIdx !== lineClick.id) return
        setLineDrag(true);
        document.body.style.cursor = 'grabbing'
        gStartPos = pos;
    }
}

function onUp(ev) {
    onClickCanvas(ev);
    setLineDrag(false);
    const pos = getEvPos(ev);
    if (isHaveStickerInCanvas()) {
        setCircleDrag(false);
    }
    document.body.style.cursor = 'unset'
}

function onMove(ev) {
    const memeLine = getgMeme().lines[getgMeme().selectedLineIdx];
    const pos = getEvPos(ev)
    if (isHaveStickerInCanvas() && isCircleClicked(pos)) {
        const circle = getgCircle();
        var isCircleDrag = getgIsCircleDrag();
        if (isCircleDrag) {
            const dx = pos.x - gStartPos.x;
            const dy = pos.y - gStartPos.y;
            changeSizeSticker(memeLine, dx, dy);
            gStartPos = pos;
            renderCanvas()
            drawRect(memeLine);
        }else{
            document.body.style.cursor = 'grab'
        }
    } else if (memeLine.isDrag) {
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        moveLine(memeLine, dx, dy)
        gStartPos = pos;
        renderCanvas()
        drawRect(memeLine);
    }
    if(isHaveStickerInCanvas() && !isCircleClicked(pos) && !islineClick(ev)){
       document.body.style.cursor = 'unset'
    }
}

function moveLine(memeLine, dx, dy) {
    memeLine.x += dx;
    memeLine.y += dy;
    memeLine.rectSize.pos.x += dx;
    memeLine.rectSize.pos.y += dy;
}

function changeSizeSticker(memeLine, dx, dy) {
    memeLine.sizeW += dx;
    memeLine.sizeH += dy;
    memeLine.rectSize.width += dx;
    memeLine.rectSize.height += dy;
}

function selectSticker(elSticker) {
    document.querySelector('.text-line').value = '';
    addSticker(elSticker);
    renderCanvas();
    var meme = getgMeme();
    drawRect(meme.lines[meme.selectedLineIdx]);
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

function writeText(lineIdx, isBackUpTexted = false) {
    setSizeOfFont(gElCanvas.width);
    var meme = getgMeme();
    var memeLine = meme.lines[lineIdx];
    if (!isBackUpTexted) {
        renderCanvas();
        drawRect(memeLine);
    }
    if (memeLine.isSticker) {
        var img = new Image();
        img.src = memeLine.img.src;
        gCtx.drawImage(img, memeLine.x, memeLine.y, memeLine.sizeW, memeLine.sizeH);
    } else {
        gCtx.strokeStyle = memeLine.colorStroke;
        gCtx.lineWidth = 2;
        gCtx.textAlign = memeLine.align;
        gCtx.fillStyle = memeLine.color;
        gCtx.font = `${memeLine.size}px Impact`;
        gCtx.fillText(memeLine.text, memeLine.x, memeLine.y);
        gCtx.strokeText(memeLine.text, memeLine.x, memeLine.y);
    }
}

function drawRect(memeLine) {
    var x = memeLine.rectSize.pos.x;
    var y = memeLine.rectSize.pos.y;
    var width = (memeLine.isSticker) ? memeLine.rectSize.width : gElCanvas.width;
    var height = (memeLine.isSticker) ? memeLine.sizeH : memeLine.size;
    gCtx.beginPath()
    gCtx.rect(x, y, width, height + 10)
    gCtx.fillStyle = '#aab5b83d'
    gCtx.fillRect(x, y, width, height + 10)
    gCtx.strokeStyle = 'black';
    gCtx.stroke()
    if (memeLine.isSticker) {
        var posCircle = { x: x + width, y: y + memeLine.sizeH + 10 };
        createCircle(posCircle);
        drawArc(posCircle.x, posCircle.y);
    }
}

function drawArc(x, y) {
    gCtx.beginPath()
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, 7, 0, 2 * Math.PI)
    gCtx.fillStyle = 'blue'
    gCtx.fill()

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
        changeIdLines(meme);
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

function moveLineUpOrDown(deff) {
    var meme = getgMeme();
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;
    var lineNum = meme.selectedLineIdx;
    var currLine = meme.lines[lineNum];
    currLine.y += deff;
    currLine.rectSize.pos.y += deff;
    renderCanvas();
    drawRect(currLine);
}

function switchLine() {
    var meme = getgMeme();
    if ((meme.selectedLineIdx === 0)) meme.selectedLineIdx = meme.lines.length - 1;
    else meme.selectedLineIdx--;
    renderCanvas();
    drawRect(meme.lines[meme.selectedLineIdx]);
    document.querySelector('.text-line').value = meme.lines[meme.selectedLineIdx].text;
}

function changeSize(deff) {
    changeSizeToLine(deff);
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
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

function openEditor() {
    var elEditor = document.querySelector('.editor-container');
    elEditor.classList.remove('hide');
    var elEditor = document.querySelector('.gallery');
    elEditor.classList.add('hide');
}

function openGallery() {
    gIdLine = 0;
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