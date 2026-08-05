/*=========================================================
    Cheem Coding
    Stream Manager
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const StreamConfig={

    endpoint:"/api/chat",

    enabled:true,

    typingSpeed:15,

    reconnect:true,

    retry:3,

    timeout:120000

};

/*==============================
    State
==============================*/

let streamController=null;

let streaming=false;

let currentResponse="";

let streamReader=null;

/*==============================
    Create Controller
==============================*/

function createController(){

    streamController=

    new AbortController();

    return streamController;

}

/*==============================
    Is Streaming
==============================*/

function isStreaming(){

    return streaming;

}

/*==============================
    Stop Stream
==============================*/

function stopStream(){

    streaming=false;

    currentResponse="";

    streamReader?.cancel();

    streamController?.abort();

}

/*==============================
    Build Payload
==============================*/

function buildPayload(messages){

    return{

        model:

        window.CheemModels

        ?

        CheemModels

        .getCurrentModel()

        ?.id

        :

        "gpt-5.5",

        stream:true,

        messages

    };

}

/*==============================
    Send Request
==============================*/

async function send(messages){

    if(streaming){

        return;

    }

    streaming=true;

    currentResponse="";

    createController();

    const response=

    await fetch(

        StreamConfig.endpoint,

        {

            method:"POST",

            headers:{

                "Content-Type":

                "application/json"

            },

            body:JSON.stringify(

                buildPayload(messages)

            ),

            signal:

            streamController.signal

        }

    );

    if(

        !response.ok

    ){

        streaming=false;

        throw new Error(

            "Stream Error"

        );

    }

    streamReader=

    response.body.getReader();

    readStream();

}
/*==============================
    Read Stream
==============================*/

async function readStream(){

    const decoder=

    new TextDecoder();

    while(streaming){

        const{

            value,

            done

        }=

        await streamReader.read();

        if(done){

            break;

        }

        const chunk=

        decoder.decode(

            value,

            {

                stream:true

            }

        );

        parseChunk(chunk);

    }

    finishStream();

}

/*==============================
    Parse Chunk
==============================*/

function parseChunk(chunk){

    const lines=

    chunk.split("\n");

    lines.forEach(line=>{

        if(

            !line.startsWith(

                "data:"

            )

        ){

            return;

        }

        const text=

        line.replace(

            "data:",

            ""

        ).trim();

        if(

            text==="[DONE]"

        ){

            finishStream();

            return;

        }

        try{

            const json=

            JSON.parse(text);

            const delta=

            json.choices?.[0]

            ?.delta?.content

            ||

            "";

            appendToken(delta);

        }

        catch{}

    });

}

/*==============================
    Append Token
==============================*/

function appendToken(token){

    if(!token){

        return;

    }

    currentResponse+=token;

    renderTyping();

}

/*==============================
    Typing Render
==============================*/

function renderTyping(){

    const output=

    document.getElementById(

        "streamMessage"

    );

    if(!output){

        return;

    }

    if(

        window.CheemMarkdown

    ){

        output.innerHTML=

        CheemMarkdown.render(

            currentResponse

        );

    }

    else{

        output.textContent=

        currentResponse;

    }

    autoScroll();

}

/*==============================
    Cursor
==============================*/

function toggleCursor(show){

    const cursor=

    document.getElementById(

        "typingCursor"

    );

    if(!cursor){

        return;

    }

    cursor.style.display=

    show

    ?

    "inline-block"

    :

    "none";

}

/*==============================
    Auto Scroll
==============================*/

function autoScroll(){

    const container=

    document.getElementById(

        "chatMessages"

    );

    if(!container){

        return;

    }

    container.scrollTop=

    container.scrollHeight;

}

/*==============================
    Token Counter
==============================*/

function streamTokens(){

    return Math.ceil(

        currentResponse.length/4

    );

}

/*==============================
    Stream Error
==============================*/

function streamError(error){

    console.error(error);

    showToast(

        error.message||

        "Stream Error",

        "error"

    );

    stopStream();

}
/*==============================
    Retry Stream
==============================*/

async function retryStream(messages){

    for(

        let i=1;

        i<=StreamConfig.retry;

        i++

    ){

        try{

            await send(messages);

            return;

        }

        catch(error){

            if(

                i===StreamConfig.retry

            ){

                streamError(error);

            }

        }

    }

}

/*==============================
    Timeout
==============================*/

function streamTimeout(){

    setTimeout(

        ()=>{

            if(

                streaming

            ){

                streamError(

                    new Error(

                        "Request timeout."

                    )

                );

            }

        },

        StreamConfig.timeout

    );

}

/*==============================
    Reconnect
==============================*/

async function reconnect(messages){

    if(

        !StreamConfig.reconnect

    ){

        return;

    }

    await retryStream(

        messages

    );

}

/*==============================
    Finish
==============================*/

function finishStream(){

    if(

        !streaming

    ){

        return;

    }

    streaming=false;

    toggleCursor(false);

    streamReader=null;

    streamController=null;

    if(

        window.CheemConversation

    ){

        CheemConversation.addMessage(

            "assistant",

            currentResponse

        );

    }

    if(

        window.CheemHistory

    ){

        const history=

        CheemHistory.getCurrentHistory?.();

        if(history){

            CheemHistory.addHistoryMessage(

                history.id,

                "assistant",

                currentResponse

            );

        }

    }

    currentResponse="";

}

/*==============================
    Copy Response
==============================*/

async function copyResponse(){

    if(

        !navigator.clipboard

    ){

        return;

    }

    await navigator.clipboard.writeText(

        currentResponse

    );

    showToast(

        "Copied.",

        "success"

    );

}

/*==============================
    Regenerate
==============================*/

async function regenerate(){

    const chat=

    window.CheemConversation

    ?

    CheemConversation

    .currentConversation()

    :

    null;

    if(

        !chat

    ){

        return;

    }

    await send(

        chat.messages

    );

}

/*==============================
    Initialize
==============================*/

function initStream(){

    toggleCursor(false);

    console.log(

        "%cStream Ready",

        "color:#0ea5e9;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initStream

);

/*==============================
    Public API
==============================*/

window.CheemStream={

    send,

    stopStream,

    retryStream,

    reconnect,

    regenerate,

    copyResponse,

    isStreaming,

    streamTokens,

    buildPayload

};
