/*
=========================================================
    Cheem Coding Popup Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Popup={

    opened:false,

    timer:null,

    duration:5000,

    confirmCallback:null,

    cancelCallback:null

};



/*==============================
    Elements
==============================*/

const PopupElement={

    root:null,

    container:null,

    title:null,

    subtitle:null,

    body:null,

    icon:null,

    close:null,

    confirm:null,

    cancel:null,

    loading:null,

    progress:null,

    progressBar:null,

    notification:null,

    timer:null

};



/*==============================
    Initialize Elements
==============================*/

function initPopupElements(){

    PopupElement.root=

    document.getElementById(

        "cheemPopup"

    );


    PopupElement.container=

    document.getElementById(

        "popupContainer"

    );


    PopupElement.title=

    document.getElementById(

        "popupTitle"

    );


    PopupElement.subtitle=

    document.getElementById(

        "popupSubtitle"

    );


    PopupElement.body=

    document.getElementById(

        "popupBody"

    );


    PopupElement.icon=

    document.getElementById(

        "popupIcon"

    );


    PopupElement.close=

    document.getElementById(

        "popupClose"

    );


    PopupElement.confirm=

    document.getElementById(

        "popupConfirm"

    );


    PopupElement.cancel=

    document.getElementById(

        "popupCancel"

    );


    PopupElement.loading=

    document.getElementById(

        "popupLoading"

    );


    PopupElement.progress=

    document.getElementById(

        "popupProgress"

    );


    PopupElement.progressBar=

    document.getElementById(

        "popupProgressBar"

    );


    PopupElement.notification=

    document.getElementById(

        "popupNotification"

    );


    PopupElement.timer=

    document.getElementById(

        "popupTimer"

    );

}



/*==============================
    Open / Close
==============================*/

function openPopup(){

    Popup.opened=true;


    PopupElement.root

    ?.classList.add(

        "active"

    );

}


function closePopup(){

    Popup.opened=false;


    PopupElement.root

    ?.classList.remove(

        "active"

    );


    if(

        Popup.timer

    ){

        clearInterval(

            Popup.timer

        );

    }

}
/*==============================
    Content
==============================*/

function setPopupTitle(title){

    if(PopupElement.title){

        PopupElement.title.textContent=

        title;

    }

}


function setPopupSubtitle(subtitle){

    if(PopupElement.subtitle){

        PopupElement.subtitle.textContent=

        subtitle;

    }

}


function setPopupBody(content){

    if(!PopupElement.body){

        return;

    }


    if(typeof content==="string"){

        PopupElement.body.innerHTML=

        content;

    }

    else if(content instanceof HTMLElement){

        PopupElement.body.innerHTML="";

        PopupElement.body.appendChild(content);

    }

}


function setPopupIcon(icon){

    if(PopupElement.icon){

        PopupElement.icon.innerHTML=

        icon;

    }

}



/*==============================
    Loading
==============================*/

function showPopupLoading(){

    PopupElement.loading

    ?.classList.add("active");

}


function hidePopupLoading(){

    PopupElement.loading

    ?.classList.remove("active");

}



/*==============================
    Progress
==============================*/

function showPopupProgress(){

    PopupElement.progress

    ?.classList.add("active");

}


function hidePopupProgress(){

    PopupElement.progress

    ?.classList.remove("active");

}


function setPopupProgress(value){

    if(PopupElement.progressBar){

        PopupElement.progressBar.style.width=

        Math.max(

            0,

            Math.min(value,100)

        )+"%";

    }

}



/*==============================
    Notification
==============================*/

function showPopupNotification(message){

    if(!PopupElement.notification){

        return;

    }


    PopupElement.notification.textContent=

    message;


    PopupElement.notification

    .classList.add("active");

}


function hidePopupNotification(){

    PopupElement.notification

    ?.classList.remove("active");

}



/*==============================
    Timer
==============================*/

function startPopupTimer(seconds){

    let remaining=seconds;


    PopupElement.timer.textContent=

    remaining+"s";


    clearInterval(Popup.timer);


    Popup.timer=setInterval(()=>{

        remaining--;


        PopupElement.timer.textContent=

        remaining+"s";


        if(remaining<=0){

            clearInterval(Popup.timer);

            closePopup();

        }

    },1000);

}



/*==============================
    Reset
==============================*/

function resetPopup(){

    setPopupTitle("");

    setPopupSubtitle("");

    setPopupBody("");

    setPopupIcon("ℹ️");

    hidePopupLoading();

    hidePopupProgress();

    hidePopupNotification();

    setPopupProgress(0);

}
/*==============================
    Callback
==============================*/

function onPopupConfirm(callback){

    Popup.confirmCallback=

    callback;

}


function onPopupCancel(callback){

    Popup.cancelCallback=

    callback;

}



/*==============================
    Events
==============================*/

function initPopupEvents(){

    PopupElement.close

    ?.addEventListener(

        "click",

        closePopup

    );


    PopupElement.cancel

    ?.addEventListener(

        "click",

        ()=>{

            if(

                typeof Popup.cancelCallback==="function"

            ){

                Popup.cancelCallback();

            }


            closePopup();

        }

    );


    PopupElement.confirm

    ?.addEventListener(

        "click",

        ()=>{

            if(

                typeof Popup.confirmCallback==="function"

            ){

                Popup.confirmCallback();

            }


            closePopup();

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

            !Popup.opened

        ){

            return;

        }


        if(

            event.key==="Escape"

        ){

            closePopup();

        }


        if(

            event.key==="Enter"

        ){

            PopupElement.confirm

            ?.click();

        }

    }

);



/*==============================
    Initialize
==============================*/

function initPopup(){

    initPopupElements();

    initPopupEvents();


    console.log(

        "%cPopup Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    initPopup

);



/*==============================
    Public API
==============================*/

window.CheemPopup={

    init:initPopup,

    open:openPopup,

    close:closePopup,

    reset:resetPopup,

    setTitle:setPopupTitle,

    setSubtitle:setPopupSubtitle,

    setBody:setPopupBody,

    setIcon:setPopupIcon,

    showLoading:showPopupLoading,

    hideLoading:hidePopupLoading,

    showProgress:showPopupProgress,

    hideProgress:hidePopupProgress,

    setProgress:setPopupProgress,

    showNotification:showPopupNotification,

    hideNotification:hidePopupNotification,

    startTimer:startPopupTimer,

    onConfirm:onPopupConfirm,

    onCancel:onPopupCancel

};
