/*
=========================================================
    Cheem Coding Storage
=========================================================
*/

"use strict";

const Storage={

    prefix:"cheem:"

};

function key(name){

    return Storage.prefix+name;

}

function set(name,value){

    localStorage.setItem(

        key(name),

        JSON.stringify(value)

    );

}

function get(name,defaultValue=null){

    const value=

    localStorage.getItem(

        key(name)

    );

    if(value===null){

        return defaultValue;

    }

    try{

        return JSON.parse(value);

    }catch{

        return defaultValue;

    }

}

function remove(name){

    localStorage.removeItem(

        key(name)

    );

}

function clear(){

    Object.keys(localStorage)

    .forEach(item=>{

        if(

            item.startsWith(

                Storage.prefix

            )

        ){

            localStorage.removeItem(item);

        }

    });

}

function has(name){

    return localStorage.getItem(

        key(name)

    )!==null;

}

window.CheemStorage={

    set,

    get,

    remove,

    clear,

    has

};
