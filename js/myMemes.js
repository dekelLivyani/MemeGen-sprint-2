'use strict'

function init() {
    renderMyMemes();
}

function renderMyMemes() {
    var strHtml = '';
    for (var i = 0; i < localStorage.length; i++) {
        var meme = loadFromStorage(`meme${i}`);
        strHtml += `<img class="galery-img" data-id="${i+1}" src="${meme[1]}" alt="">`

    }
    var elConteiner = document.querySelector('.conteinter-my-memes');
    elConteiner.innerHTML = strHtml;
}


function OpenMenu() {
    document.body.classList.toggle('menu-open');
}