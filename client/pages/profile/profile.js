/*=========================================================
    Cheem Coding
    Profile Manager
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const ProfileConfig={

    storageKey:"cheem_profile",

    avatarKey:"cheem_avatar",

    maxAvatarSize:5*1024*1024

};

/*==============================
    Default Profile
==============================*/

const DefaultProfile={

    username:"",

    email:"",

    bio:"",

    country:"VN",

    language:"vi",

    joined:new Date().toLocaleDateString(),

    accountType:"Free"

};

/*==============================
    State
==============================*/

let UserProfile={

    ...DefaultProfile

};

/*==============================
    DOM
==============================*/

const avatar=

document.getElementById(

    "profileAvatar"

);

const avatarInput=

document.getElementById(

    "avatarInput"

);

const changeAvatar=

document.getElementById(

    "changeAvatar"

);

const saveButton=

document.getElementById(

    "saveProfile"

);

const resetButton=

document.getElementById(

    "resetProfile"

);

/*==============================
    Load Profile
==============================*/

function loadProfile(){

    const cache=

    localStorage.getItem(

        ProfileConfig.storageKey

    );

    if(cache){

        try{

            UserProfile={

                ...DefaultProfile,

                ...JSON.parse(cache)

            };

        }

        catch{

            UserProfile={

                ...DefaultProfile

            };

        }

    }

}

/*==============================
    Save Profile
==============================*/

function saveProfile(){

    localStorage.setItem(

        ProfileConfig.storageKey,

        JSON.stringify(

            UserProfile

        )

    );

}
/*==============================
    Render Profile
==============================*/

function renderProfile(){

    Object.keys(UserProfile).forEach(key=>{

        const element=

        document.getElementById(key);

        if(!element){

            return;

        }

        element.value=

        UserProfile[key];

    });

    const avatarCache=

    localStorage.getItem(

        ProfileConfig.avatarKey

    );

    if(

        avatarCache&&avatar

    ){

        avatar.src=

        avatarCache;

    }

}

/*==============================
    Read Form
==============================*/

function updateProfileFromForm(){

    [

        "username",

        "email",

        "bio",

        "country",

        "language"

    ].forEach(key=>{

        const element=

        document.getElementById(key);

        if(element){

            UserProfile[key]=

            element.value.trim();

        }

    });

}

/*==============================
    Avatar Picker
==============================*/

changeAvatar?.addEventListener(

    "click",

    ()=>avatarInput.click()

);

avatarInput?.addEventListener(

    "change",

    event=>{

        const file=

        event.target.files[0];

        if(!file){

            return;

        }

        if(

            file.size>

            ProfileConfig.maxAvatarSize

        ){

            showToast(

                "Avatar too large.",

                "error"

            );

            return;

        }

        const reader=

        new FileReader();

        reader.onload=()=>{

            avatar.src=

            reader.result;

            localStorage.setItem(

                ProfileConfig.avatarKey,

                reader.result

            );

        };

        reader.readAsDataURL(file);

    }

);

/*==============================
    Reset Profile
==============================*/

function resetProfile(){

    UserProfile={

        ...DefaultProfile

    };

    localStorage.removeItem(

        ProfileConfig.avatarKey

    );

    saveProfile();

    renderProfile();

}

/*==============================
    Validate
==============================*/

function validateProfile(){

    if(

        UserProfile.username

        .length<3

    ){

        showToast(

            "Username is too short.",

            "warning"

        );

        return false;

    }

    if(

        UserProfile.email

        &&

        !UserProfile.email.includes("@")

    ){

        showToast(

            "Invalid email.",

            "warning"

        );

        return false;

    }

    return true;

}

/*==============================
    Save Event
==============================*/

saveButton?.addEventListener(

    "click",

    ()=>{

        updateProfileFromForm();

        if(

            !validateProfile()

        ){

            return;

        }

        saveProfile();

        showToast(

            "Profile saved.",

            "success"

        );

    }

);

resetButton?.addEventListener(

    "click",

    resetProfile

);
/*==============================
    Statistics
==============================*/

function updateStatistics(){

    try{

        const chats=

        JSON.parse(

            localStorage.getItem(

                "cheem_conversation"

            )||"[]"

        );

        let messages=0;

        let tokens=0;

        chats.forEach(chat=>{

            messages+=

            chat.messages?.length||0;

            tokens+=

            chat.tokens||0;

        });

        document.getElementById(

            "totalChats"

        ).textContent=

        chats.length;

        document.getElementById(

            "totalMessages"

        ).textContent=

        messages;

        document.getElementById(

            "totalTokens"

        ).textContent=

        tokens;

    }

    catch{}

    try{

        const uploads=

        JSON.parse(

            localStorage.getItem(

                "cheem_uploads"

            )||"[]"

        );

        document.getElementById(

            "totalFiles"

        ).textContent=

        uploads.length;

    }

    catch{}

}

/*==============================
    Export Profile
==============================*/

function exportProfile(){

    const blob=

    new Blob(

        [

            JSON.stringify(

                UserProfile,

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

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="profile.json";

    a.click();

    URL.revokeObjectURL(url);

}

/*==============================
    Import Profile
==============================*/

function importProfile(file){

    const reader=

    new FileReader();

    reader.onload=()=>{

        try{

            UserProfile={

                ...DefaultProfile,

                ...JSON.parse(

                    reader.result

                )

            };

            saveProfile();

            renderProfile();

            updateStatistics();

        }

        catch(error){

            console.error(error);

        }

    };

    reader.readAsText(file);

}

/*==============================
    Sync
==============================*/

function syncModules(){

    if(

        window.CheemSettings

    ){

        CheemSettings.setSetting(

            "language",

            UserProfile.language

        );

    }

}

/*==============================
    Initialize
==============================*/

function initProfile(){

    loadProfile();

    renderProfile();

    updateStatistics();

    syncModules();

    console.log(

        "%cProfile Ready",

        "color:#06b6d4;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initProfile

);

/*==============================
    Public API
==============================*/

window.CheemProfile={

    loadProfile,

    saveProfile,

    renderProfile,

    updateProfileFromForm,

    resetProfile,

    validateProfile,

    updateStatistics,

    exportProfile,

    importProfile

};
