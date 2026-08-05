/*=========================================================
    Cheem Coding
    Markdown Engine
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const MarkdownConfig={

    markdown:true,

    sanitize:true,

    highlight:true,

    copyButton:true,

    lineNumber:true,

    autoLink:true,

    emoji:true,

    math:false,

    mermaid:true,

    breaks:true

};

/*==============================
    Markdown Init
==============================*/

function initMarkdown(){

    if(!window.marked){

        console.warn(

            "marked.js not found."

        );

        return;

    }

    marked.setOptions({

        breaks:MarkdownConfig.breaks,

        gfm:true

    });

}

/*==============================
    Render
==============================*/

function renderMarkdown(text){

    if(!MarkdownConfig.markdown){

        return escapeHTML(text);

    }

    let html=marked.parse(text);

    if(

        MarkdownConfig.sanitize

        &&

        window.DOMPurify

    ){

        html=DOMPurify.sanitize(html);

    }

    return html;

}

/*==============================
    Render Element
==============================*/

function renderMarkdownElement(

element,

text

){

    element.innerHTML=

    renderMarkdown(text);

    highlightMarkdown();

    buildCodeBlocks();

    renderMermaid();

}

/*==============================
    Escape HTML
==============================*/

function escapeHTML(text){

    return text

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;");

}
/*==============================
    Highlight.js
==============================*/

function highlightMarkdown(){

    if(

        !MarkdownConfig.highlight

        ||

        !window.hljs

    ){

        return;

    }

    document

    .querySelectorAll("pre code")

    .forEach(code=>{

        hljs.highlightElement(code);

    });

}

/*==============================
    Build Code Blocks
==============================*/

function buildCodeBlocks(){

    document

    .querySelectorAll("pre")

    .forEach(pre=>{

        if(

            pre.dataset.ready

        ){

            return;

        }

        pre.dataset.ready="true";

        const code=

        pre.querySelector("code");

        if(!code){

            return;

        }

        const language=

        detectLanguage(code);

        const wrapper=

        document.createElement("div");

        wrapper.className="codeWrapper";

        const header=

        document.createElement("div");

        header.className="codeHeader";

        header.innerHTML=`

            <span class="codeLanguage">

                ${language}

            </span>

            <button

                class="copyButton"

                data-copy

            >

                Copy

            </button>

        `;

        pre.parentNode.insertBefore(

            wrapper,

            pre

        );

        wrapper.appendChild(header);

        wrapper.appendChild(pre);

        if(

            MarkdownConfig.lineNumber

        ){

            addLineNumbers(pre);

        }

    });

}

/*==============================
    Detect Language
==============================*/

function detectLanguage(code){

    const cls=

    [...code.classList]

    .find(item=>

        item.startsWith("language-")

    );

    if(!cls){

        return "TEXT";

    }

    return cls

    .replace("language-","")

    .toUpperCase();

}

/*==============================
    Copy Button
==============================*/

document.addEventListener(

"click",

async(event)=>{

    const button=

    event.target.closest(

        "[data-copy]"

    );

    if(!button){

        return;

    }

    const code=

    button

    .closest(".codeWrapper")

    .querySelector("code")

    .innerText;

    await navigator

    .clipboard

    .writeText(code);

    button.innerText="Copied";

    setTimeout(()=>{

        button.innerText="Copy";

    },1500);

});

/*==============================
    Line Numbers
==============================*/

function addLineNumbers(pre){

    const code=

    pre.querySelector("code");

    const lines=

    code.innerHTML.split("\n");

    code.innerHTML=

    lines

    .map(

        line=>

        `<span>${line}</span>`

    )

    .join("\n");

}

/*==============================
    Code Watermark
==============================*/

function addCodeWatermark(){

    document

    .querySelectorAll(".codeHeader")

    .forEach(header=>{

        if(

            header.querySelector(

                ".codeMark"

            )

        ){

            return;

        }

        const mark=

        document.createElement("span");

        mark.className="codeMark";

        mark.innerText=

        "Chat Cheem Coding - Meoz building";

        header.prepend(mark);

    });

}/*==============================
    Mermaid
==============================*/

function renderMermaid(){

    if(

        !window.mermaid

        ||

        !MarkdownConfig.mermaid

    ){

        return;

    }

    document

    .querySelectorAll("code.language-mermaid")

    .forEach(code=>{

        const container=

        document.createElement("div");

        container.className="mermaid";

        container.textContent=

        code.textContent;

        code.parentElement.replaceWith(container);

    });

    try{

        mermaid.initialize({

            startOnLoad:false,

            securityLevel:"loose"

        });

        mermaid.run();

    }

    catch(error){

        console.error(error);

    }

}

/*==============================
    KaTeX
==============================*/

function renderMath(){

    if(

        !window.renderMathInElement

        ||

        !MarkdownConfig.math

    ){

        return;

    }

    renderMathInElement(

        document.body,

        {

            delimiters:[

                {

                    left:"$$",

                    right:"$$",

                    display:true

                },

                {

                    left:"$",

                    right:"$",

                    display:false

                }

            ]

        }

    );

}

/*==============================
    Auto Link
==============================*/

function autoLink(){

    if(

        !MarkdownConfig.autoLink

    ){

        return;

    }

    document

    .querySelectorAll("a")

    .forEach(link=>{

        link.target="_blank";

        link.rel=

        "noopener noreferrer";

    });

}

/*==============================
    Image
==============================*/

function markdownImage(){

    document

    .querySelectorAll("img")

    .forEach(image=>{

        image.loading="lazy";

        image.decoding="async";

        image.addEventListener(

            "click",

            ()=>{

                window.open(

                    image.src,

                    "_blank"

                );

            }

        );

    });

}

/*==============================
    Table
==============================*/

function markdownTable(){

    document

    .querySelectorAll("table")

    .forEach(table=>{

        if(

            table.parentNode

            .classList

            ?.contains(

                "tableWrapper"

            )

        ){

            return;

        }

        const wrapper=

        document.createElement("div");

        wrapper.className=

        "tableWrapper";

        table.parentNode

        .insertBefore(

            wrapper,

            table

        );

        wrapper.appendChild(table);

    });

}

/*==============================
    Emoji
==============================*/

function markdownEmoji(){

    if(

        !MarkdownConfig.emoji

    ){

        return;

    }

}

/*==============================
    Refresh
==============================*/

function refreshMarkdown(){

    highlightMarkdown();

    buildCodeBlocks();

    markdownImage();

    markdownTable();

    autoLink();

    addCodeWatermark();

    renderMermaid();

    renderMath();

    markdownEmoji();

}

/*==============================
    Initialize
==============================*/

function initializeMarkdown(){

    initMarkdown();

    refreshMarkdown();

    console.log(

        "%cMarkdown Ready",

        "color:#3b82f6;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initializeMarkdown

);

/*==============================
    Public API
==============================*/

window.CheemMarkdown={

    renderMarkdown,

    renderMarkdownElement,

    refreshMarkdown,

    highlightMarkdown,

    buildCodeBlocks,

    addCodeWatermark,

    markdownImage,

    markdownTable,

    renderMermaid,

    renderMath

};
