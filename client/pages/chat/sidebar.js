/*=========================================================
    Cheem Coding
    Sidebar
=========================================================*/

"use strict";

/*==============================
    DOM
==============================*/

const sidebar = document.querySelector(".sidebar");

const sidebarToggle = document.getElementById("toggleSidebar");

const sidebarClose = document.getElementById("closeSidebar");

const historyList = document.getElementById("historyList");

const newChatBtn = document.getElementById("newChat");

const searchHistory = document.getElementById("searchHistory");

/*==============================
    Sidebar
==============================*/

function openSidebar(){

    sidebar.classList.add("show");

}

function closeSidebar(){

    sidebar.classList.remove("show");

}

function toggleSidebar(){

    sidebar.classList.toggle("show");

}

/*==============================
    Conversation
==============================*/

let conversations=[];

let currentConversationId=null;

/*==============================
    Generate ID
==============================*/

function conversationID(){

    return crypto.randomUUID();

}

/*==============================
    Create Conversation
==============================*/

function createConversation(title="New Chat"){

    const data={

        id:conversationID(),

        title,

        created:new Date().toISOString(),

        updated:new Date().toISOString(),

        messages:[]

    };

    conversations.unshift(data);

    currentConversationId=data.id;

    saveSidebar();

    renderSidebar();

    return data;

}

/*==============================
    Current Conversation
==============================*/

function currentConversation(){

    return conversations.find(

        item=>item.id===currentConversationId

    );

}

/*==============================
    Rename
==============================*/

function renameConversation(

id,

title

){

    const chat=

    conversations.find(

        item=>item.id===id

    );

    if(!chat){

        return;

    }

    chat.title=title;

    chat.updated=new Date().toISOString();

    saveSidebar();

    renderSidebar();

}

/*==============================
    Delete
==============================*/

function deleteConversation(id){

    conversations=

    conversations.filter(

        item=>item.id!==id

    );

    if(currentConversationId===id){

        currentConversationId=null;

    }

    saveSidebar();

    renderSidebar();

}
/*==============================
    Render Sidebar
==============================*/

function renderSidebar(){

    if(!historyList){

        return;

    }

    historyList.innerHTML="";

    conversations.forEach(chat=>{

        const item=document.createElement("div");

        item.className="historyItem";

        if(chat.id===currentConversationId){

            item.classList.add("active");

        }

        item.dataset.id=chat.id;

        item.innerHTML=`

            <div class="historyTitle">

                ${chat.title}

            </div>

            <div class="historyDate">

                ${new Date(chat.updated).toLocaleString()}

            </div>

        `;

        historyList.appendChild(item);

    });

}

/*==============================
    Search
==============================*/

function filterConversation(keyword){

    const value=keyword.toLowerCase();

    document

    .querySelectorAll(".historyItem")

    .forEach(item=>{

        const text=

        item.innerText.toLowerCase();

        item.style.display=

        text.includes(value)

        ?

        ""

        :

        "none";

    });

}

/*==============================
    Switch Conversation
==============================*/

function switchConversation(id){

    const chat=

    conversations.find(

        item=>item.id===id

    );

    if(!chat){

        return;

    }

    currentConversationId=id;

    conversation=[...chat.messages];

    messages.innerHTML="";

    conversation.forEach(msg=>{

        createMessage(

            msg.role,

            msg.content

        );

    });

    renderSidebar();

}

/*==============================
    Save
==============================*/

function saveSidebar(){

    localStorage.setItem(

        "cheem_sidebar",

        JSON.stringify({

            currentConversationId,

            conversations

        })

    );

}

/*==============================
    Load
==============================*/

function loadSidebar(){

    const cache=

    localStorage.getItem(

        "cheem_sidebar"

    );

    if(!cache){

        createConversation();

        return;

    }

    const data=

    JSON.parse(cache);

    conversations=

    data.conversations||[];

    currentConversationId=

    data.currentConversationId;

    renderSidebar();

}

/*==============================
    Update Current
==============================*/

function updateCurrentConversation(){

    const chat=

    currentConversation();

    if(!chat){

        return;

    }

    chat.messages=[...conversation];

    chat.updated=

    new Date().toISOString();

    if(

        conversation.length>0

        &&

        chat.title==="New Chat"

    ){

        chat.title=

        conversation[0]

        .content

        .slice(0,30);

    }

    saveSidebar();

    renderSidebar();

}
/*==============================
    Event Listener
==============================*/

historyList?.addEventListener(

"click",

(event)=>{

    const item=

    event.target.closest(".historyItem");

    if(!item){

        return;

    }

    switchConversation(

        item.dataset.id

    );

});

newChatBtn?.addEventListener(

"click",

()=>{

    conversation=[];

    messages.innerHTML="";

    createConversation();

});

searchHistory?.addEventListener(

"input",

(event)=>{

    filterConversation(

        event.target.value

    );

});

/*==============================
    Context Menu
==============================*/

historyList?.addEventListener(

"contextmenu",

(event)=>{

    event.preventDefault();

    const item=

    event.target.closest(".historyItem");

    if(!item){

        return;

    }

    const id=item.dataset.id;

    const action=prompt(

        "rename / delete"

    );

    if(!action){

        return;

    }

    if(

        action.toLowerCase()==="rename"

    ){

        const title=prompt(

            "New title"

        );

        if(title){

            renameConversation(

                id,

                title

            );

        }

    }

    if(

        action.toLowerCase()==="delete"

    ){

        if(

            confirm(

                "Delete this conversation?"

            )

        ){

            deleteConversation(id);

        }

    }

});

/*==============================
    Auto Save
==============================*/

setInterval(

()=>{

    updateCurrentConversation();

},

5000

);

window.addEventListener(

"beforeunload",

updateCurrentConversation

);

/*==============================
    Mobile
==============================*/

sidebarToggle?.addEventListener(

"click",

toggleSidebar

);

sidebarClose?.addEventListener(

"click",

closeSidebar

);

document.addEventListener(

"click",

(event)=>{

    if(

        window.innerWidth>768

    ){

        return;

    }

    if(

        !sidebar.contains(event.target)

        &&

        !event.target.closest(

            "#toggleSidebar"

        )

    ){

        closeSidebar();

    }

});

/*==============================
    Initialize
==============================*/

function initSidebar(){

    loadSidebar();

    if(

        conversations.length===0

    ){

        createConversation();

    }

    renderSidebar();

    console.log(

        "%cSidebar Ready",

        "color:#22c55e;font-weight:bold;"

    );

}

document.addEventListener(

"DOMContentLoaded",

initSidebar

);

/*==============================
    Public API
==============================*/

window.CheemSidebar={

    openSidebar,

    closeSidebar,

    toggleSidebar,

    createConversation,

    switchConversation,

    renameConversation,

    deleteConversation,

    updateCurrentConversation,

    saveSidebar,

    loadSidebar

};
