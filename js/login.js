const user = document.getElementById("usuario");
const pass = document.getElementById("contraseña");
const aviso1 = document.getElementById("formulario__Aviso_user");
const aviso2 = document.getElementById("formulario__Aviso_pass");
const checkboxFrom = document.getElementById("checkboxLogin");
const verPass = document.getElementById("icono2__ver_pass");

document.getElementById("formulario").addEventListener("submit",(e)=>{
    e.preventDefault(); // Evito que cuando se aprete el submit, se borre los textos de los inputs.
    if (user.value !== "" && pass.value !== "") {
        if (checkboxFrom.checked) {// Lo guarda aunque se cierre la ventana.
            localStorage.setItem("usuario", `${user.value}`);
            localStorage.setItem("contraseña", `${pass.value}`);
            localStorage.setItem("log", `true`);
        }else{// Lo guarda hasta que se cierre la ventana.
            sessionStorage.setItem("log", `true`);
        }
        window.location = "index.html" // Redirijo al index.html
    } else if (user.value !== "") { // en los else siguientes muestro los cartelitos para especificar donde no se relleno.
        aviso2.style.opacity = "1";
    }else if (pass.value !== "") {
        aviso1.style.opacity = "1";
    }else{
        aviso1.style.opacity = "1";
        aviso2.style.opacity = "1";
    }
});

verPass.addEventListener("input", ()=>{
    (pass.type === "password") ? pass.type ="text" : pass.type = "password"
});

user.addEventListener("focus",()=>{ // oculto los avisos si se hace click en los inputs.
    aviso1.style.opacity = "0";
});
pass.addEventListener("focus",()=>{
    aviso2.style.opacity = "0";
});

document.addEventListener("DOMContentLoaded",()=>{
    const botonEnviar = document.getElementById("boton");
    botonEnviar.addEventListener('click',Guardar)
});
function Guardar() {
    const input = document.getElementById("usuario");
    localStorage.setItem("usuario", input.value);
  }