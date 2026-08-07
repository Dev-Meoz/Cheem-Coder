/*
=========================================================
    Cheem Coding Application
=========================================================
*/

"use strict";

const App={

    version:"1.0.0",

    ready:false

};

document.addEventListener(

    "DOMContentLoaded",

    initApp

);

function initApp(){

    if(App.ready) return;

    App.ready=true;

    initTheme();

    initRouter();

    initComponents();

    console.log(

        "Cheem-Coder Started"

    );

}

function initComponents(){

    window.CheemNavbar?.init?.();
    window.CheemSidebar?.init?.();
    window.CheemModal?.init?.();
    window.CheemPopup?.init?.();
    window.CheemLoading?.init?.();
    window.CheemToast?.init?.();
    window.CheemDropdown?.init?.();
    window.CheemAvatar?.init?.();
    window.CheemMessage?.init?.();

}

window.CheemApp={

    init:initApp,

    version:App.version

};
