/*
=========================================================
    Cheem Coding Markdown Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Markdown={

    initialized:false,

    container:null

};



/*==============================
    Initialize
==============================*/

function initMarkdown(

    selector=".markdown"

){

    Markdown.container=

    document.querySelector(

        selector

    );


    if(

        !Markdown.container

    ){

        return;

    }


    Markdown.initialized=true;


    processMarkdown();

}



/*==============================
    Render
==============================*/

function renderMarkdown(

    text

){

    if(

        typeof marked==="undefined"

    ){

        return text;

    }


    return marked.parse(

        text

    );

}



/*==============================
    Process
==============================*/

function processMarkdown(){

    if(

        !Markdown.container

    ){

        return;

    }


    Markdown.container

    .querySelectorAll(

        "[data-markdown]"

    )

    .forEach(

        element=>{

            element.innerHTML=

            renderMarkdown(

                element.textContent

            );

        }

    );

}
/*==============================
    Sanitize
==============================*/

function sanitizeMarkdown(){

    if(

        typeof DOMPurify==="undefined"

    ){

        return;

    }


    Markdown.container

    .innerHTML=

    DOMPurify.sanitize(

        Markdown.container.innerHTML

    );

}



/*==============================
    Highlight
==============================*/

function highlightMarkdown(){

    if(

        typeof Prism==="undefined"

    ){

        return;

    }


    Prism.highlightAllUnder(

        Markdown.container

    );

}



/*==============================
    Mermaid
==============================*/

function renderMermaid(){

    if(

        typeof mermaid==="undefined"

    ){

        return;

    }


    Markdown.container

    .querySelectorAll(

        ".language-mermaid"

    )

    .forEach(

        block=>{

            mermaid.run({

                nodes:[block]

            });

        }

    );

}



/*==============================
    KaTeX
==============================*/

function renderKatex(){

    if(

        typeof renderMathInElement==="undefined"

    ){

        return;

    }


    renderMathInElement(

        Markdown.container

    );

}



/*==============================
    Links & Images
==============================*/

function optimizeMarkdown(){

    Markdown.container

    .querySelectorAll(

        "a"

    )

    .forEach(

        link=>{

            if(

                link.hostname!==location.hostname

            ){

                link.target="_blank";

                link.rel=

                "noopener noreferrer";

            }

        }

    );


    Markdown.container

    .querySelectorAll(

        "img"

    )

    .forEach(

        image=>{

            image.loading="lazy";

            image.decoding="async";

        }

    );

}
/*==============================
    Refresh
==============================*/

function refreshMarkdown(){

    if(

        !Markdown.initialized

    ){

        return;

    }


    processMarkdown();

    sanitizeMarkdown();

    highlightMarkdown();

    renderMermaid();

    renderKatex();

    optimizeMarkdown();

}



/*==============================
    Initialize
==============================*/

function bootMarkdown(){

    initMarkdown();

    refreshMarkdown();


    console.log(

        "%cMarkdown Component Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    bootMarkdown

);



/*==============================
    Public API
==============================*/

window.CheemMarkdown={

    init:initMarkdown,

    render:renderMarkdown,

    process:processMarkdown,

    sanitize:sanitizeMarkdown,

    highlight:highlightMarkdown,

    mermaid:renderMermaid,

    katex:renderKatex,

    optimize:optimizeMarkdown,

    refresh:refreshMarkdown

};
