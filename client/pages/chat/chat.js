/*=========================================================
    Cheem Coding
    Chat JavaScript
=========================================================*/

"use strict";

/*==============================
    Watermark
==============================*/

const AI_WATERMARK = "Chat Cheem Coding - Meoz building";

/*==============================
    Config
==============================*/

const CONFIG = {

    api: "/api/chat",

    stream: true,

    markdown: true,

    highlight: true,

    watermark: true,

    typingSpeed: 15

};

/*==============================
    DOM
==============================*/

const messages = document.querySelector(".messages");

const promptInput = document.getElementById("promptInput");

const sendButton = document.getElementById("sendButton");

const uploadButton = document.getElementById("uploadButton");

const modelSelect = document.getElementById("modelSelect");

const newChatButton = document.getElementById("newChat");

/*==============================
    State
==============================*/

let conversation = [];

let generating = false;

let currentModel = "Cheem-Coding";

let currentController = null;

/*==============================
    Utils
==============================*/

function uuid(){

    return crypto.randomUUID();

}

function now(){

    return new Date().toISOString();

}

function scrollBottom(){

    messages.scrollTop = messages.scrollHeight;

}

/*==============================
    Watermark
==============================*/

function addWatermark(text){

    if(!CONFIG.watermark){

        return text;

    }

    return `> ${AI_WATERMARK}\n\n${text}`;

}

/*==============================
    Markdown
==============================*/

function renderMarkdown(text){

    if(CONFIG.markdown && window.marked){

        return marked.parse(text);

    }

    return text;

}

/*==============================
    Escape
==============================*/

function escapeHTML(text){

    return text

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;");

}

/*==============================
    Message
==============================*/

function createMessage(role,text){

    const wrapper=document.createElement("div");

    wrapper.className=`message ${role}`;

    const bubble=document.createElement("div");

    bubble.className="bubble";

    if(role==="assistant"){

        text=addWatermark(text);

        bubble.innerHTML=renderMarkdown(text);

    }else{

        bubble.innerHTML=escapeHTML(text);

    }

    wrapper.appendChild(bubble);

    messages.appendChild(wrapper);

    scrollBottom();

    return bubble;

}
/*==============================
    Send Message
==============================*/

async function sendMessage(){

    if(generating){

        return;

    }

    const prompt=promptInput.value.trim();

    if(!prompt){

        return;

    }

    generating=true;

    sendButton.disabled=true;

    createMessage("user",prompt);

    promptInput.value="";

    autoResize();

    const aiBubble=createMessage("assistant","");

    conversation.push({

        id:uuid(),

        role:"user",

        content:prompt,

        time:now()

    });

    showTyping();

    try{

        if(CONFIG.stream){

            await streamMessage(prompt,aiBubble);

        }else{

            await normalMessage(prompt,aiBubble);

        }

    }catch(error){

        aiBubble.innerHTML=

        `<span style="color:#ef4444">

        ${escapeHTML(error.message)}

        </span>`;

    }

    hideTyping();

    generating=false;

    sendButton.disabled=false;

    scrollBottom();

}

/*==============================
    Normal API
==============================*/

async function normalMessage(prompt,bubble){

    const response=await fetch(CONFIG.api,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            model:currentModel,

            conversation,

            prompt

        })

    });

    const data=await response.json();

    const text=addWatermark(data.reply);

    bubble.innerHTML=renderMarkdown(text);

    highlightCode();

    conversation.push({

        id:uuid(),

        role:"assistant",

        content:data.reply,

        time:now()

    });

}

/*==============================
    Stream API
==============================*/

async function streamMessage(prompt,bubble){

    currentController=new AbortController();

    const response=await fetch(CONFIG.api,{

        method:"POST",

        signal:currentController.signal,

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            stream:true,

            model:currentModel,

            conversation,

            prompt

        })

    });

    const reader=response.body.getReader();

    const decoder=new TextDecoder();

    let text="";

    while(true){

        const{

            done,

            value

        }=await reader.read();

        if(done){

            break;

        }

        text+=decoder.decode(value);

        bubble.innerHTML=

        renderMarkdown(

            addWatermark(text)

        );

        highlightCode();

        scrollBottom();

    }

    conversation.push({

        id:uuid(),

        role:"assistant",

        content:text,

        time:now()

    });

}

/*==============================
    Stop Stream
==============================*/

function stopGenerating(){

    if(currentController){

        currentController.abort();

    }

    generating=false;

}

/*==============================
    Highlight
==============================*/

function highlightCode(){

    if(!window.hljs){

        return;

    }

    document

    .querySelectorAll("pre code")

    .forEach(block=>{

        hljs.highlightElement(block);

    });

}
/*==============================
    Typing Indicator
==============================*/

let typingElement=null;

function showTyping(){

    if(typingElement){

        return;

    }

    typingElement=document.createElement("div");

    typingElement.className="typing";

    typingElement.innerHTML=`
        <div class="typingAvatar">
            <img src="../../assets/logo/OIP.jpg" alt="Cheem Coding">
        </div>

        <div class="typingBubble">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    messages.appendChild(typingElement);

    scrollBottom();

}

function hideTyping(){

    if(!typingElement){

        return;

    }

    typingElement.remove();

    typingElement=null;

}

/*==============================
    Auto Resize
==============================*/

function autoResize(){

    promptInput.style.height="auto";

    promptInput.style.height=

    promptInput.scrollHeight+"px";

}

/*==============================
    Copy Code
==============================*/

document.addEventListener(

"click",

async(event)=>{

    const button=

    event.target.closest(".copyButton");

    if(!button){

        return;

    }

    const code=

    button.parentElement

    .querySelector("code")

    ?.innerText||"";

    try{

        await navigator

        .clipboard

        .writeText(code);

        button.textContent="Copied";

        setTimeout(()=>{

            button.textContent="Copy";

        },2000);

    }

    catch{}

});

/*==============================
    Keyboard
==============================*/

promptInput.addEventListener(

"keydown",

(event)=>{

    if(

        event.key==="Enter"

        &&

        !event.shiftKey

    ){

        event.preventDefault();

        sendMessage();

    }

});

promptInput.addEventListener(

"input",

autoResize

);

/*==============================
    Buttons
==============================*/

sendButton.addEventListener(

"click",

sendMessage

);

newChatButton.addEventListener(

"click",

()=>{

    if(generating){

        stopGenerating();

    }

    conversation=[];

    messages.innerHTML="";

});

/*==============================
    Model
==============================*/

modelSelect.addEventListener(

"change",

()=>{

    currentModel=

    modelSelect.value;

});

/*==============================
    Save Conversation
==============================*/

function saveConversation(){

    localStorage.setItem(

        "cheem_conversation",

        JSON.stringify(conversation)

    );

}

function loadConversation(){

    const cache=

    localStorage.getItem(

        "cheem_conversation"

    );

    if(!cache){

        return;

    }

    conversation=

    JSON.parse(cache);

}

window.addEventListener(

"beforeunload",

saveConversation

);

loadConversation();
/*==============================
    Theme
==============================*/

const themeButton=

document.getElementById("themeBtn");

function toggleTheme(){

    document.body.classList.toggle("light");

    localStorage.setItem(

        "cheem_theme",

        document.body.classList.contains("light")

        ?

        "light"

        :

        "dark"

    );

}

function loadTheme(){

    if(

        localStorage.getItem("cheem_theme")

        ===

        "light"

    ){

        document.body.classList.add("light");

    }

}

themeButton?.addEventListener(

"click",

toggleTheme

);

/*==============================
    Upload
==============================*/

uploadButton?.addEventListener(

"click",

()=>{

    document

    .getElementById("fileInput")

    ?.click();

});

document

.getElementById("fileInput")

?.addEventListener(

"change",

event=>{

    const file=

    event.target.files[0];

    if(!file){

        return;

    }

    showToast(

        `Selected: ${file.name}`,

        "success"

    );

});

/*==============================
    Toast
==============================*/

function showToast(

text,

type="success"

){

    const toast=

    document.createElement("div");

    toast.className=

    `toast ${type}`;

    toast.innerHTML=`

        <h4>${type.toUpperCase()}</h4>

        <p>${escapeHTML(text)}</p>

    `;

    document.body.appendChild(toast);

    requestAnimationFrame(

        ()=>toast.classList.add("show")

    );

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(

            ()=>toast.remove(),

            250

        );

    },2500);

}

/*==============================
    Export Chat
==============================*/

function exportChat(){

    const blob=

    new Blob(

        [

            JSON.stringify(

                conversation,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="conversation.json";

    a.click();

    URL.revokeObjectURL(url);

}

/*==============================
    Sidebar
==============================*/

document

.getElementById("toggleSidebar")

?.addEventListener(

"click",

()=>{

    document

    .querySelector(".sidebar")

    ?.classList.toggle("show");

});

/*==============================
    Regenerate
==============================*/

async function regenerate(){

    const last=

    conversation

    .filter(

        item=>item.role==="user"

    )

    .at(-1);

    if(!last){

        return;

    }

    promptInput.value=

    last.content;

    await sendMessage();

}

/*==============================
    Initialize
==============================*/

function init(){

    loadTheme();

    autoResize();

    scrollBottom();

    console.log(

        "%cChat Cheem Coding - Meoz building",

        "color:#3b82f6;font-size:16px;font-weight:bold"

    );

}

document.addEventListener(

"DOMContentLoaded",

init

);

/*==============================
    Public API
==============================*/

window.CheemCoding={

    sendMessage,

    stopGenerating,

    regenerate,

    exportChat,

    saveConversation,

    loadConversation,

    showToast

};
