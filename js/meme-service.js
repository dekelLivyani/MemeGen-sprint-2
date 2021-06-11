'use strict'

var gImgs;
var gMeme;
var gIdImg;
var gIdLine;
var gKeys;
var gKeysNumOfImg;

function renderGlobleInService(){
    gKeysNumOfImg = localStorage.length;
    gIdImg = 0;
    gIdLine = 0;
    gKeys = ['funny', 'celeb', 'politic', 'animal', 'baby', 'good vibes', 'crazy', 'shocked', 'lovely', 'sarcastic', 'trans', 'toy-story', 'trump'];
}

function UpdateMeme(elImg) {
    var elCanvas = getgElCanvas();
    gMeme = {
        selectedImgId: elImg.dataset.id,
        selectedLineIdx: 0,
        elImg,
        lines: [{
            id: gIdLine++,
            text: '',
            size: 50,
            align: 'center',
            color: 'white',
            colorStroke: 'black',
            x: elCanvas.width / 2,
            y: 50,
            rectSize: {
                pos: { x: 20, y: 3 },
                height: 65,
                width: elCanvas.width - 40
            },
            isDrag: false
        }],
    }
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
    gImgs.push(_createImg(['celeb', 'politic', 'trump']));
    gImgs.push(_createImg(['animal']));
    gImgs.push(_createImg(['animal', 'baby', 'funny', 'good vibes']));
    gImgs.push(_createImg(['animal']));
    gImgs.push(_createImg(['baby', 'funny']));
    gImgs.push(_createImg(['crazy']));
    gImgs.push(_createImg(['baby', 'shocked']));
    gImgs.push(_createImg(['lovely']));
    gImgs.push(_createImg(['sarcastic', 'baby', 'funny']));
    gImgs.push(_createImg(['funny', 'celeb', 'politic', 'good vibes']));
    gImgs.push(_createImg(['trans', 'lovely']));
    gImgs.push(_createImg(['celeb', 'shocked']));
    gImgs.push(_createImg(['good vibes']));
    gImgs.push(_createImg(['shocked']));
    gImgs.push(_createImg(['good vibes', 'celeb']));
    gImgs.push(_createImg(['funny']));
    gImgs.push(_createImg(['politic', 'celeb']));
    gImgs.push(_createImg(['toy-story']));
}

function setTextIngMeme(text) {
    gMeme.lines[gMeme.selectedLineIdx].text = text;
    writeText(gMeme.selectedLineIdx);
}

function changeSize(deff) {
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    gMeme.lines[gMeme.selectedLineIdx].size += deff;
    gMeme.lines[gMeme.selectedLineIdx].rectSize.pos.y -= deff;
    gMeme.lines[gMeme.selectedLineIdx].rectSize.height += deff;
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}

function changeAlign(align) {
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    gMeme.lines[gMeme.selectedLineIdx].align = align;
    if (align === 'end') {}
    var posX = getPosXToWrite(gMeme.selectedLineIdx);
    gMeme.lines[gMeme.selectedLineIdx].x = posX;
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}

function clickChangeColor() {
    var elColor = document.querySelector('.color-input');
    elColor.click();
}

function clickChangeColorStroke() {
    var elColor = document.querySelector('.color-input-stroke');
    elColor.click();
}

function addLineTogMeme(isEmptyLines) {
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    var elCanvas = getgElCanvas();
    var yPos = (gMeme.lines.length === 1) ? elCanvas.height - 20 : elCanvas.height / 2;
    if (gMeme.lines.length === 0) yPos = 50;
    gMeme.lines.push({
        id: gIdLine++,
        text: '',
        size: 50,
        align: 'center',
        color: 'white',
        colorStroke: 'black',
        x: elCanvas.width / 2,
        y: yPos,
        rectSize: {
            pos: { x: 20, y: yPos - 50 + 3 },
            height: 65,
            width: elCanvas.width - 40
        },
        isDrag: false,
        isSticker:false
    })
    if (!isEmptyLines) gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function addSticker(elSticker){
    var elCanvas = getgElCanvas();
    gMeme.lines.push({
        id: gIdLine++,
        text:'',
        isSticker:true,
        img:elSticker,
        x: elCanvas.width /3,
        y: elCanvas.height / 3,
        size:100,
        rectSize: {
            pos: { x: elCanvas.width / 3, y: elCanvas.height / 3 },
            height: 107,
            width: elSticker.width +40
        },
    })
    gMeme.selectedLineIdx++;
    console.log(gMeme.lines[gMeme.lines.length-1]);
}

function saveMeme() {
    renderCanvas();
    var elCanvas = getgElCanvas();
    var imgContent = elCanvas.toDataURL();
    console.log(gKeysNumOfImg);
    saveToStorage(`meme${gKeysNumOfImg}`, [gMeme, imgContent]);
    gKeysNumOfImg++;
   document.location.href = '../MyMemes2.html';
}

function downloadMeme(elLink) {
    renderCanvas();
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