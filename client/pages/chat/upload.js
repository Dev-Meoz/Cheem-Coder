/*=========================================================
    Cheem Coding
    Upload Manager
    Chat Cheem Coding - Meoz building
=========================================================*/

"use strict";

/*==============================
    Config
==============================*/

const UploadConfig={

    maxFileSize:100*1024*1024,

    maxFiles:20,

    autoUpload:false,

    endpoint:"/api/upload",

    allowImage:true,

    allowDocument:true,

    allowCode:true,

    allowArchive:true

};

/*==============================
    DOM
==============================*/

const fileInput=

document.getElementById("fileInput");

const uploadButton=

document.getElementById("uploadButton");

const uploadArea=

document.getElementById("uploadArea");

const uploadList=

document.getElementById("uploadList");

/*==============================
    State
==============================*/

let uploadQueue=[];

/*==============================
    Supported Files
==============================*/

const SupportedFileTypes=[

".txt",

".md",

".json",

".js",

".ts",

".jsx",

".tsx",

".lua",

".luau",

".py",

".java",

".cpp",

".c",

".cs",

".php",

".html",

".css",

".xml",

".yaml",

".yml",

".sql",

".zip",

".rar",

".7z",

".pdf",

".doc",

".docx",

".png",

".jpg",

".jpeg",

".gif",

".svg",

".webp"

];

/*==============================
    Select File
==============================*/

uploadButton?.addEventListener(

"click",

()=>{

    fileInput.click();

});

/*==============================
    Input Change
==============================*/

fileInput?.addEventListener(

"change",

event=>{

    addFiles(

        [...event.target.files]

    );

});

/*==============================
    Add Files
==============================*/

function addFiles(files){

    files.forEach(file=>{

        validateFile(file);

    });

    renderUploadList();

}

/*==============================
    Validate
==============================*/

function validateFile(file){

    if(

        uploadQueue.length

        >=

        UploadConfig.maxFiles

    ){

        showToast(

            "Maximum file limit reached",

            "error"

        );

        return;

    }

    if(

        file.size>

        UploadConfig.maxFileSize

    ){

        showToast(

            "File too large",

            "error"

        );

        return;

    }

    uploadQueue.push({

        id:crypto.randomUUID(),

        file,

        progress:0,

        uploaded:false,

        error:false

    });

}
/*==============================
    Drag & Drop
==============================*/

uploadArea?.addEventListener(

"dragover",

event=>{

    event.preventDefault();

    uploadArea.classList.add("dragging");

});

uploadArea?.addEventListener(

"dragleave",

()=>{

    uploadArea.classList.remove("dragging");

});

uploadArea?.addEventListener(

"drop",

event=>{

    event.preventDefault();

    uploadArea.classList.remove("dragging");

    addFiles(

        [...event.dataTransfer.files]

    );

});

/*==============================
    Render Upload List
==============================*/

function renderUploadList(){

    if(!uploadList){

        return;

    }

    uploadList.innerHTML="";

    uploadQueue.forEach(item=>{

        const element=document.createElement("div");

        element.className="uploadItem";

        element.dataset.id=item.id;

        element.innerHTML=`

            <div class="uploadIcon">

                ${fileIcon(item.file.name)}

            </div>

            <div class="uploadInfo">

                <div class="uploadName">

                    ${item.file.name}

                </div>

                <div class="uploadSize">

                    ${formatSize(item.file.size)}

                </div>

                <div class="uploadProgress">

                    <div

                        class="uploadBar"

                        style="width:${item.progress}%"

                    ></div>

                </div>

            </div>

            <button

                class="removeUpload"

                data-remove="${item.id}"

            >

                ✕

            </button>

        `;

        uploadList.appendChild(element);

    });

}

/*==============================
    Remove File
==============================*/

document.addEventListener(

"click",

event=>{

    const button=

    event.target.closest(

        "[data-remove]"

    );

    if(!button){

        return;

    }

    uploadQueue=

    uploadQueue.filter(

        item=>

        item.id!==button.dataset.remove

    );

    renderUploadList();

});

/*==============================
    Clear Queue
==============================*/

function clearUploadQueue(){

    uploadQueue=[];

    renderUploadList();

}

/*==============================
    Preview Image
==============================*/

function previewImage(file){

    if(

        !file.type.startsWith(

            "image/"

        )

    ){

        return;

    }

    const reader=

    new FileReader();

    reader.onload=()=>{

        const preview=

        document.getElementById(

            "imagePreview"

        );

        if(!preview){

            return;

        }

        preview.src=reader.result;

        preview.style.display="block";

    };

    reader.readAsDataURL(file);

}

/*==============================
    Helpers
==============================*/

function formatSize(size){

    if(size<1024){

        return size+" B";

    }

    if(size<1024*1024){

        return(

            (size/1024)

            .toFixed(1)

            +" KB"

        );

    }

    return(

        (size/1024/1024)

        .toFixed(2)

        +" MB"

    );

}

function fileIcon(name){

    const ext=

    name.split(".")

    .pop()

    .toLowerCase();

    switch(ext){

        case"js":

        case"ts":

        case"lua":

        case"luau":

        case"cpp":

        case"py":

        case"java":

            return"💻";

        case"html":

        case"css":

            return"🌐";

        case"json":

        case"xml":

        case"yaml":

            return"📄";

        case"png":

        case"jpg":

        case"jpeg":

        case"gif":

        case"svg":

        case"webp":

            return"🖼️";

        case"zip":

        case"rar":

        case"7z":

            return"📦";

        case"pdf":

        case"doc":

        case"docx":

            return"📘";

        default:

            return"📁";

    }

}
/*==============================
    Upload API
==============================*/

let uploadController=null;

async function uploadFile(item){

    uploadController=

    new AbortController();

    const form=

    new FormData();

    form.append(

        "file",

        item.file

    );

    try{

        const response=

        await fetch(

            UploadConfig.endpoint,

            {

                method:"POST",

                body:form,

                signal:

                uploadController.signal

            }

        );

        if(

            !response.ok

        ){

            throw new Error(

                "Upload failed."

            );

        }

        item.progress=100;

        item.uploaded=true;

        renderUploadList();

        showToast(

            `${item.file.name} uploaded.`,

            "success"

        );

    }

    catch(error){

        item.error=true;

        renderUploadList();

        showToast(

            error.message,

            "error"

        );

    }

}

/*==============================
    Upload All
==============================*/

async function uploadAll(){

    for(

        const item

        of

        uploadQueue

    ){

        if(

            item.uploaded

        ){

            continue;

        }

        await uploadFile(item);

    }

}

/*==============================
    Abort Upload
==============================*/

function cancelUpload(){

    if(

        uploadController

    ){

        uploadController.abort();

    }

}

/*==============================
    Retry Upload
==============================*/

async function retryUpload(id){

    const item=

    uploadQueue.find(

        file=>file.id===id

    );

    if(!item){

        return;

    }

    item.error=false;

    item.progress=0;

    await uploadFile(item);

}

/*==============================
    Clipboard Paste
==============================*/

document.addEventListener(

"paste",

event=>{

    const files=[

        ...event.clipboardData.files

    ];

    if(

        files.length===0

    ){

        return;

    }

    addFiles(files);

});

/*==============================
    Auto Upload
==============================*/

if(

    UploadConfig.autoUpload

){

    document.addEventListener(

        "change",

        ()=>{

            uploadAll();

        }

    );

}

/*==============================
    Initialize
==============================*/

function initUpload(){

    renderUploadList();

    console.log(

        "%cUpload Ready",

        "color:#f59e0b;font-weight:bold;"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initUpload

);

/*==============================
    Public API
==============================*/

window.CheemUpload={

    addFiles,

    uploadFile,

    uploadAll,

    cancelUpload,

    retryUpload,

    clearUploadQueue,

    previewImage,

    renderUploadList

};
