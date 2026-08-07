/*
=========================================================
    Cheem Coding API
=========================================================
*/

"use strict";

const API={

    baseURL:"/api",

    headers:{
        "Content-Type":"application/json"
    }

};

async function request(

    endpoint,

    options={}

){

    const response=

    await fetch(

        API.baseURL+endpoint,

        {
            headers:{
                ...API.headers,
                ...(options.headers||{})
            },
            ...options
        }

    );

    if(!response.ok){

        throw new Error(

            response.statusText

        );

    }

    const type=

    response.headers.get(

        "content-type"

    );

    if(type?.includes("application/json")){

        return response.json();

    }

    return response.text();

}

function get(endpoint){

    return request(endpoint);

}

function post(endpoint,data){

    return request(

        endpoint,

        {
            method:"POST",
            body:JSON.stringify(data)
        }

    );

}

function put(endpoint,data){

    return request(

        endpoint,

        {
            method:"PUT",
            body:JSON.stringify(data)
        }

    );

}

function del(endpoint){

    return request(

        endpoint,

        {
            method:"DELETE"
        }

    );

}

window.CheemAPI={

    get,

    post,

    put,

    delete:del,

    request

};
