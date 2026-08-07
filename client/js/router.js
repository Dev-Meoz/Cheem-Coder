/*
=========================================================
    Cheem Coding Router
=========================================================
*/

"use strict";

const Router={

    routes:new Map(),

    current:null

};

function register(path,handler){

    Router.routes.set(

        path,

        handler

    );

}

function navigate(path){

    history.pushState(

        {},

        "",

        path

    );

    resolve();

}

function resolve(){

    const path=

    location.pathname;

    Router.current=path;

    const handler=

    Router.routes.get(path);

    if(

        typeof handler==="function"

    ){

        handler();

    }

}

window.addEventListener(

    "popstate",

    resolve

);

function initRouter(){

    resolve();

}

window.CheemRouter={

    init:initRouter,

    register,

    navigate,

    resolve,

    current:()=>Router.current

};
