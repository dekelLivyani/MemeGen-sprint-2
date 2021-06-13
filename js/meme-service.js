'use strict'

var gImgs;
var gMeme;
var gIdImg;
var gIdLine;
var gKeys;
var gKeysNumOfImg;
var gSizeFont;
var gCircle;
var gIsCircleDrag;

function renderGlobleInService() {
    gKeysNumOfImg = localStorage.length;
    gIdImg = 0;
    gIdLine = 0;
    gKeys = ['Funny', 'Trump', 'Celeb', 'Politic', 'Crazy', 'Animal', 'Baby', 'Trans', 'Lovely', 'Sarcastic', 'Shocked', 'Good vibes', 'Toy story'];
}

function UpdateMeme(elImg) {
    var elCanvas = getgElCanvas();
    setSizeOfFont(elCanvas.width);
    gMeme = {
        selectedImgId: elImg.dataset.id,
        selectedLineIdx: 0,
        elImg,
        lines: [{
            id: gIdLine++,
            text: 'Never be afriad',
            size: gSizeFont,
            align: 'center',
            color: 'white',
            colorStroke: 'black',
            isSticker: false,
            x: elCanvas.width / 2,
            y: 50,
            rectSize: {
                pos: { x: 0, y: 50 - gSizeFont },
                height: 65,
                width: elCanvas.width - 40
            },
            isDrag: false
        }],
    }
}


function addLineTogMeme(isEmptyLines) {
    if(isEmptyLines) gIdLine = 0;
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    var elCanvas = getgElCanvas();
    var yPos = (gMeme.lines.length === 1) ? elCanvas.height - 20 : elCanvas.height / 2;
    if (gMeme.lines.length === 0) yPos = 50;
    gMeme.lines.push({
        id: gIdLine++,
        text: '',
        size: gSizeFont,
        align: 'center',
        color: 'white',
        colorStroke: 'black',
        x: elCanvas.width / 2,
        y: yPos,
        rectSize: {
            pos: { x: 0, y: yPos - gSizeFont },
            height: 65,
            width: elCanvas.width - 40
        },
        isDrag: false,
        isSticker: false
    })
    if (!isEmptyLines) gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function addSticker(elSticker) {
    var elCanvas = getgElCanvas();
    gMeme.lines.push({
        id: gIdLine++,
        text: '',
        isSticker: true,
        img: elSticker,
        x: elCanvas.width / 3,
        y: elCanvas.height / 3,
        sizeW: 100,
        sizeH: 100,
        size: 100,
        rectSize: {
            pos: { x: elCanvas.width / 3, y: elCanvas.height / 3 },
            height: 107,
            width: elSticker.width + 40
        },
    })
    gMeme.selectedLineIdx = gMeme.lines[gMeme.lines.length-1].id;
}

function getPosXToWrite(lineIdx) {
    var elCanvas = getgElCanvas();
    var xPos;
    switch (gMeme.lines[lineIdx].align) {
        case 'start':
            {
                xPos = 50;
                break;
            }
        case 'center':
            {
                xPos = elCanvas.width / 2;
                break;
            }
        case 'end':
            {
                xPos = elCanvas.width - 50;
                break;
            }
    }
    gMeme.x = xPos;
    return xPos;
}

function createImges() {
    gImgs = [];
    gImgs.push(_createImg(['Celeb', 'Politic', 'Trump']));
    gImgs.push(_createImg(['Animal']));
    gImgs.push(_createImg(['Animal', 'Baby', 'Funny', 'Good vibes']));
    gImgs.push(_createImg(['Animal']));
    gImgs.push(_createImg(['Baby', 'Funny']));
    gImgs.push(_createImg(['Crazy']));
    gImgs.push(_createImg(['Baby', 'Shocked']));
    gImgs.push(_createImg(['Lovely']));
    gImgs.push(_createImg(['Sarcastic', 'Baby', 'Funny']));
    gImgs.push(_createImg(['Funny', 'Celeb', 'Politic', 'Good vibes']));
    gImgs.push(_createImg(['Trans', 'Lovely']));
    gImgs.push(_createImg(['Celeb', 'Shocked']));
    gImgs.push(_createImg(['Good vibes']));
    gImgs.push(_createImg(['Shocked']));
    gImgs.push(_createImg(['Good vibes', 'Celeb']));
    gImgs.push(_createImg(['Funny']));
    gImgs.push(_createImg(['Politic', 'Celeb']));
    gImgs.push(_createImg(['Toy-story']));
}

function changeIdLines(gMeme) {
    gMeme.lines.forEach(function(line,idx){
        line.id =idx;
    })
    gIdLine = gMeme.lines.length;
}

function setTextIngMeme(text) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) addLine();
    gMeme.lines[gMeme.selectedLineIdx].text = text;
    writeText(gMeme.selectedLineIdx);
}

function changeSizeToLine(deff) {
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) {
        gMeme.lines[gMeme.selectedLineIdx].sizeH += deff;
        gMeme.lines[gMeme.selectedLineIdx].sizeW += deff;
        gMeme.lines[gMeme.selectedLineIdx].rectSize.width += deff;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].size += deff;
        gMeme.lines[gMeme.selectedLineIdx].rectSize.pos.y -= deff;
        gMeme.lines[gMeme.selectedLineIdx].rectSize.height += deff;
    }
}

function changeAlign(align) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    gMeme.lines[gMeme.selectedLineIdx].align = align;
    if (align === 'end') { }
    var posX = getPosXToWrite(gMeme.selectedLineIdx);
    gMeme.lines[gMeme.selectedLineIdx].x = posX;
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}

function clickChangeColor() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    var elColor = document.querySelector('.color-input');
    elColor.click();
}

function clickChangeColorStroke() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    var elColor = document.querySelector('.color-input-stroke');
    elColor.click();
}

function saveMeme() {
    var numOfSaveImg = loadFromStorage('numOfSaveImg');
    if (!numOfSaveImg) {
        saveToStorage('numOfSaveImg', 1);
        numOfSaveImg = 1;
    } else {
        numOfSaveImg++;
    }
    renderCanvas();
    var elCanvas = getgElCanvas();
    var imgContent = elCanvas.toDataURL();
    saveToStorage(`meme${numOfSaveImg}`, [gMeme, imgContent]);
    saveToStorage('numOfSaveImg', numOfSaveImg);
    document.location.href = 'myMemes2.html';
}

function downloadMeme(elLink) {
    renderCanvas(); //Chack if Need
    var elCanvas = getgElCanvas();
    const data = elCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'your Meme';
    saveMeme();
}

function addImg(img) {
    gImgs.unshift({ id: gIdImg++, url: img.src, keywords: [] });
}

function _createImg(keywords) {
    return { id: gIdImg++, url: `img/Gallery/${gIdImg}.jpg`, keywords };
}

function setLineDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function setSizeOfFont(canvasWidth) {
    if (canvasWidth > 400) gSizeFont = 50;
    if (canvasWidth > 350) gSizeFont = 45;
    else if (canvasWidth > 300) gSizeFont = 40;
    else gSizeFont = 35;
}

function isHaveStickerInCanvas() {
    return gMeme.lines.some(line => line.isSticker);
}

//Circle function 

function createCircle(pos) {
    gCircle = {
        pos,
        size: 15,
        color: 'blue',
    }
}

function isCircleClicked(clickedPos) {
    const { pos } = gCircle;
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= gCircle.size
}

function setCircleDrag(isDrag) {
    gIsCircleDrag = isDrag
}

// Get Globals Variable

function getgMeme() {
    return gMeme;
}

function getgImgs() {
    return gImgs;
}

function getgKeys() {
    return gKeys;
}

function getgSizeFont() {
    return gSizeFont;
}

function getgCircle() {
    return gCircle;
}

function getgIsCircleDrag() {
    return gIsCircleDrag;
}