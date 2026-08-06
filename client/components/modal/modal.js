/*
=========================================================
    Cheem Coding Modal Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Modal={

    opened:false,

    confirmCallback:null,

    cancelCallback:null

};



/*==============================
    Elements
==============================*/

const ModalElement={

    root:null,

    overlay:null,

    container:null,

    title:null,

    subtitle:null,

    body:null,

    footer:null,

    confirm:null,

    cancel:null,

    close:null,

    loading:null,

    notification:null,

    progress:null,

    progressBar:null

};



/*==============================
    Initialize Elements
==============================*/

function initModalElements(){

    ModalElement.root=

    document.getElementById(

        "cheemModal"

    );


    ModalElement.overlay=

    document.getElementById(

        "modalOverlay"

    );


    ModalElement.container=

    document.getElementById(

        "modalContainer"

    );


    ModalElement.title=

    document.getElementById(

        "modalTitle"

    );


    ModalElement.subtitle=

    document.getElementById(

        "modalSubtitle"

    );


    ModalElement.body=

    document.getElementById(

        "modalBody"

    );


    ModalElement.footer=

    document.getElementById(

        "modalFooter"

    );


    ModalElement.confirm=

    document.getElementById(

        "modalConfirm"

    );


    ModalElement.cancel=

    document.getElementById(

        "modalCancel"

    );


    ModalElement.close=

    document.getElementById(

        "modalClose"

    );


    ModalElement.loading=

    document.getElementById(

        "modalLoading"

    );


    ModalElement.notification=

    document.getElementById(

        "modalNotification"

    );


    ModalElement.progress=

    document.getElementById(

        "modalProgress"

    );


    ModalElement.progressBar=

    document.getElementById(

        "modalProgressBar"

    );

}



/*==============================
    Open
==============================*/

function openModal(){

    Modal.opened=true;


    ModalElement.root

    ?.classList.add(

        "active"

    );

}



/*==============================
    Close
==============================*/

function closeModal(){

    Modal.opened=false;


    ModalElement.root

    ?.classList.remove(

        "active"

    );

}
/*==============================
    Content
==============================*/

function setModalTitle(title){

    if(

        ModalElement.title

    ){

        ModalElement.title.textContent=

        title;

    }

}


function setModalSubtitle(subtitle){

    if(

        ModalElement.subtitle

    ){

        ModalElement.subtitle.textContent=

        subtitle;

    }

}


function setModalBody(content){

    if(

        !ModalElement.body

    ){

        return;

    }


    if(

        typeof content==="string"

    ){

        ModalElement.body.innerHTML=

        content;

    }

    else if(

        content instanceof HTMLElement

    ){

        ModalElement.body.innerHTML="";

        ModalElement.body.appendChild(

            content

        );

    }

}



/*==============================
    Loading
==============================*/

function showModalLoading(){

    ModalElement.loading

    ?.classList.add(

        "active"

    );

}


function hideModalLoading(){

    ModalElement.loading

    ?.classList.remove(

        "active"

    );

}



/*==============================
    Progress
==============================*/

function showModalProgress(){

    ModalElement.progress

    ?.classList.add(

        "active"

    );

}


function hideModalProgress(){

    ModalElement.progress

    ?.classList.remove(

        "active"

    );

}


function setModalProgress(value){

    if(

        ModalElement.progressBar

    ){

        ModalElement.progressBar.style.width=

        Math.max(

            0,

            Math.min(

                value,

                100

            )

        )+"%";

    }

}



/*==============================
    Notification
==============================*/

function showModalNotification(message){

    if(

        !ModalElement.notification

    ){

        return;

    }


    ModalElement.notification.textContent=

    message;


    ModalElement.notification

    .classList.add(

        "active"

    );

}


function hideModalNotification(){

    ModalElement.notification

    ?.classList.remove(

        "active"

    );

}



/*==============================
    Callback
==============================*/

function onConfirm(callback){

    Modal.confirmCallback=

    callback;

}


function onCancel(callback){

    Modal.cancelCallback=

    callback;

}



/*==============================
    Reset
==============================*/

function resetModal(){

    setModalTitle("");

    setModalSubtitle("");

    setModalBody("");

    hideModalLoading();

    hideModalProgress();

    hideModalNotification();

    setModalProgress(0);

}
/*==============================
    Events
==============================*/

function initModalEvents(){

    ModalElement.overlay

    ?.addEventListener(

        "click",

        closeModal

    );


    ModalElement.close

    ?.addEventListener(

        "click",

        closeModal

    );


    ModalElement.cancel

    ?.addEventListener(

        "click",

        ()=>{

            if(

                typeof Modal.cancelCallback==="function"

            ){

                Modal.cancelCallback();

            }


            closeModal();

        }

    );


    ModalElement.confirm

    ?.addEventListener(

        "click",

        ()=>{

            if(

                typeof Modal.confirmCallback==="function"

            ){

                Modal.confirmCallback();

            }


            closeModal();

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

            !Modal.opened

        ){

            return;

        }


        if(

            event.key==="Escape"

        ){

            closeModal();

        }


        if(

            event.key==="Enter"

        ){

            ModalElement.confirm

            ?.click();

        }


    }

);



/*==============================
    Initialize
==============================*/

function initModal(){

    initModalElements();

    initModalEvents();


    console.log(

        "%cModal Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    initModal

);



/*==============================
    Public API
==============================*/

window.CheemModal={

    init:initModal,

    open:openModal,

    close:closeModal,

    reset:resetModal,

    setTitle:setModalTitle,

    setSubtitle:setModalSubtitle,

    setBody:setModalBody,

    showLoading:showModalLoading,

    hideLoading:hideModalLoading,

    showProgress:showModalProgress,

    hideProgress:hideModalProgress,

    setProgress:setModalProgress,

    showNotification:showModalNotification,

    hideNotification:hideModalNotification,

    onConfirm,

    onCancel

};
