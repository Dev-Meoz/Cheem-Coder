/*
=========================================================
    Cheem Coding Loading Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Loading={

    active:false,

    progress:0,

    currentStep:1,

    totalSteps:5

};



/*==============================
    Elements
==============================*/

const LoadingElement={

    root:null,

    overlay:null,

    container:null,

    title:null,

    subtitle:null,

    spinner:null,

    progressBar:null,

    percent:null,

    status:null,

    tip:null,

    step:null,

    slot:null,

    accessibility:null

};



/*==============================
    Initialize Elements
==============================*/

function initLoadingElements(){

    LoadingElement.root=

    document.getElementById(

        "cheemLoading"

    );


    LoadingElement.overlay=

    document.getElementById(

        "loadingOverlay"

    );


    LoadingElement.container=

    document.getElementById(

        "loadingContainer"

    );


    LoadingElement.title=

    document.getElementById(

        "loadingTitle"

    );


    LoadingElement.subtitle=

    document.getElementById(

        "loadingSubtitle"

    );


    LoadingElement.spinner=

    document.getElementById(

        "loadingSpinner"

    );


    LoadingElement.progressBar=

    document.getElementById(

        "loadingProgressBar"

    );


    LoadingElement.percent=

    document.getElementById(

        "loadingPercent"

    );


    LoadingElement.status=

    document.getElementById(

        "loadingStatus"

    );


    LoadingElement.tip=

    document.getElementById(

        "loadingTip"

    );


    LoadingElement.step=

    document.getElementById(

        "loadingStep"

    );


    LoadingElement.slot=

    document.getElementById(

        "loadingSlot"

    );


    LoadingElement.accessibility=

    document.getElementById(

        "loadingAccessibility"

    );

}



/*==============================
    Open / Close
==============================*/

function showLoading(){

    Loading.active=true;


    LoadingElement.root

    ?.classList.add(

        "active"

    );

}


function hideLoading(){

    Loading.active=false;


    LoadingElement.root

    ?.classList.remove(

        "active"

    );

}
/*==============================
    Content
==============================*/

function setLoadingTitle(title){

    if(

        LoadingElement.title

    ){

        LoadingElement.title.textContent=

        title;

    }

}


function setLoadingSubtitle(subtitle){

    if(

        LoadingElement.subtitle

    ){

        LoadingElement.subtitle.textContent=

        subtitle;

    }

}


function setLoadingProgress(value){

    const progress=

    Math.max(

        0,

        Math.min(

            value,

            100

        )

    );


    Loading.progress=

    progress;


    if(

        LoadingElement.progressBar

    ){

        LoadingElement.progressBar.style.width=

        progress+"%";

    }


    if(

        LoadingElement.percent

    ){

        LoadingElement.percent.textContent=

        progress+"%";

    }


    if(

        LoadingElement.accessibility

    ){

        LoadingElement.accessibility.textContent=

        "Loading "+progress+" percent";

    }

}


function setLoadingStatus(status){

    if(

        LoadingElement.status

    ){

        LoadingElement.status.textContent=

        status;

    }

}


function setLoadingTip(tip){

    if(

        LoadingElement.tip

    ){

        LoadingElement.tip.textContent=

        tip;

    }

}


function setLoadingStep(

    current,

    total=Loading.totalSteps

){

    Loading.currentStep=

    current;

    Loading.totalSteps=

    total;


    if(

        LoadingElement.step

    ){

        LoadingElement.step.textContent=

        `Step ${current} / ${total}`;

    }

}



/*==============================
    Reset
==============================*/

function resetLoading(){

    setLoadingTitle(

        "Loading..."

    );


    setLoadingSubtitle(

        "Please wait while Cheem Coding is preparing everything."

    );


    setLoadingProgress(

        0

    );


    setLoadingStatus(

        "Initializing..."

    );


    setLoadingTip(

        "Tip: You can press Ctrl + K to quickly search."

    );


    setLoadingStep(

        1,

        5

    );

}
/*==============================
    Events
==============================*/

function initLoadingEvents(){

    LoadingElement.overlay

    ?.addEventListener(

        "click",

        event=>{

            event.preventDefault();

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

            !Loading.active

        ){

            return;

        }


        if(

            event.key==="Escape"

        ){

            event.preventDefault();

        }

    }

);



/*==============================
    Initialize
==============================*/

function initLoading(){

    initLoadingElements();

    initLoadingEvents();


    console.log(

        "%cLoading Component Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    initLoading

);



/*==============================
    Public API
==============================*/

window.CheemLoading={

    init:initLoading,

    show:showLoading,

    hide:hideLoading,

    reset:resetLoading,

    setTitle:setLoadingTitle,

    setSubtitle:setLoadingSubtitle,

    setProgress:setLoadingProgress,

    setStatus:setLoadingStatus,

    setTip:setLoadingTip,

    setStep:setLoadingStep

};
