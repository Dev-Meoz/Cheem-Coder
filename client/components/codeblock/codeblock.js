/*
=========================================================
    Cheem Coding CodeBlock Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const CodeBlock={

    initialized:false,

    blocks:[]

};



/*==============================
    Initialize
==============================*/

function initCodeBlocks(){

    CodeBlock.blocks=[

        ...document.querySelectorAll(

            ".codeblock"

        )

    ];


    if(

        !CodeBlock.blocks.length

    ){

        return;

    }


    CodeBlock.initialized=true;


    bindCodeBlocks();

}



/*==============================
    Bind
==============================*/

function bindCodeBlocks(){

    CodeBlock.blocks.forEach(

        block=>{

            bindCopyButton(

                block

            );



            bindFoldButton(

                block

            );



            bindFullscreenButton(

                block

            );

        }

    );

}



/*==============================
    Helpers
==============================*/

function getCodeElement(

    block

){

    return block.querySelector(

        "pre code"

    );

}


function getButton(

    block,

    selector

){

    return block.querySelector(

        selector

    );

}
/*==============================
    Copy
==============================*/

function bindCopyButton(

    block

){

    const button=

    getButton(

        block,

        ".codeblock-copy"

    );


    if(

        !button

    ){

        return;

    }


    button.addEventListener(

        "click",

        async()=>{

            const code=

            getCodeElement(

                block

            );


            if(

                !code

            ){

                return;

            }


            await navigator.clipboard.writeText(

                code.innerText

            );


            showCopyStatus(

                block

            );

        }

    );

}


function showCopyStatus(

    block

){

    const badge=

    block.querySelector(

        ".codeblock-copy-status"

    );


    if(

        !badge

    ){

        return;

    }


    badge.classList.add(

        "show"

    );


    setTimeout(

        ()=>{

            badge.classList.remove(

                "show"

            );

        },

        1800

    );

}



/*==============================
    Fold
==============================*/

function bindFoldButton(

    block

){

    const button=

    getButton(

        block,

        ".codeblock-fold"

    );


    if(

        !button

    ){

        return;

    }


    button.addEventListener(

        "click",

        ()=>{

            block.classList.toggle(

                "collapsed"

            );

        }

    );

}



/*==============================
    Fullscreen
==============================*/

function bindFullscreenButton(

    block

){

    const button=

    getButton(

        block,

        ".codeblock-fullscreen"

    );


    if(

        !button

    ){

        return;

    }


    button.addEventListener(

        "click",

        ()=>{

            block.classList.toggle(

                "fullscreen"

            );

        }

    );

}



/*==============================
    Highlight
==============================*/

function highlightCodeBlocks(){

    if(

        typeof Prism==="undefined"

    ){

        return;

    }


    Prism.highlightAll();

}



/*==============================
    Scroll
==============================*/

function scrollToLine(

    element

){

    element?.scrollIntoView({

        behavior:"smooth",

        block:"center"

    });

}
/*==============================
    Refresh
==============================*/

function refreshCodeBlocks(){

    initCodeBlocks();

    highlightCodeBlocks();

}



/*==============================
    Observe Dynamic Changes
==============================*/

const codeBlockObserver=

new MutationObserver(

    ()=>{

        if(

            CodeBlock.initialized

        ){

            refreshCodeBlocks();

        }

    }

);


document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        refreshCodeBlocks();


        codeBlockObserver.observe(

            document.body,

            {

                childList:true,

                subtree:true

            }

        );


        console.log(

            "%cCodeBlock Component Loaded",

            "color:#8b5cf6;font-weight:bold;"

        );

    }

);



/*==============================
    Destroy
==============================*/

function destroyCodeBlocks(){

    codeBlockObserver.disconnect();

}



/*==============================
    Public API
==============================*/

window.CheemCodeBlock={

    init:initCodeBlocks,

    refresh:refreshCodeBlocks,

    highlight:highlightCodeBlocks,

    scrollToLine,

    destroy:destroyCodeBlocks

};
