'use strict'

var gImgs;
var gMeme;

function getgMeme() {
    return gMeme;
}

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