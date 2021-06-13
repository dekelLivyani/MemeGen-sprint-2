'use strict'

var gTrans = {
    gallery:{
        en:'Gallery',
        he:'גלריה'
    },
    memes:{
        en:'Memes',
        he:'מימים'
    },
    about:{
        en:'About',
        he:'אודות'
    },
    search:{
        en:'Search',
        he:'חפש'
    },
    upload:{
        en:'Upload',
        he:'העלה'
    },
    add:{
        en:'Add',
        he:'הוסף'
    },
    more:{
        en:'More',
        he:'עוד'
    },
    lineText:{
        en:'Never be afraid',
        he:'לעולם אל תפחד'
    },
    addLine:{
        en:'Add Line',
        he:'הוסף שורה'
    },
    deleteLine:{
        en:'Delete Line',
        he:'מחק שורה'
    },
    moveUp:{
        en:'Move Up',
        he:'הזז למעלה'
    },
    moveDown:{
        en:'Move Down',
        he:'הזז למטה'
    },
    switchLine:{
        en:'Switch Line',
        he:'החלף שורה'
    },
    increaseSize:{
        en:'Increase Size',
        he:'הגדל כתב'
    },
    decreaseSize:{
        en:'Decrease Size',
        he:'הקטן כתב'
    },
    textColor:{
        en:'Text Color',
        he:'צבע הכתב'
    },
    strokeColor:{
        en:'Stroke Color',
        he:'צבע המסגרת'
    },
    alignLeft:{
        en:'Align Left',
        he:'כתב משמאל'
    },
    alignCenter:{
        en:'Align Center',
        he:'כתב באמצע'
    },
    alignRight:{
        en:'Align Right',
        he:'כתב מימין'
    },
    save:{
        en:'Save',
        he:'שמור'
    },
    download:{
        en:'Download',
        he:'הורד'
    },
    publish:{
        en:'Publish',
        he:'פרסם'
    },
    share:{
        en:'Share',
        he:'שתף'
    },   
    myName:{
        en:'My name is Dekel Livyani',
        he:'קוראים לי דקל לביאני'
    },    
    live:{
        en:'I live in Lappid',
        he:'אני גר בלפיד'
    },  
    Funny:{
        en:'Funny',
        he:'מצחיק'
    }, 
    Trump:{
        en:'Trump',
        he:'טראמפ'
    },  
    Celeb:{
        en:'Celeb',
        he:'מפורסמים'
    }, 
    Politic:{
        en:'Politic',
        he:'פוליטי'
    }, 
    Crazy:{
        en:'Crazy',
        he:'משוגע'
    }, 
    Animal:{
        en:'Animal',
        he:'חיות'
    }, 
    Baby:{
        en:'Baby',
        he:'תינוקות'
    }, 
    Trans:{
        en:'Trans',
        he:'גאווה'
    }, 
    Lovely:{
        en:'Lovely',
        he:'אהבה'
    }, 
    Sarcastic:{
        en:'Sarcastic',
        he:'עוקצני'
    }, 
    ToyStory:{
        en:'Toy story',
        he:'צעצוע של סיפור'
    }, 
    GoodVibes:{
        en:'Good vibes',
        he:'אווירה טובה'
    }, 
    Shocked:{
        en:'Shocked',
        he:'הלם'
    }, 
}
var gCurrLang;

function  initLang() {
    gCurrLang = loadFromStorage('leng');
    if(!gCurrLang){
     gCurrLang = 'en';
     saveToStorage('leng', 'en');
    }
    if(gCurrLang === 'en') document.querySelector('.en').selected = true;
    else document.querySelector('.he').selected = true;
}

function getTrans(transKey) {
    var keyTrans = gTrans[transKey];
    if (!keyTrans) return 'UNKNOWN'

    var txt = keyTrans[gCurrLang];

    if (!txt) return keyTrans.en
    return txt
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')

    els.forEach(function (el) {
        var txt = getTrans(el.dataset.trans)
        if (el.nodeName === 'INPUT') el.placeholder = txt;
        else if(el.dataset.title) el.dataset.title = txt;
        else el.innerText = txt
    })
}

function setLang(lang) {
    gCurrLang = lang;
    saveToStorage('leng', lang)
}

function  getgCurrLang() {
    return gCurrLang;
}
