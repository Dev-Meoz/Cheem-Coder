/*=========================================================
    Cheem Coder
    Splash Screen
=========================================================*/

"use strict";

/*=========================================================
    Elements
=========================================================*/

const progressBar = document.getElementById("progressBar");

const loadingText = document.getElementById("loadingText");

/*=========================================================
    Loading Messages
=========================================================*/

const messages = [

    "Initializing...",

    "Loading Interface...",

    "Loading Components...",

    "Connecting Services...",

    "Preparing AI Engine...",

    "Optimizing Performance...",

    "Loading Assets...",

    "Starting Cheem Coder..."

];

/*=========================================================
    Progress
=========================================================*/

let progress = 0;

let messageIndex = 0;

/*=========================================================
    Update Text
=========================================================*/

function updateMessage(){

    if(messageIndex < messages.length){

        loadingText.textContent = messages[messageIndex];

        messageIndex++;

    }

}

/*=========================================================
    Start Loading
=========================================================*/

const loading = setInterval(()=>{

    progress++;

    progressBar.style.width = progress + "%";

    if(progress % 12 === 0){

        updateMessage();

    }

    if(progress >= 100){

        clearInterval(loading);

        finishSplash();

    }

},25);

/*=========================================================
    Finish
=========================================================*/

function finishSplash(){

    loadingText.textContent = "Welcome to Cheem Coder";

    document.body.style.transition = "opacity .6s ease";

    setTimeout(()=>{

        document.body.style.opacity = "0";

    },500);

    setTimeout(()=>{

        window.location.href = "../auth/login.html";

    },1200);

}

/*=========================================================
    Logo Animation
=========================================================*/

const logo = document.querySelector(".logo");

if(logo){

    logo.addEventListener("mouseenter",()=>{

        logo.style.transform = "scale(1.08) rotate(6deg)";

    });

    logo.addEventListener("mouseleave",()=>{

        logo.style.transform = "";

    });

}

/*=========================================================
    Disable Right Click (Optional)
=========================================================*/

// document.addEventListener("contextmenu",(e)=>{

//     e.preventDefault();

// });

/*=========================================================
    Disable Drag
=========================================================*/

document.querySelectorAll("img").forEach(img=>{

    img.draggable = false;

});

/*=========================================================
    Console
=========================================================*/

console.clear();

console.log("%cCheem Coder",

"color:#3b82f6;font-size:28px;font-weight:bold;");

console.log("%cAI Coding Assistant",

"color:#94a3b8;font-size:14px;");

console.log("Version: Alpha v1.0");

/*=========================================================
    End
=========================================================*/
