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

    temperature:0.7,

    maxTokens:4096,

    stream:true,

    markdown:true,

    codeHighlight:true,

    mermaid:true,

    math:false,

    watermark:true,

    autoSave:true,

    sound:true,

    notification:true,

    enterToSend:true,

    sidebar:true,

    fontSize:15,

    fontFamily:"Inter",

    lineWrap:true

};

/*==============================
    State
==============================*/

let UserSettings={

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

    if(!cache){

        saveSettings();

        return;

    }

    try{

        UserSettings={

            ...DefaultSettings,

            ...JSON.parse(cache)

        };

    }

    catch{

        UserSettings={

            ...DefaultSettings

        };

    }

}

/*==============================
    Save
==============================*/

function saveSettings(){

    localStorage.setItem(

        SettingsConfig.storageKey,

        JSON.stringify(

            UserSettings

        )

    );

}

/*==============================
    Get
==============================*/

function getSetting(key){

    return UserSettings[key];

}

/*==============================
    Set
==============================*/

function setSetting(

key,

value

){

    UserSettings[key]=value;

    saveSettings();

}

/*==============================
    Reset
==============================*/

function resetSettings(){

    UserSettings={

        ...DefaultSettings

    };

    saveSettings();

}
/*==============================
    Apply Theme
==============================*/

function applyTheme(){

    document.documentElement

    .setAttribute(

        "data-theme",

        getSetting("theme")

    );

}

/*==============================
    Apply Font
==============================*/

function applyFont(){

    document.documentElement

    .style.fontSize=

    getSetting("fontSize")+"px";

    document.documentElement

    .style.fontFamily=

    getSetting("fontFamily");

}

/*==============================
    Markdown
==============================*/

function applyMarkdown(){

    if(window.MarkdownConfig){

        MarkdownConfig.markdown=

        getSetting("markdown");

        MarkdownConfig.highlight=

        getSetting(

            "codeHighlight"

        );

        MarkdownConfig.mermaid=

        getSetting("mermaid");

        MarkdownConfig.math=

        getSetting("math");

    }

}

/*==============================
    Stream
==============================*/

function applyStream(){

    if(

        window.StreamConfig

    ){

        StreamConfig.enabled=

        getSetting("stream");

    }

}

/*==============================
    Watermark
==============================*/

function applyWatermark(){

    window.CheemWatermark=

    getSetting(

        "watermark"

    );

}

/*==============================
    Notification
==============================*/

function applyNotification(){

    window.CheemNotification=

    getSetting(

        "notification"

    );

}

/*==============================
    Sound
==============================*/

function applySound(){

    window.CheemSound=

    getSetting(

        "sound"

    );

}

/*==============================
    Sidebar
==============================*/

function applySidebar(){

    const sidebar=

    document.querySelector(

        ".sidebar"

    );

    if(!sidebar){

        return;

    }

    sidebar.style.display=

    getSetting(

        "sidebar"

    )

    ?

    ""

    :

    "none";

}

/*==============================
    Enter Send
==============================*/

function applyEnterSend(){

    window.EnterToSend=

    getSetting(

        "enterToSend"

    );

}

/*==============================
    Apply All
==============================*/

function applySettings(){

    applyTheme();

    applyFont();

    applyMarkdown();

    applyStream();

    applyWatermark();

    applyNotification();

    applySound();

    applySidebar();

    applyEnterSend();

}
/*==============================
    Export Settings
==============================*/

function exportSettings(){

    const blob=new Blob(

        [

            JSON.stringify(

                UserSettings,

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

    a.download="settings.json";

    a.click();

    URL.revokeObjectURL(url);

}

/*==============================
    Import Settings
==============================*/

function importSettings(file){

    const reader=

    new FileReader();

    reader.onload=()=>{

        try{

            UserSettings={

                ...DefaultSettings,

                ...JSON.parse(

                    reader.result

                )

            };

            saveSettings();

            applySettings();

        }

        catch(error){

            console.error(error);

        }

    };

    reader.readAsText(file);

}

/*==============================
    Reset UI
==============================*/

function resetSettingUI(){

    document

    .querySelectorAll(

        "[data-setting]"

    )

    .forEach(element=>{

        const key=

        element.dataset.setting;

        const value=

        getSetting(key);

        if(

            element.type==="checkbox"

        ){

            element.checked=value;

        }

        else{

            element.value=value;

        }

    });

}

/*==============================
    Setting Listener
==============================*/

document.addEventListener(

"change",

event=>{

    const target=

    event.target;

    if(

        !target.dataset.setting

    ){

        return;

    }

    let value=

    target.value;

    if(

        target.type==="checkbox"

    ){

        value=

        target.checked;

    }

    if(

        target.type==="number"

    ){

        value=

        Number(value);

    }

    setSetting(

        target.dataset.setting,

        value

    );

    applySettings();

});

/*==============================
    Auto Save
==============================*/

window.addEventListener(

"beforeunload",

saveSettings

);

/*==============================
    Initialize
==============================*/

function initSettings(){

    loadSettings();

    applySettings();

    resetSettingUI();

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

window.CheemSettings={

    getSetting,

    setSetting,

    saveSettings,

    loadSettings,

    resetSettings,

    applySettings,

    exportSettings,

    importSettings,

    applyTheme,

    applyFont,

    applyMarkdown,

    applyStream,

    applyWatermark,

    applyNotification,

    applySound,

    applySidebar,

    applyEnterSend

};
