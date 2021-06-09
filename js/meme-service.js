'use strict'

var gImgs;
var gMeme;
var gId = 0;


function UpdateMeme(elImg) {
    gMeme = {
        selectedImgId: 5,
        selectedLineIdx: 0,
        elImg,
        lines: [{
            txt: '',
            size: 50,
            align: 'center',
            color: 'white',
            x: elImg.width / 2,
            y: 50
        }]
    }
}

function getPosXToWrite() {
    var xPos;
    switch (gMeme.lines[gMeme.selectedLineIdx].align) {
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
    gMeme.x = xPos;
    return xPos;
}

function createImges() {
    gImgs = [];
    gImgs.push(_createImg(['celeb', 'politic']));
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

function increaseFont() {
    gMeme.lines[gMeme.selectedLineIdx].size += 2;
    writeText()
}

function decreaseFont() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 2;
    writeText()
}

function addLineTogMeme() {
    var elImg = gMeme.elImg;
    var elCanvas = getgElCanvas();
    var yPos = (gMeme.lines.length === 1) ? elCanvas.height - 20 : elCanvas.height / 2;
    gMeme.lines.push({
        txt: '',
        size: 50,
        align: 'center',
        color: 'white',
        x: elImg.width / 2,
        y: yPos
    })
    gMeme.selectedLineIdx++;
}

function _createImg(keywords) {
    return { id: gId++, url: `img/Gallery/${gId}.jpg`, keywords };
}

// Get Globals Variable

function getgMeme() {
    return gMeme;
}

function getgImgs() {
    return gImgs;
}