/*=========================================================
    Cheem Coding
    Conversation Manager
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const ConversationConfig={

    maxMessages:500,

    autoTitle:true,

    autoSave:true,

    rememberContext:true,

    storageKey:"cheem_conversation"

};

/*==============================
    State
==============================*/

let Conversations=[];

let ActiveConversation=null;

/*==============================
    Conversation Class
==============================*/

class Conversation{

    constructor(title="New Chat"){

        this.id=crypto.randomUUID();

        this.title=title;

        this.messages=[];

        this.created=new Date().toISOString();

        this.updated=new Date().toISOString();

        this.tokens=0;

        this.model=null;

        this.favorite=false;

    }

}

/*==============================
    Create
==============================*/

function createConversation(

title="New Chat"

){

    const conversation=

    new Conversation(title);

    Conversations.unshift(

        conversation

    );

    ActiveConversation=

    conversation.id;

    saveConversation();

    return conversation;

}

/*==============================
    Get
==============================*/

function getConversation(id){

    return Conversations.find(

        item=>item.id===id

    );

}

/*==============================
    Current
==============================*/

function currentConversation(){

    return getConversation(

        ActiveConversation

    );

}

/*==============================
    Switch
==============================*/

function switchConversation(id){

    const chat=

    getConversation(id);

    if(!chat){

        return;

    }

    ActiveConversation=id;

    renderConversation();

}

/*==============================
    Add Message
==============================*/

function addMessage(

role,

content,

extra={}

){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    chat.messages.push({

        id:crypto.randomUUID(),

        role,

        content,

        created:new Date().toISOString(),

        ...extra

    });

    chat.updated=

    new Date().toISOString();

    if(

        ConversationConfig.autoTitle

        &&

        chat.messages.length===1

    ){

        chat.title=

        content.slice(0,40);

    }

    saveConversation();

}
/*==============================
    Edit Message
==============================*/

function editMessage(

messageId,

content

){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    const message=

    chat.messages.find(

        item=>item.id===messageId

    );

    if(!message){

        return;

    }

    message.content=content;

    message.edited=true;

    message.updated=

    new Date().toISOString();

    saveConversation();

    renderConversation();

}

/*==============================
    Delete Message
==============================*/

function deleteMessage(

messageId

){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    chat.messages=

    chat.messages.filter(

        item=>

messageId

    );

    saveConversation();

    renderConversation();

}

/*==============================
    Regenerate
==============================*/

async function regenerateMessage(

messageId

){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    const index=

    chat.messages.findIndex(

        item=>item.id===messageId

    );

    if(index<0){

        return;

    }

    const target=

    chat.messages[index];

    if(

        target.role!=="assistant"

    ){

        return;

    }

    chat.messages.splice(

        index,

        1

    );

    saveConversation();

    if(

        window.CheemStream

    ){

        await CheemStream.send();

    }

}

/*==============================
    Token Counter
==============================*/

function calculateTokens(){

    const chat=

    currentConversation();

    if(!chat){

        return 0;

    }

    let tokens=0;

    chat.messages.forEach(msg=>{

        tokens+=

        Math.ceil(

            msg.content.length/4

        );

    });

    chat.tokens=tokens;

    return tokens;

}

/*==============================
    Search
==============================*/

function searchMessages(

keyword

){

    const chat=

    currentConversation();

    if(!chat){

        return[];

    }

    keyword=

    keyword.toLowerCase();

    return chat.messages.filter(

        message=>

        message.content

        .toLowerCase()

        .includes(keyword)

    );

}

/*==============================
    Export Markdown
==============================*/

function exportMarkdown(){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    let markdown="";

    chat.messages.forEach(msg=>{

        markdown+=

`## ${msg.role}

${msg.content}

`;

    });

    downloadFile(

        markdown,

        `${chat.title}.md`,

        "text/markdown"

    );

}

/*==============================
    Export JSON
==============================*/

function exportConversation(){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    downloadFile(

        JSON.stringify(

            chat,

            null,

            2

        ),

        `${chat.title}.json`,

        "application/json"

    );

}

/*==============================
    Statistics
==============================*/

function conversationStatistics(){

    const chat=

    currentConversation();

    if(!chat){

        return null;

    }

    return{

        messages:

        chat.messages.length,

        tokens:

        calculateTokens(),

        created:

        chat.created,

        updated:

        chat.updated,

        model:

        chat.model

    };

}
/*==============================
    Render Conversation
==============================*/

function renderConversation(){

    const container=

    document.getElementById(

        "chatMessages"

    );

    if(

        !container

    ){

        return;

    }

    const chat=

    currentConversation();

    if(!chat){

        container.innerHTML="";

        return;

    }

    container.innerHTML="";

    chat.messages.forEach(message=>{

        if(

            window.addMessage

        ){

            addMessage(

                message.role,

                message.content,

                false

            );

        }

    });

}

/*==============================
    Save
==============================*/

function saveConversation(){

    if(

        !ConversationConfig.autoSave

    ){

        return;

    }

    localStorage.setItem(

        ConversationConfig.storageKey,

        JSON.stringify(

            Conversations

        )

    );

    localStorage.setItem(

        "cheem_active_chat",

        ActiveConversation

    );

}

/*==============================
    Load
==============================*/

function loadConversation(){

    const cache=

    localStorage.getItem(

        ConversationConfig.storageKey

    );

    if(cache){

        try{

            Conversations=

            JSON.parse(cache);

        }

        catch{

            Conversations=[];

        }

    }

    ActiveConversation=

    localStorage.getItem(

        "cheem_active_chat"

    );

    if(

        !ActiveConversation

        &&

        Conversations.length

    ){

        ActiveConversation=

        Conversations[0].id;

    }

}

/*==============================
    Duplicate
==============================*/

function duplicateConversation(id){

    const source=

    getConversation(id);

    if(!source){

        return;

    }

    const clone=

    JSON.parse(

        JSON.stringify(source)

    );

    clone.id=

    crypto.randomUUID();

    clone.title=

    source.title+

    " (Copy)";

    clone.created=

    new Date().toISOString();

    clone.updated=

    new Date().toISOString();

    Conversations.unshift(

        clone

    );

    saveConversation();

}

/*==============================
    Clear
==============================*/

function clearConversation(){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    chat.messages=[];

    chat.tokens=0;

    chat.updated=

    new Date().toISOString();

    saveConversation();

    renderConversation();

}

/*==============================
    Favorite
==============================*/

function favoriteConversation(id){

    const chat=

    getConversation(id);

    if(!chat){

        return;

    }

    chat.favorite=

    !chat.favorite;

    saveConversation();

}

/*==============================
    Rename
==============================*/

function renameConversation(

id,

title

){

    const chat=

    getConversation(id);

    if(!chat){

        return;

    }

    chat.title=title;

    chat.updated=

    new Date().toISOString();

    saveConversation();

}

/*==============================
    Auto Save
==============================*/

window.addEventListener(

    "beforeunload",

    saveConversation

);

/*==============================
    Initialize
==============================*/

function initConversation(){

    loadConversation();

    renderConversation();

    console.log(

        "%cConversation Ready",

        "color:#22c55e;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initConversation

);

/*==============================
    Public API
==============================*/

window.CheemConversation={

    createConversation,

    getConversation,

    currentConversation,

    switchConversation,

    addMessage,

    editMessage,

    deleteMessage,

    regenerateMessage,

    searchMessages,

    calculateTokens,

    exportConversation,

    exportMarkdown,

    conversationStatistics,

    duplicateConversation,

    clearConversation,

    favoriteConversation,

    renameConversation,

    renderConversation,

    saveConversation,

    loadConversation

};
