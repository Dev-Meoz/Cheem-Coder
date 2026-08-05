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
    Read Form
==============================*/

function updateSettingsFromForm(){

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

            Settings[key]=

            element.checked;

        }

        else if(

            element.type===

            "range"

        ){

            Settings[key]=

            Number(

                element.value

            );

        }

        else{

            Settings[key]=

            element.value;

        }

    });

}

/*==============================
    Apply Theme
==============================*/

function applyTheme(){

    if(

        window.CheemTheme

    ){

        CheemTheme.setTheme(

            Settings.theme

        );

    }

}

/*==============================
    Apply Font
==============================*/

function applyFontSize(){

    document.documentElement

    .style.fontSize=

    Settings.fontSize+

    "px";

}

/*==============================
    Reset
==============================*/

function resetSettings(){

    Settings={

        ...DefaultSettings

    };

    renderSettings();

    saveSettings();

    applyTheme();

    applyFontSize();

}

/*==============================
    Export
==============================*/

function exportSettings(){

    const blob=

    new Blob(

        [

            JSON.stringify(

                Settings,

                null,

                2

            )

        ],

        {

            type:

            "application/json"

        }

    );

    const url=

    URL.createObjectURL(

        blob

    );

    const link=

    document.createElement(

        "a"

    );

    link.href=url;

    link.download=

    "settings.json";

    link.click();

    URL.revokeObjectURL(

        url

    );

}

/*==============================
    Import
==============================*/

function importSettings(file){

    const reader=

    new FileReader();

    reader.onload=()=>{

        try{

            Settings={

                ...DefaultSettings,

                ...JSON.parse(

                    reader.result

                )

            };

            saveSettings();

            renderSettings();

            applyTheme();

            applyFontSize();

            showToast(

                "Settings imported.",

                "success"

            );

        }

        catch{

            showToast(

                "Import failed.",

                "error"

            );

        }

    };

    reader.readAsText(file);

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
