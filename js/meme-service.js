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

function renderGlobleInService(){
    gKeysNumOfImg = localStorage.length;
    gIdImg = 0;
    gIdLine = 0;
    gKeys = ['funny', 'celeb', 'politic', 'animal', 'baby', 'good vibes', 'crazy', 'shocked', 'lovely', 'sarcastic', 'trans', 'toy-story', 'trump'];
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
            isSticker:false,
            x: elCanvas.width / 2,
            y: 50,
            rectSize: {
                pos: { x: 0, y: 50-gSizeFont},
                height: 65,
                width: elCanvas.width - 40
            },
            isDrag: false
        }],
    }
}

function createCircle(pos) {
    gCircle = {
        pos,
        size: 15,
        color: 'blue',
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
    if(gMeme.lines[gMeme.selectedLineIdx].isSticker) addLine();
    gMeme.lines[gMeme.selectedLineIdx].text = text;
    writeText(gMeme.selectedLineIdx);
}

function changeSize(deff) {
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    if(gMeme.lines[gMeme.selectedLineIdx].isSticker){
        gMeme.lines[gMeme.selectedLineIdx].size += deff;
        gMeme.lines[gMeme.selectedLineIdx].rectSize.width += deff;
    }else{
    gMeme.lines[gMeme.selectedLineIdx].size += deff;
    gMeme.lines[gMeme.selectedLineIdx].rectSize.pos.y -= deff;
    gMeme.lines[gMeme.selectedLineIdx].rectSize.height += deff;
   }
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}

function changeAlign(align) {
    if(gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    gMeme.lines[gMeme.selectedLineIdx].align = align;
    if (align === 'end') {}
    var posX = getPosXToWrite(gMeme.selectedLineIdx);
    gMeme.lines[gMeme.selectedLineIdx].x = posX;
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}

function clickChangeColor() {
    if(gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    var elColor = document.querySelector('.color-input');
    elColor.click();
}

function clickChangeColorStroke() {
    if(gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
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
        size: gSizeFont,
        align: 'center',
        color: 'white',
        colorStroke: 'black',
        x: elCanvas.width / 2,
        y: yPos,
        rectSize: {
            pos: { x: 0, y: yPos - gSizeFont},
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
        sizeW: 100,
        sizeH: 100,
        size:100,
        rectSize: {
            pos: { x: elCanvas.width / 3, y: elCanvas.height / 3 },
            height: 107,
            width: elSticker.width +40
        },
    })
    gMeme.selectedLineIdx++;
}

function saveMeme() {
    var numOfSaveImg = loadFromStorage('numOfSaveImg');
    if(!numOfSaveImg){
         saveToStorage('numOfSaveImg',1);
         numOfSaveImg = 1;
    }else{
        numOfSaveImg++;
    }
    renderCanvas();
    var elCanvas = getgElCanvas();
    var imgContent = elCanvas.toDataURL();
    saveToStorage(`meme${numOfSaveImg}`, [gMeme, imgContent]);
    saveToStorage('numOfSaveImg',numOfSaveImg);
  document.location.href = 'myMemes2.html';
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

function setSizeOfFont(canvasWidth){
    if(canvasWidth > 400) gSizeFont = 50; 
    if(canvasWidth > 350) gSizeFont = 45; 
    else if(canvasWidth > 300) gSizeFont = 40; 
    else gSizeFont = 35; 
}

function isHaveStickerInCanvas(){
    return gMeme.lines.some(line => line.isSticker);
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

function getgSizeFont(){
    return gSizeFont;
}

function getgCircle() {
    return gCircle;
}

function getgIsCircleDrag(){
    return gIsCircleDrag;
}