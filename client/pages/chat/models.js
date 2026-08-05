/*=========================================================
    Cheem Coding
    Model Manager
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const ModelConfig={

    endpoint:"/api/models",

    defaultModel:"gpt-5.5",

    autoLoad:true,

    remember:true

};

/*==============================
    DOM
==============================*/

const modelSelect=

document.getElementById(

    "modelSelect"

);

const refreshModelButton=

document.getElementById(

    "refreshModels"

);

/*==============================
    State
==============================*/

let Models=[];

let CurrentModel=

ModelConfig.defaultModel;

/*==============================
    Model Object
==============================*/

class AIModel{

    constructor(data){

        this.id=data.id;

        this.name=data.name;

        this.provider=data.provider;

        this.description=

        data.description||"";

        this.context=

        data.context||0;

        this.vision=

        !!data.vision;

        this.reasoning=

        !!data.reasoning;

        this.coding=

        !!data.coding;

        this.embedding=

        !!data.embedding;

        this.enabled=

        data.enabled!==false;

    }

}

/*==============================
    Load API
==============================*/

async function loadModels(){

    try{

        const response=

        await fetch(

            ModelConfig.endpoint

        );

        const data=

        await response.json();

        Models=

        data.models.map(

            item=>

            new AIModel(item)

        );

        renderModels();

    }

    catch(error){

        console.error(error);

    }

}

/*==============================
    Render
==============================*/

function renderModels(){

    if(

        !modelSelect

    ){

        return;

    }

    modelSelect.innerHTML="";

    Models.forEach(model=>{

        if(

            !model.enabled

        ){

            return;

        }

        const option=

        document.createElement(

            "option"

        );

        option.value=model.id;

        option.textContent=

        `${model.name} · ${model.provider}`;

        if(

            model.id===CurrentModel

        ){

            option.selected=true;

        }

        modelSelect.appendChild(

            option

        );

    });

}

/*==============================
    Current Model
==============================*/

function getCurrentModel(){

    return Models.find(

        model=>

        model.id===CurrentModel

    );

}
/*==============================
    Select Model
==============================*/

function selectModel(id){

    const model=

    Models.find(

        item=>item.id===id

    );

    if(!model){

        return;

    }

    CurrentModel=id;

    if(

        ModelConfig.remember

    ){

        localStorage.setItem(

            "cheem_model",

            id

        );

    }

    renderModels();

    updateModelInfo();

}

/*==============================
    Restore Model
==============================*/

function restoreModel(){

    const cache=

    localStorage.getItem(

        "cheem_model"

    );

    if(cache){

        CurrentModel=cache;

    }

}

/*==============================
    Search
==============================*/

function searchModels(keyword){

    keyword=

    keyword.toLowerCase();

    return Models.filter(model=>{

        return(

            model.name

            .toLowerCase()

            .includes(keyword)

            ||

            model.provider

            .toLowerCase()

            .includes(keyword)

        );

    });

}

/*==============================
    Favorite
==============================*/

function favoriteModel(id){

    const favorites=

    JSON.parse(

        localStorage.getItem(

            "cheem_favorite_models"

        )||"[]"

    );

    if(

        favorites.includes(id)

    ){

        favorites.splice(

            favorites.indexOf(id),

            1

        );

    }

    else{

        favorites.push(id);

    }

    localStorage.setItem(

        "cheem_favorite_models",

        JSON.stringify(

            favorites

        )

    );

}

/*==============================
    Favorite Check
==============================*/

function isFavorite(id){

    return JSON.parse(

        localStorage.getItem(

            "cheem_favorite_models"

        )||"[]"

    ).includes(id);

}

/*==============================
    Update Info
==============================*/

function updateModelInfo(){

    const model=

    getCurrentModel();

    if(!model){

        return;

    }

    const info=

    document.getElementById(

        "modelInfo"

    );

    if(!info){

        return;

    }

    info.innerHTML=`

        <div>

            <b>${model.name}</b>

        </div>

        <div>

            Provider :

            ${model.provider}

        </div>

        <div>

            Context :

            ${model.context}

        </div>

        <div>

            Vision :

            ${model.vision?"✅":"❌"}

        </div>

        <div>

            Reasoning :

            ${model.reasoning?"✅":"❌"}

        </div>

        <div>

            Coding :

            ${model.coding?"✅":"❌"}

        </div>

    `;

}

/*==============================
    Events
==============================*/

modelSelect?.addEventListener(

"change",

event=>{

    selectModel(

        event.target.value

    );

});

refreshModelButton?.addEventListener(

"click",

loadModels

);
/*==============================
    Provider Groups
==============================*/

function groupModels(){

    const groups={};

    Models.forEach(model=>{

        if(

            !groups[model.provider]

        ){

            groups[model.provider]=[];

        }

        groups[model.provider]

        .push(model);

    });

    return groups;

}

/*==============================
    Capability Filter
==============================*/

function filterModels(capability){

    return Models.filter(model=>{

        switch(capability){

            case"vision":

                return model.vision;

            case"reasoning":

                return model.reasoning;

            case"coding":

                return model.coding;

            case"embedding":

                return model.embedding;

            default:

                return true;

        }

    });

}

/*==============================
    Sync Settings
==============================*/

function syncSettings(){

    if(

        window.CheemSettings

    ){

        const saved=

        CheemSettings.getSetting(

            "model"

        );

        if(saved){

            CurrentModel=saved;

        }

    }

}

/*==============================
    Sync Chat
==============================*/

function syncChat(){

    if(

        window.ChatConfig

    ){

        ChatConfig.model=

        CurrentModel;

    }

}

/*==============================
    Model Count
==============================*/

function modelStatistics(){

    return{

        total:

        Models.length,

        enabled:

        Models.filter(

            item=>item.enabled

        ).length,

        coding:

        Models.filter(

            item=>item.coding

        ).length,

        reasoning:

        Models.filter(

            item=>item.reasoning

        ).length,

        vision:

        Models.filter(

            item=>item.vision

        ).length

    };

}

/*==============================
    Initialize
==============================*/

async function initModels(){

    restoreModel();

    syncSettings();

    if(

        ModelConfig.autoLoad

    ){

        await loadModels();

    }

    updateModelInfo();

    syncChat();

    console.log(

        "%cModels Ready",

        "color:#10b981;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initModels

);

/*==============================
    Public API
==============================*/

window.CheemModels={

    loadModels,

    renderModels,

    selectModel,

    restoreModel,

    getCurrentModel,

    searchModels,

    favoriteModel,

    isFavorite,

    filterModels,

    groupModels,

    modelStatistics,

    updateModelInfo

};
