/*
=========================================================
    Cheem Coding Dropdown Component
    Chat Cheem Coding - Meoz building
=========================================================
*/

"use strict";


/*==============================
    State
==============================*/

const Dropdown={

    initialized:false,

    items:[]

};



/*==============================
    Initialize
==============================*/

function initDropdowns(){

    Dropdown.items=[

        ...document.querySelectorAll(

            ".dropdown"

        )

    ];


    if(

        !Dropdown.items.length

    ){

        return;

    }


    Dropdown.initialized=true;


    bindDropdowns();

}



/*==============================
    Bind
==============================*/

function bindDropdowns(){

    Dropdown.items.forEach(

        dropdown=>{

            bindTrigger(

                dropdown

            );


            bindItems(

                dropdown

            );

        }

    );

}



/*==============================
    Helpers
==============================*/

function getTrigger(

    dropdown

){

    return dropdown.querySelector(

        ".dropdown-trigger"

    );

}


function getMenu(

    dropdown

){

    return dropdown.querySelector(

        ".dropdown-menu"

    );

}
/*==============================
    Open / Close
==============================*/

function openDropdown(

    dropdown

){

    closeAllDropdowns();


    dropdown.classList.add(

        "open"

    );

}


function closeDropdown(

    dropdown

){

    dropdown.classList.remove(

        "open"

    );

}


function closeAllDropdowns(){

    Dropdown.items.forEach(

        closeDropdown

    );

}



/*==============================
    Trigger
==============================*/

function bindTrigger(

    dropdown

){

    getTrigger(

        dropdown

    )?.addEventListener(

        "click",

        event=>{

            event.stopPropagation();


            dropdown.classList.contains(

                "open"

            )

            ?

            closeDropdown(

                dropdown

            )

            :

            openDropdown(

                dropdown

            );

        }

    );

}



/*==============================
    Items
==============================*/

function bindItems(

    dropdown

){

    dropdown

    .querySelectorAll(

        ".dropdown-item"

    )

    .forEach(

        item=>{

            if(

                item.classList.contains(

                    "disabled"

                )

            ){

                return;

            }


            item.addEventListener(

                "click",

                ()=>{

                    dropdown

                    .querySelectorAll(

                        ".dropdown-item"

                    )

                    .forEach(

                        element=>

                        element.classList.remove(

                            "active"

                        )

                    );


                    item.classList.add(

                        "active"

                    );


                    closeDropdown(

                        dropdown

                    );

                }

            );

        }

    );

}



/*==============================
    Search
==============================*/

function filterDropdown(

    input

){

    const value=

    input.value.toLowerCase();


    input

    .closest(

        ".dropdown"

    )

    ?.querySelectorAll(

        ".dropdown-item"

    )

    .forEach(

        item=>{

            item.style.display=

            item.textContent

            .toLowerCase()

            .includes(

                value

            )

            ?

            ""

            :

            "none";

        }

    );

}



/*==============================
    Outside Click
==============================*/

document.addEventListener(

    "click",

    ()=>{

        closeAllDropdowns();

    }

);
/*==============================
    Keyboard Navigation
==============================*/

document.addEventListener(

    "keydown",

    event=>{

        if(

            event.key==="Escape"

        ){

            closeAllDropdowns();

        }

    }

);



/*==============================
    Observer
==============================*/

const dropdownObserver=

new MutationObserver(

    ()=>{

        if(

            Dropdown.initialized

        ){

            initDropdowns();

        }

    }

);



/*==============================
    Initialize
==============================*/

function bootDropdowns(){

    initDropdowns();


    dropdownObserver.observe(

        document.body,

        {

            childList:true,

            subtree:true

        }

    );


    console.log(

        "%cDropdown Component Loaded",

        "color:#8b5cf6;font-weight:bold;"

    );

}


document.addEventListener(

    "DOMContentLoaded",

    bootDropdowns

);



/*==============================
    Destroy
==============================*/

function destroyDropdowns(){

    dropdownObserver.disconnect();

}



/*==============================
    Public API
==============================*/

window.CheemDropdown={

    init:initDropdowns,

    open:openDropdown,

    close:closeDropdown,

    closeAll:closeAllDropdowns,

    filter:filterDropdown,

    destroy:destroyDropdowns

};
