/*
=========================================================
    Cheem Coding Avatar Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Avatar={

    initialized:false,

    avatars:[]

};



/*==============================
    Initialize
==============================*/

function initAvatars(){

    Avatar.avatars=[

        ...document.querySelectorAll(

            ".avatar"

        )

    ];


    if(

        !Avatar.avatars.length

    ){

        return;

    }


    Avatar.initialized=true;


    bindAvatars();

}



/*==============================
    Bind
==============================*/

function bindAvatars(){

    Avatar.avatars.forEach(

        avatar=>{

            bindImageFallback(

                avatar

            );


            bindUpload(

                avatar

            );

        }

    );

}



/*==============================
    Helpers
==============================*/

function getAvatarImage(

    avatar

){

    return avatar.querySelector(

        "img"

    );

}


function getAvatarInitial(

    avatar

){

    return avatar.querySelector(

        ".avatar-initial"

    );

}
/*==============================
    Image Fallback
==============================*/

function bindImageFallback(

    avatar

){

    const image=

    getAvatarImage(

        avatar

    );


    if(

        !image

    ){

        return;

    }


    image.addEventListener(

        "error",

        ()=>{

            image.style.display=

            "none";


            getAvatarInitial(

                avatar

            )?.removeAttribute(

                "hidden"

            );

        }

    );

}



/*==============================
    Upload
==============================*/

function bindUpload(

    avatar

){

    const input=

    avatar.querySelector(

        'input[type="file"]'

    );


    if(

        !input

    ){

        return;

    }


    input.addEventListener(

        "change",

        event=>{

            const file=

            event.target.files?.[0];


            if(

                !file

            ){

                return;

            }


            const reader=

            new FileReader();


            reader.onload=()=>{

                const image=

                getAvatarImage(

                    avatar

                );


                if(

                    image

                ){

                    image.src=

                    reader.result;

                }

            };


            reader.readAsDataURL(

                file

            );

        }

    );

}



/*==============================
    Status
==============================*/

function setAvatarStatus(

    avatar,

    status

){

    avatar.classList.remove(

        "online",

        "offline",

        "busy",

        "away"

    );


    avatar.classList.add(

        status

    );

}



/*==============================
    Initial
==============================*/

function setAvatarInitial(

    avatar,

    text

){

    const initial=

    getAvatarInitial(

        avatar

    );


    if(

        initial

    ){

        initial.textContent=

        text;

    }

}



/*==============================
    Lazy Loading
==============================*/

function lazyLoadAvatar(

    avatar

){

    getAvatarImage(

        avatar

    )?.setAttribute(

        "loading",

        "lazy"

    );

}



/*==============================
    Preview
==============================*/

function previewAvatar(

    avatar

){

    const image=

    getAvatarImage(

        avatar

    );


    if(

        image?.src

    ){

        window.open(

            image.src,

            "_blank"

        );

    }

}
/*==============================
    Refresh
==============================*/

function refreshAvatars(){

    initAvatars();


    Avatar.avatars.forEach(

        avatar=>{

            lazyLoadAvatar(

                avatar

            );

        }

    );

}



/*==============================
    Observer
==============================*/

const avatarObserver=

new MutationObserver(

    ()=>{

        if(

            Avatar.initialized

        ){

            refreshAvatars();

        }

    }

);



/*==============================
    Initialize
==============================*/

function bootAvatars(){

    refreshAvatars();


    avatarObserver.observe(

        document.body,

        {

            childList:true,

            subtree:true

        }

    );


    console.log(

        "%cAvatar Component Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    bootAvatars

);



/*==============================
    Destroy
==============================*/

function destroyAvatars(){

    avatarObserver.disconnect();

}



/*==============================
    Public API
==============================*/

window.CheemAvatar={

    init:initAvatars,

    refresh:refreshAvatars,

    preview:previewAvatar,

    setStatus:setAvatarStatus,

    setInitial:setAvatarInitial,

    destroy:destroyAvatars

};
