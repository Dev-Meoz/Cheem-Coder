/*
=========================================================
    Cheem Coding Navbar Controller
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    Elements
==============================*/


const Navbar={

    searchPanel:null,

    modelDropdown:null,

    userDropdown:null,

    notificationPanel:null,

    loading:null

};



/*==============================
    Init Elements
==============================*/


function initNavbarElements(){

    Navbar.searchPanel=

    document.getElementById(

        "searchPanel"

    );


    Navbar.modelDropdown=

    document.getElementById(

        "modelDropdown"

    );


    Navbar.userDropdown=

    document.getElementById(

        "userDropdown"

    );


    Navbar.notificationPanel=

    document.getElementById(

        "notificationPanel"

    );


    Navbar.loading=

    document.getElementById(

        "navbarLoading"

    );

}



/*==============================
    Toggle Helper
==============================*/


function closeAllPanels(){

    document

    .querySelectorAll(

        ".active"

    )

    .forEach(

        element=>{

            if(

                element.classList.contains(

                    "navbar-search-panel"

                )

                ||

                element.classList.contains(

                    "model-dropdown"

                )

                ||

                element.classList.contains(

                    "user-dropdown"

                )

                ||

                element.classList.contains(

                    "notification-panel"

                )

            ){

                element.classList.remove(

                    "active"

                );

            }

        }

    );

}



/*==============================
    Search
==============================*/


function toggleSearch(){

    closeAllPanels();


    Navbar.searchPanel

    ?.classList.toggle(

        "active"

    );

}



/*==============================
    Model
==============================*/


function toggleModel(){

    closeAllPanels();


    Navbar.modelDropdown

    ?.classList.toggle(

        "active"

    );

}



/*==============================
    User Menu
==============================*/


function toggleUser(){

    closeAllPanels();


    Navbar.userDropdown

    ?.classList.toggle(

        "active"

    );

}



/*==============================
    Notification
==============================*/


function toggleNotification(){

    closeAllPanels();


    Navbar.notificationPanel

    ?.classList.toggle(

        "active"

    );

}
/*==============================
    Theme Toggle
==============================*/

function toggleTheme(){

    if(window.CheemTheme){

        const current=

        localStorage.getItem(

            "cheem_theme"

        )||"dark";


        const next=

        current==="dark"

        ?

        "light"

        :

        "dark";


        CheemTheme.setTheme(

            next

        );

    }

}



/*==============================
    Model Selection
==============================*/

function selectModel(model){

    localStorage.setItem(

        "cheem_model",

        model

    );


    if(window.CheemModels){

        CheemModels.change(

            model

        );

    }


    closeAllPanels();


    if(window.showToast){

        showToast(

            "Model changed: "+model,

            "success"

        );

    }

}



/*==============================
    Search
==============================*/

function searchChat(){

    const input=

    document.getElementById(

        "chatSearchInput"

    );


    const result=

    document.getElementById(

        "searchResults"

    );


    if(!input||!result){

        return;

    }


    const value=

    input.value

    .toLowerCase()

    .trim();


    if(!value){

        result.innerHTML="";

        return;

    }


    const history=

    JSON.parse(

        localStorage.getItem(

            "cheem_history"

        )||"[]"

    );


    const filtered=

    history.filter(

        item=>

        item.title

        ?.toLowerCase()

        .includes(

            value

        )

    );


    result.innerHTML=

    filtered.map(

        item=>`

        <div class="search-item">

            ${item.title}

        </div>

        `

    ).join("");

}



/*==============================
    Navigation
==============================*/

function openProfile(){

    location.href=

    "../../pages/profile/index.html";

}


function openSettings(){

    location.href=

    "../../pages/settings/index.html";

}



/*==============================
    Logout
==============================*/

function logout(){

    localStorage.removeItem(

        "cheem_token"

    );


    localStorage.removeItem(

        "cheem_user"

    );


    location.href=

    "../../pages/auth/login.html";

}



/*==============================
    Loading
==============================*/

function showNavbarLoading(){

    Navbar.loading

    ?.classList.add(

        "active"

    );

}


function hideNavbarLoading(){

    Navbar.loading

    ?.classList.remove(

        "active"

    );

}
/*==============================
    Event Listeners
==============================*/

function initNavbarEvents(){


    document

    .getElementById(

        "searchChat"

    )

    ?.addEventListener(

        "click",

        toggleSearch

    );


    document

    .getElementById(

        "modelSelect"

    )

    ?.addEventListener(

        "click",

        toggleModel

    );


    document

    .getElementById(

        "navbarUser"

    )

    ?.addEventListener(

        "click",

        toggleUser

    );


    document

    .getElementById(

        "notification"

    )

    ?.addEventListener(

        "click",

        toggleNotification

    );


    document

    .getElementById(

        "themeToggle"

    )

    ?.addEventListener(

        "click",

        toggleTheme

    );


    document

    .getElementById(

        "openSettings"

    )

    ?.addEventListener(

        "click",

        openSettings

    );


    document

    .getElementById(

        "profilePage"

    )

    ?.addEventListener(

        "click",

        openProfile

    );


    document

    .getElementById(

        "logoutBtn"

    )

    ?.addEventListener(

        "click",

        logout

    );


    document

    .querySelectorAll(

        ".model-item"

    )

    .forEach(

        button=>{

            button.addEventListener(

                "click",

                ()=>{

                    selectModel(

                        button.dataset.model

                    );

                }

            );

        }

    );


    document

    .getElementById(

        "chatSearchInput"

    )

    ?.addEventListener(

        "input",

        searchChat

    );

}



/*==============================
    Load User Data
==============================*/

function loadNavbarUser(){

    const user=

    JSON.parse(

        localStorage.getItem(

            "cheem_user"

        )||"{}"

    );


    const name=

    document.getElementById(

        "navbarUsername"

    );


    const avatar=

    document.getElementById(

        "navbarAvatar"

    );


    if(name){

        name.textContent=

        user.username

        ||

        "User";

    }


    if(avatar && user.avatar){

        avatar.src=

        user.avatar;

    }

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

            event.key==="k"

        ){

            event.preventDefault();

            toggleSearch();

        }


        if(

            event.ctrlKey

            &&

            event.key==="n"

        ){

            event.preventDefault();


            document

            .getElementById(

                "newChat"

            )

            ?.click();

        }


        if(

            event.ctrlKey

            &&

            event.key===","

        ){

            event.preventDefault();

            openSettings();

        }


    }

);



/*==============================
    Initialize Navbar
==============================*/

function initNavbar(){

    initNavbarElements();

    initNavbarEvents();

    loadNavbarUser();


    console.log(

        "%cNavbar Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    initNavbar

);



/*==============================
    Public API
==============================*/

window.CheemNavbar={

    init:initNavbar,

    toggleSearch,

    toggleModel,

    toggleUser,

    toggleNotification,

    showLoading:showNavbarLoading,

    hideLoading:hideNavbarLoading,

    selectModel

};
