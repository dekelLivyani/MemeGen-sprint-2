'use strict'
var gImgSelect;

function init() {
    renderMyMemes();
}

function renderMyMemes() {
    var strHtml = '';
    for (var i = 1; i <= loadFromStorage('numOfSaveImg'); i++) {
        var meme = loadFromStorage(`meme${i}`);
        strHtml += `<img class="galery-img" data-id="${i}" onclick="selectImg(this)" src="${meme[1]}" alt="">`
    }
    var elConteiner = document.querySelector('.conteinter-my-memes');
    elConteiner.innerHTML = strHtml;
}

function OpenMenu() {
    document.body.classList.toggle('menu-open');
}

function selectImg(selectElImg) {
    gImgSelect = selectElImg;
    var elImgs = document.querySelectorAll('.galery-img');
    elImgs.forEach(img => img.classList.remove('selected'));
    selectElImg.classList.add('selected');
}

function downloadMeme(elLink) {
    if (!gImgSelect) return;
    elLink.href = gImgSelect.src
    elLink.download = 'your Meme';
}