/*=========================================================
    Cheem Coder Alpha
    Authentication
    auth.js
=========================================================*/

"use strict";

/*=========================================================
    DOM Ready
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    initPasswordToggle();

    initPasswordStrength();

    initLogin();

    initRegister();

    initForgotPassword();

});

/*=========================================================
    Selectors
=========================================================*/

const $ = (selector)=>document.querySelector(selector);

const $$ = (selector)=>document.querySelectorAll(selector);

/*=========================================================
    Local Storage Keys
=========================================================*/

const STORAGE_KEY = "cheem_users";

const LOGIN_KEY = "cheem_login";

/*=========================================================
    Read Users
=========================================================*/

function getUsers(){

    return JSON.parse(

        localStorage.getItem(STORAGE_KEY)

        ||

        "[]"

    );

}

/*=========================================================
    Save Users
=========================================================*/

function saveUsers(users){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(users)

    );

}

/*=========================================================
    Save Login
=========================================================*/

function saveLogin(user){

    localStorage.setItem(

        LOGIN_KEY,

        JSON.stringify(user)

    );

}

/*=========================================================
    Get Login
=========================================================*/

function getLogin(){

    return JSON.parse(

        localStorage.getItem(LOGIN_KEY)

        ||

        "null"

    );

}

/*=========================================================
    Toast
=========================================================*/

function showToast(title,message,type="info"){

    let toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=`

        <h4>${title}</h4>

        <p>${message}</p>

    `;

    document.body.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.classList.add("show");

    });

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },350);

    },3000);

}

/*=========================================================
    Password Toggle
=========================================================*/

function initPasswordToggle(){

    $$(".passwordBox").forEach(box=>{

        const input=box.querySelector("input");

        const button=box.querySelector("button");

        if(!input||!button) return;

        button.onclick=()=>{

            if(input.type==="password"){

                input.type="text";

                button.textContent="🙈";

            }else{

                input.type="password";

                button.textContent="👁";

            }

        };

    });

}
/*=========================================================
    Password Strength
=========================================================*/

function initPasswordStrength(){

    const password=$("#password");

    const fill=$("#strengthFill");

    const text=$("#strengthText");

    if(!password||!fill||!text) return;

    password.addEventListener("input",()=>{

        const value=password.value;

        let score=0;

        if(value.length>=8) score++;

        if(/[A-Z]/.test(value)) score++;

        if(/[a-z]/.test(value)) score++;

        if(/[0-9]/.test(value)) score++;

        if(/[^A-Za-z0-9]/.test(value)) score++;

        fill.className="";

        switch(score){

            case 0:
            case 1:

                fill.style.width="20%";

                fill.classList.add("strength-weak");

                text.textContent="Weak Password";

            break;

            case 2:

                fill.style.width="45%";

                fill.classList.add("strength-medium");

                text.textContent="Medium Password";

            break;

            case 3:
            case 4:

                fill.style.width="75%";

                fill.classList.add("strength-good");

                text.textContent="Good Password";

            break;

            case 5:

                fill.style.width="100%";

                fill.classList.add("strength-strong");

                text.textContent="Strong Password";

            break;

        }

    });

}

/*=========================================================
    Validate Email
=========================================================*/

function isValidEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    .test(email);

}

/*=========================================================
    Validate Username
=========================================================*/

function isValidUsername(username){

    return username.length>=3;

}

/*=========================================================
    Validate Password
=========================================================*/

function isValidPassword(password){

    return password.length>=8;

}

/*=========================================================
    Input Error
=========================================================*/

function setError(input){

    input.classList.remove("success");

    input.classList.add("error");

}

function setSuccess(input){

    input.classList.remove("error");

    input.classList.add("success");

}

function clearState(input){

    input.classList.remove(

        "error",

        "success"

    );

}

/*=========================================================
    Loading Button
=========================================================*/

function setLoading(button,state){

    if(!button) return;

    if(state){

        button.disabled=true;

        button.classList.add("loading");

    }else{

        button.disabled=false;

        button.classList.remove("loading");

    }

}

/*=========================================================
    Find User
=========================================================*/

function findUser(login){

    const users=getUsers();

    return users.find(user=>

        user.email===login ||

        user.username===login

    );

}

/*=========================================================
    Delay
=========================================================*/

function wait(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}
/*=========================================================
    Register
=========================================================*/

function initRegister(){

    const form=$("#registerForm");

    if(!form) return;

    form.addEventListener("submit",async(e)=>{

        e.preventDefault();

        const username=$("#username");

        const email=$("#email");

        const password=$("#password");

        const confirm=$("#confirmPassword");

        const agree=$("#agree");

        const button=$("#registerButton");

        clearState(username);

        clearState(email);

        clearState(password);

        clearState(confirm);

        let valid=true;

        if(!isValidUsername(username.value.trim())){

            setError(username);

            valid=false;

        }else{

            setSuccess(username);

        }

        if(!isValidEmail(email.value.trim())){

            setError(email);

            valid=false;

        }else{

            setSuccess(email);

        }

        if(!isValidPassword(password.value)){

            setError(password);

            valid=false;

        }else{

            setSuccess(password);

        }

        if(password.value!==confirm.value){

            setError(confirm);

            valid=false;

        }else{

            setSuccess(confirm);

        }

        if(!agree.checked){

            showToast(

                "Terms",

                "Please accept the Terms of Service.",

                "warning"

            );

            valid=false;

        }

        if(!valid){

            showToast(

                "Register Failed",

                "Please check the information again.",

                "error"

            );

            return;

        }

        const users=getUsers();

        if(users.some(user=>user.username===username.value.trim())){

            setError(username);

            showToast(

                "Username Exists",

                "This username is already taken.",

                "error"

            );

            return;

        }

        if(users.some(user=>user.email===email.value.trim())){

            setError(email);

            showToast(

                "Email Exists",

                "This email has already been registered.",

                "error"

            );

            return;

        }

        setLoading(button,true);

        await wait(1200);

        users.push({

            id:Date.now(),

            username:username.value.trim(),

            email:email.value.trim(),

            password:password.value,

            createdAt:new Date().toISOString()

        });

        saveUsers(users);

        setLoading(button,false);

        showToast(

            "Success",

            "Account created successfully.",

            "success"

        );

        form.reset();

        setTimeout(()=>{

            window.location.href="login.html";

        },1800);

    });

}
/*=========================================================
    Login
=========================================================*/

function initLogin(){

    const form=$("#loginForm");

    if(!form) return;

    form.addEventListener("submit",async(e)=>{

        e.preventDefault();

        const login=$("#login");

        const password=$("#password");

        const remember=$("#remember");

        const button=$("#loginButton");

        clearState(login);

        clearState(password);

        if(login.value.trim()===""){

            setError(login);

            return;

        }

        if(password.value===""){

            setError(password);

            return;

        }

        const user=findUser(login.value.trim());

        if(!user){

            showToast(

                "Login Failed",

                "Account not found.",

                "error"

            );

            setError(login);

            return;

        }

        if(user.password!==password.value){

            setError(password);

            showToast(

                "Wrong Password",

                "Incorrect password.",

                "error"

            );

            return;

        }

        setLoading(button,true);

        await wait(1000);

        if(remember&&remember.checked){

            saveLogin(user);

        }

        setLoading(button,false);

        showToast(

            "Welcome",

            `Hello ${user.username}!`,

            "success"

        );

        setTimeout(()=>{

            window.location.href="../chat/index.html";

        },1200);

    });

}

/*=========================================================
    Forgot Password
=========================================================*/

function initForgotPassword(){

    const form=$("#forgotForm");

    if(!form) return;

    form.addEventListener("submit",(e)=>{

        e.preventDefault();

        const email=$("#email");

        const user=findUser(email.value.trim());

        if(!user){

            showToast(

                "Not Found",

                "Account does not exist.",

                "error"

            );

            return;

        }

        localStorage.setItem(

            "cheem_reset",

            user.username

        );

        showToast(

            "Success",

            "Continue to reset password.",

            "success"

        );

        setTimeout(()=>{

            window.location.href=

            "reset-password.html";

        },1200);

    });

}

/*=========================================================
    Auto Login
=========================================================*/

(function(){

    const user=getLogin();

    if(!user) return;

    if(

        window.location.pathname

        .includes("login.html")

    ){

        window.location.href=

        "../chat/index.html";

    }

})();

/*=========================================================
    Logout
=========================================================*/

function logout(){

    localStorage.removeItem(LOGIN_KEY);

    window.location.href=

    "../auth/login.html";

}

/*=========================================================
    Export
=========================================================*/

window.logout=logout;

/*=========================================================
    Console
=========================================================*/

console.clear();

console.log(

    "%cCheem Coder",

    "font-size:26px;font-weight:bold;color:#3b82f6;"

);

console.log(

    "%cAuthentication Loaded",

    "font-size:14px;color:#94a3b8;"

);

/*=========================================================
    End auth.js
=========================================================*/
