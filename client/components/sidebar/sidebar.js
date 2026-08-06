/*
=========================================================
    Cheem Coding Sidebar Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Sidebar={

    collapsed:false,

    mobile:false,

    conversations:[],

    currentConversation:null

};



/*==============================
    Elements
==============================*/

const SidebarElement={

    root:null,

    overlay:null,

    list:null,

    search:null,

    loading:null,

    empty:null

};



/*==============================
    Initialize Elements
==============================*/

function initSidebarElements(){

    SidebarElement.root=

    document.getElementById(

        "cheemSidebar"

    );


    SidebarElement.overlay=

    document.getElementById(

        "sidebarOverlay"

    );


    SidebarElement.list=

    document.getElementById(

        "conversationList"

    );


    SidebarElement.search=

    document.getElementById(

        "sidebarSearchInput"

    );


    SidebarElement.loading=

    document.getElementById(

        "sidebarLoading"

    );


    SidebarElement.empty=

    document.getElementById(

        "sidebarEmpty"

    );

}



/*==============================
    Loading
==============================*/

function showSidebarLoading(){

    SidebarElement.loading

    ?.classList.add(

        "active"

    );

}


function hideSidebarLoading(){

    SidebarElement.loading

    ?.classList.remove(

        "active"

    );

}



/*==============================
    Sidebar
==============================*/

function toggleSidebar(){

    SidebarElement.root

    ?.classList.toggle(

        "active"

    );


    SidebarElement.overlay

    ?.classList.toggle(

        "active"

    );

}



/*==============================
    Collapse
==============================*/

function collapseSidebar(){

    Sidebar.collapsed=

    !Sidebar.collapsed;


    SidebarElement.root

    ?.classList.toggle(

        "collapsed",

        Sidebar.collapsed

    );

}



/*==============================
    Conversation
==============================*/

function loadConversationHistory(){

    Sidebar.conversations=

    JSON.parse(

        localStorage.getItem(

            "cheem_history"

        )||"[]"

    );


    renderConversationList();

}
/*==============================
    Render Conversations
==============================*/

function renderConversationList(){

    if(

        !SidebarElement.list

    ){

        return;

    }


    SidebarElement.list.innerHTML="";


    if(

        Sidebar.conversations.length===0

    ){

        SidebarElement.empty

        ?.classList.add(

            "active"

        );

        return;

    }


    SidebarElement.empty

    ?.classList.remove(

        "active"

    );


    Sidebar.conversations

    .forEach(

        conversation=>{


            const item=

            document.createElement(

                "div"

            );


            item.className=

            "conversation-item";


            item.dataset.id=

            conversation.id;


            item.innerHTML=`

                <div class="conversation-icon">

                    💬

                </div>

                <div class="conversation-info">

                    <span class="conversation-title">

                        ${conversation.title}

                    </span>

                    <small class="conversation-time">

                        ${conversation.time||""}

                    </small>

                </div>

                <button class="conversation-menu">

                    ⋮

                </button>

            `;


            item.addEventListener(

                "click",

                ()=>{

                    openConversation(

                        conversation.id

                    );

                }

            );


            SidebarElement.list

            .appendChild(

                item

            );

        }

    );

}



/*==============================
    Open Conversation
==============================*/

function openConversation(id){

    Sidebar.currentConversation=

    id;


    if(

        window.CheemConversation

    ){

        CheemConversation.open(

            id

        );

    }

}



/*==============================
    Delete Conversation
==============================*/

function deleteConversation(id){

    Sidebar.conversations=

    Sidebar.conversations.filter(

        item=>

        item.id!==id

    );


    localStorage.setItem(

        "cheem_history",

        JSON.stringify(

            Sidebar.conversations

        )

    );


    renderConversationList();

}



/*==============================
    Search
==============================*/

function searchConversation(){

    const keyword=

    SidebarElement.search

    ?.value

    .toLowerCase()

    .trim();


    document

    .querySelectorAll(

        ".conversation-item"

    )

    .forEach(

        item=>{

            const title=

            item

            .querySelector(

                ".conversation-title"

            )

            .textContent

            .toLowerCase();


            item.style.display=

            title.includes(

                keyword

            )

            ?

            ""

            :

            "none";

        }

    );

}
/*==============================
    User
==============================*/

function loadSidebarUser(){

    const user=

    JSON.parse(

        localStorage.getItem(

            "cheem_user"

        )||"{}"

    );


    const avatar=

    document.getElementById(

        "sidebarAvatar"

    );


    const username=

    document.getElementById(

        "sidebarUsername"

    );


    const plan=

    document.getElementById(

        "sidebarPlan"

    );


    if(

        avatar&&user.avatar

    ){

        avatar.src=

        user.avatar;

    }


    if(username){

        username.textContent=

        user.username||

        "User";

    }


    if(plan){

        plan.textContent=

        user.plan||

        "Free";

    }

}



/*==============================
    Events
==============================*/

function initSidebarEvents(){

    document

    .getElementById(

        "sidebarCollapse"

    )

    ?.addEventListener(

        "click",

        collapseSidebar

    );


    document

    .getElementById(

        "sidebarNewChat"

    )

    ?.addEventListener(

        "click",

        ()=>{

            if(

                window.CheemConversation

            ){

                CheemConversation.new();

            }

        }

    );


    SidebarElement.search

    ?.addEventListener(

        "input",

        searchConversation

    );


    SidebarElement.overlay

    ?.addEventListener(

        "click",

        toggleSidebar

    );

}



/*==============================
    Keyboard Shortcut
==============================*/

document.addEventListener(

    "keydown",

    event=>{

        if(

            event.ctrlKey

            &&

            event.key.toLowerCase()==="b"

        ){

            event.preventDefault();

            toggleSidebar();

        }

    }

);



/*==============================
    Initialize
==============================*/

function initSidebar(){

    initSidebarElements();

    initSidebarEvents();

    loadSidebarUser();

    loadConversationHistory();


    console.log(

        "%cSidebar Loaded",

        "color:#8b5cf6;font-weight:bold;"

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

    init:initSidebar,

    toggle:toggleSidebar,

    collapse:collapseSidebar,

    reload:loadConversationHistory,

    render:renderConversationList,

    showLoading:showSidebarLoading,

    hideLoading:hideSidebarLoading,

    openConversation,

    deleteConversation

};
