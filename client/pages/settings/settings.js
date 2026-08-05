/*=========================================================
    Cheem Coding
    Settings Manager
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const SettingsConfig={

    storageKey:"cheem_settings"

};

/*==============================
    Default Settings
==============================*/

const DefaultSettings={

    theme:"dark",

    language:"vi",

    model:"gpt-5.5",

    markdown:true,

    stream:true,

    watermark:true,

    notification:true,

    sound:true,

    autoSave:true,

    fontSize:15

};

/*==============================
    State
==============================*/

let Settings={

    ...DefaultSettings

};

/*==============================
    Load
==============================*/

function loadSettings(){

    const cache=

    localStorage.getItem(

        SettingsConfig.storageKey

    );

    if(cache){

        try{

            Settings={

                ...DefaultSettings,

                ...JSON.parse(cache)

            };

        }

        catch{

            Settings={

                ...DefaultSettings

            };

        }

    }

}

/*==============================
    Save
==============================*/

function saveSettings(){

    localStorage.setItem(

        SettingsConfig.storageKey,

        JSON.stringify(

            Settings

        )

    );

}

/*==============================
    Render
==============================*/

function renderSettings(){

    Object.keys(Settings)

    .forEach(key=>{

        const element=

        document.getElementById(

            key

        );

        if(!element){

            return;

        }

        if(

            element.type===

            "checkbox"

        ){

            element.checked=

            Settings[key];

        }

        else{

            element.value=

            Settings[key];

        }

    });

}
/*==============================
    Events
==============================*/

document.getElementById(

    "saveSettings"

)?.addEventListener(

    "click",

    ()=>{

        updateSettingsFromForm();

        saveSettings();

        applyTheme();

        applyFontSize();

        showToast(

            "Settings saved.",

            "success"

        );

    }

);

document.getElementById(

    "resetSettings"

)?.addEventListener(

    "click",

    resetSettings

);

document.getElementById(

    "exportSettings"

)?.addEventListener(

    "click",

    exportSettings

);

document.getElementById(

    "importSettings"

)?.addEventListener(

    "click",

    ()=>{

        document

        .getElementById(

            "importFile"

        )

        ?.click();

    }

);

document.getElementById(

    "importFile"

)?.addEventListener(

    "change",

    event=>{

        const file=

        event.target.files[0];

        if(file){

            importSettings(file);

        }

    }

);

/*==============================
    Auto Save
==============================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        if(

            Settings.autoSave

        ){

            updateSettingsFromForm();

            saveSettings();

        }

    }

);

/*==============================
    Sync
==============================*/

function syncModules(){

    if(

        window.CheemSettings

    ){

        Object.keys(Settings)

        .forEach(key=>{

            CheemSettings.setSetting(

                key,

                Settings[key]

            );

        });

    }

}

/*==============================
    Initialize
==============================*/

function initSettings(){

    loadSettings();

    renderSettings();

    applyTheme();

    applyFontSize();

    syncModules();

    console.log(

        "%cSettings Ready",

        "color:#8b5cf6;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initSettings

);

/*==============================
    Public API
==============================*/

window.CheemPageSettings={

    loadSettings,

    saveSettings,

    renderSettings,

    updateSettingsFromForm,

    resetSettings,

    exportSettings,

    importSettings,

    applyTheme,

    applyFontSize,

    syncModules

};
