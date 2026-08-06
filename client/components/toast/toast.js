/*
=========================================================
    Cheem Coding Toast Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Toast={

    queue:[],

    duration:4000,

    maxVisible:5

};



/*==============================
    Elements
==============================*/

const ToastElement={

    container:null,

    template:null

};



/*==============================
    Initialize
==============================*/

function initToastElements(){

    ToastElement.container=

    document.getElementById(

        "cheemToastContainer"

    );


    ToastElement.template=

    document.getElementById(

        "toastTemplate"

    );

}



/*==============================
    Create Toast
==============================*/

function createToast(

    title,

    message,

    type="info"

){

    const fragment=

    ToastElement.template

    .content

    .cloneNode(

        true

    );


    const toast=

    fragment.querySelector(

        ".cheem-toast"

    );


    toast.classList.add(

        type

    );


    fragment.querySelector(

        ".toast-title"

    ).textContent=

    title;


    fragment.querySelector(

        ".toast-message"

    ).textContent=

    message;


    const icon=

    fragment.querySelector(

        ".toast-icon"

    );


    switch(type){

        case"success":

            icon.textContent="✅";

            break;


        case"error":

            icon.textContent="❌";

            break;


        case"warning":

            icon.textContent="⚠️";

            break;


        default:

            icon.textContent="ℹ️";

    }


    return{

        fragment,

        toast

    };

}
/*==============================
    Show Toast
==============================*/

function showToast(

    title,

    message,

    type="info"

){

    if(

        !ToastElement.container

    ){

        return;

    }


    const{

        fragment,

        toast

    }=

    createToast(

        title,

        message,

        type

    );


    ToastElement.container

    .prepend(

        fragment

    );


    const progress=

    toast.querySelector(

        ".toast-progress-bar"

    );


    if(progress){

        progress.style.animation=

        `toastProgress ${Toast.duration}ms linear forwards`;

    }


    const closeButton=

    toast.querySelector(

        ".toast-close"

    );


    closeButton

    ?.addEventListener(

        "click",

        ()=>{

            removeToast(

                toast

            );

        }

    );


    setTimeout(

        ()=>{

            removeToast(

                toast

            );

        },

        Toast.duration

    );


    limitToastCount();

}



/*==============================
    Remove Toast
==============================*/

function removeToast(toast){

    if(

        !toast

    ){

        return;

    }


    toast.style.animation=

    "toastHide .25s ease forwards";


    setTimeout(

        ()=>{

            toast.remove();

        },

        250

    );

}



/*==============================
    Queue
==============================*/

function limitToastCount(){

    const list=

    ToastElement.container

    .querySelectorAll(

        ".cheem-toast"

    );


    if(

        list.length>

        Toast.maxVisible

    ){

        removeToast(

            list[

                list.length-1

            ]

        );

    }

}



/*==============================
    Helpers
==============================*/

function successToast(

    title,

    message

){

    showToast(

        title,

        message,

        "success"

    );

}


function errorToast(

    title,

    message

){

    showToast(

        title,

        message,

        "error"

    );

}


function warningToast(

    title,

    message

){

    showToast(

        title,

        message,

        "warning"

    );

}


function infoToast(

    title,

    message

){

    showToast(

        title,

        message,

        "info"

    );

}
/*==============================
    Clear
==============================*/

function clearToasts(){

    if(

        !ToastElement.container

    ){

        return;

    }


    ToastElement.container

    .querySelectorAll(

        ".cheem-toast"

    )

    .forEach(

        toast=>{

            removeToast(

                toast

            );

        }

    );

}



/*==============================
    Keyboard
==============================*/

document.addEventListener(

    "keydown",

    event=>{

        if(

            event.key==="Escape"

        ){

            clearToasts();

        }

    }

);



/*==============================
    Initialize
==============================*/

function initToast(){

    initToastElements();


    console.log(

        "%cToast Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    initToast

);



/*==============================
    Public API
==============================*/

window.CheemToast={

    init:initToast,

    show:showToast,

    success:successToast,

    error:errorToast,

    warning:warningToast,

    info:infoToast,

    remove:removeToast,

    clear:clearToasts

};
