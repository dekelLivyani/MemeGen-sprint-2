'use strict'

function init() {
    initLang();
    onSetLang(getgCurrLang());
}

function OpenMenu() {
    document.body.classList.toggle('menu-open');
}