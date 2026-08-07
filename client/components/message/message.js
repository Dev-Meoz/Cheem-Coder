/*
=========================================================
    Cheem Coding Message Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Message={

    container:null,

    messages:[],

    initialized:false

};



/*==============================
    Initialize
==============================*/

function initMessages(

    selector=".messages"

){

    Message.container=

    document.querySelector(

        selector

    );


    if(

        !Message.container

    ){

        return;

    }


    Message.messages=[

        ...Message.container.querySelectorAll(

            ".message"

        )

    ];


    Message.initialized=true;


    bindMessages();

}



/*==============================
    Bind
==============================*/

function bindMessages(){

    Message.messages.forEach(

        message=>{

            bindActions(

                message

            );


            bindImages(

                message

            );

        }

    );

}



/*==============================
    Helpers
==============================*/

function getMessageById(

    id

){

    return Message.container

    ?.querySelector(

        `[data-message-id="${id}"]`

    );

}


function getMessageContent(

    message

){

    return message.querySelector(

        ".message-content"

    );

}
/*==============================
    Actions
==============================*/

function bindActions(

    message

){

    message

    .querySelectorAll(

        ".message-action"

    )

    .forEach(

        button=>{

            button.addEventListener(

                "click",

                ()=>{

                    const action=

                    button.dataset.action;


                    switch(action){

                        case"copy":

                            copyMessage(

                                message

                            );

                            break;


                        case"edit":

                            editMessage(

                                message

                            );

                            break;


                        case"delete":

                            deleteMessage(

                                message

                            );

                            break;


                        case"regenerate":

                            regenerateMessage(

                                message

                            );

                            break;


                        case"like":

                        case"dislike":

                            reactMessage(

                                message,

                                action

                            );

                            break;

                    }

                }

            );

        }

    );

}



/*==============================
    Copy
==============================*/

async function copyMessage(

    message

){

    const content=

    getMessageContent(

        message

    );


    if(

        !content

    ){

        return;

    }


    await navigator.clipboard.writeText(

        content.innerText

    );

}



/*==============================
    Edit
==============================*/

function editMessage(

    message

){

    message.classList.add(

        "edited"

    );

}



/*==============================
    Delete
==============================*/

function deleteMessage(

    message

){

    message.remove();

}



/*==============================
    Regenerate
==============================*/

function regenerateMessage(

    message

){

    message.dispatchEvent(

        new CustomEvent(

            "message:regenerate"

        )

    );

}



/*==============================
    Reaction
==============================*/

function reactMessage(

    message,

    type

){

    message.dataset.reaction=

    type;

}



/*==============================
    Image Preview
==============================*/

function bindImages(

    message

){

    message

    .querySelectorAll(

        ".message-image"

    )

    .forEach(

        image=>{

            image.addEventListener(

                "click",

                ()=>{

                    window.open(

                        image.src,

                        "_blank"

                    );

                }

            );

        }

    );

}



/*==============================
    Scroll
==============================*/

function scrollToMessage(

    id

){

    getMessageById(

        id

    )

    ?.scrollIntoView({

        behavior:"smooth",

        block:"center"

    });

}
/*==============================
    Refresh
==============================*/

function refreshMessages(){

    initMessages();

}



/*==============================
    Observer
==============================*/

const messageObserver=

new MutationObserver(

    ()=>{

        if(

            Message.initialized

        ){

            refreshMessages();

        }

    }

);



/*==============================
    Initialize
==============================*/

function bootMessages(){

    refreshMessages();


    messageObserver.observe(

        document.body,

        {

            childList:true,

            subtree:true

        }

    );


    console.log(

        "%cMessage Component Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    bootMessages

);



/*==============================
    Destroy
==============================*/

function destroyMessages(){

    messageObserver.disconnect();

}



/*==============================
    Public API
==============================*/

window.CheemMessage={

    init:initMessages,

    refresh:refreshMessages,

    get:getMessageById,

    copy:copyMessage,

    edit:editMessage,

    delete:deleteMessage,

    regenerate:regenerateMessage,

    react:reactMessage,

    scroll:scrollToMessage,

    destroy:destroyMessages

};
