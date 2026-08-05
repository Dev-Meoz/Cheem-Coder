/*=========================================================
    Cheem Coding
    History Manager
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const HistoryConfig={

    storageKey:"cheem_history",

    maxHistory:500,

    autoSave:true,

    autoLoad:true

};

/*==============================
    State
==============================*/

let historyDatabase=[];

/*==============================
    Create History
==============================*/

function createHistory(

title="New Chat"

){

    const history={

        id:crypto.randomUUID(),

        title,

        created:new Date().toISOString(),

        updated:new Date().toISOString(),

        favorite:false,

        archived:false,

        pinned:false,

        messages:[]

    };

    historyDatabase.unshift(history);

    saveHistory();

    return history;

}

/*==============================
    Get History
==============================*/

function getHistory(id){

    return historyDatabase.find(

        item=>item.id===id

    );

}

/*==============================
    Current
==============================*/

function getCurrentHistory(){

    if(

        !window.currentConversationId

    ){

        return null;

    }

    return getHistory(

        window.currentConversationId

    );

}

/*==============================
    Add Message
==============================*/

function addHistoryMessage(

role,

content

){

    const history=

    getCurrentHistory();

    if(!history){

        return;

    }

    history.messages.push({

        id:crypto.randomUUID(),

        role,

        content,

        time:new Date().toISOString()

    });

    history.updated=

    new Date().toISOString();

}

/*==============================
    Rename
==============================*/

function renameHistory(

id,

title

){

    const history=

    getHistory(id);

    if(!history){

        return;

    }

    history.title=title;

    history.updated=

    new Date().toISOString();

    saveHistory();

}

/*==============================
    Delete
==============================*/

function deleteHistory(id){

    historyDatabase=

    historyDatabase.filter(

        item=>item.id!==id

    );

    saveHistory();

}
/*==============================
    Favorite
==============================*/

function favoriteHistory(id){

    const history=

    getHistory(id);

    if(!history){

        return;

    }

    history.favorite=

    !history.favorite;

    history.updated=

    new Date().toISOString();

    saveHistory();

}

/*==============================
    Pin
==============================*/

function pinHistory(id){

    const history=

    getHistory(id);

    if(!history){

        return;

    }

    history.pinned=

    !history.pinned;

    history.updated=

    new Date().toISOString();

    saveHistory();

}

/*==============================
    Archive
==============================*/

function archiveHistory(id){

    const history=

    getHistory(id);

    if(!history){

        return;

    }

    history.archived=true;

    history.updated=

    new Date().toISOString();

    saveHistory();

}

/*==============================
    Restore
==============================*/

function restoreHistory(id){

    const history=

    getHistory(id);

    if(!history){

        return;

    }

    history.archived=false;

    history.updated=

    new Date().toISOString();

    saveHistory();

}

/*==============================
    Search
==============================*/

function searchHistory(keyword){

    keyword=

    keyword.toLowerCase();

    return historyDatabase.filter(

        history=>{

            return(

                history.title

                .toLowerCase()

                .includes(keyword)

            );

        }

    );

}

/*==============================
    Sort
==============================*/

function sortHistory(){

    historyDatabase.sort(

        (a,b)=>{

            if(

                a.pinned!==b.pinned

            ){

                return b.pinned-a.pinned;

            }

            return(

                new Date(b.updated)

                -

                new Date(a.updated)

            );

        }

    );

}

/*==============================
    Save
==============================*/

function saveHistory(){

    if(

        !HistoryConfig.autoSave

    ){

        return;

    }

    localStorage.setItem(

        HistoryConfig.storageKey,

        JSON.stringify(

            historyDatabase

        )

    );

}

/*==============================
    Load
==============================*/

function loadHistory(){

    if(

        !HistoryConfig.autoLoad

    ){

        return;

    }

    const cache=

    localStorage.getItem(

        HistoryConfig.storageKey

    );

    if(!cache){

        historyDatabase=[];

        return;

    }

    try{

        historyDatabase=

        JSON.parse(cache);

    }

    catch{

        historyDatabase=[];

    }

}

/*==============================
    Export
==============================*/

function exportHistory(){

    const blob=

    new Blob(

        [

            JSON.stringify(

                historyDatabase,

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

    a.download="history.json";

    a.click();

    URL.revokeObjectURL(url);

}

/*==============================
    Import
==============================*/

function importHistory(file){

    const reader=

    new FileReader();

    reader.onload=()=>{

        try{

            historyDatabase=

            JSON.parse(

                reader.result

            );

            saveHistory();

        }

        catch(error){

            console.error(error);

        }

    };

    reader.readAsText(file);

}
/*==============================
    Auto Backup
==============================*/

function backupHistory(){

    localStorage.setItem(

        "cheem_history_backup",

        JSON.stringify(historyDatabase)

    );

}

setInterval(

    backupHistory,

    60000

);

/*==============================
    Clear History
==============================*/

function clearHistory(){

    if(

        !confirm(

            "Clear all history?"

        )

    ){

        return;

    }

    historyDatabase=[];

    saveHistory();

    if(

        typeof renderSidebar==="function"

    ){

        renderSidebar();

    }

}

/*==============================
    Statistics
==============================*/

function historyStats(){

    let totalMessages=0;

    let favorite=0;

    let archived=0;

    let pinned=0;

    historyDatabase.forEach(history=>{

        totalMessages+=

        history.messages.length;

        if(history.favorite) favorite++;

        if(history.archived) archived++;

        if(history.pinned) pinned++;

    });

    return{

        conversations:

        historyDatabase.length,

        messages:

        totalMessages,

        favorite,

        archived,

        pinned

    };

}

/*==============================
    Sidebar Sync
==============================*/

function syncSidebar(){

    if(

        typeof renderSidebar

        ===

        "function"

    ){

        renderSidebar();

    }

}

/*==============================
    Auto Save
==============================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        saveHistory();

        backupHistory();

    }

);

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(

            document.hidden

        ){

            saveHistory();

        }

    }

);

/*==============================
    Initialize
==============================*/

function initHistory(){

    loadHistory();

    sortHistory();

    syncSidebar();

    console.log(

        "%cHistory Ready",

        "color:#06b6d4;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initHistory

);

/*==============================
    Public API
==============================*/

window.CheemHistory={

    createHistory,

    getHistory,

    getCurrentHistory,

    addHistoryMessage,

    renameHistory,

    deleteHistory,

    favoriteHistory,

    pinHistory,

    archiveHistory,

    restoreHistory,

    searchHistory,

    sortHistory,

    saveHistory,

    loadHistory,

    exportHistory,

    importHistory,

    clearHistory,

    historyStats,

    backupHistory,

    syncSidebar

};
