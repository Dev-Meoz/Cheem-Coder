/*
=========================================================
    Cheem Coding Theme
=========================================================
*/

"use strict";

const Theme={

    key:"theme",

    current:"light"

};

function applyTheme(theme){

    document.documentElement.setAttribute(

        "data-theme",

        theme

    );

    Theme.current=theme;

    window.CheemStorage?.set(

        Theme.key,

        theme

    );

}

function loadTheme(){

    const saved=

    window.CheemStorage?.get(

        Theme.key,

        "light"

    );

    applyTheme(saved);

}

function toggleTheme(){

    applyTheme(

        Theme.current==="dark"

        ?"light"

        :"dark"

    );

}

function initTheme(){

    loadTheme();

}

window.CheemTheme={

    init:initTheme,

    apply:applyTheme,

    toggle:toggleTheme,

    current:()=>Theme.current

};
