const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
const nav_btn_responsive = document.getElementById("btn_nav_responsive");
const nav_contenedor_general = document.getElementById("nav_tag");

let estado_nav = false;

document.addEventListener("DOMContentLoaded", function(){
  if (localStorage.getItem("log") === null && sessionStorage.getItem("log") === null) { // compruebo si esta logeado.
    window.location = "login.html"; // lo mando al login.
  }
});


let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// para el boton del nav movile
nav_btn_responsive.addEventListener("click", ()=>{
  if (estado_nav) {
    estado_nav = false;
    nav_contenedor_general.style.height = "50px";
  } else {
    estado_nav = true;
    nav_contenedor_general.style.height = "260px";
  }
});

// para solucionar un bug con el nav movile, a la hora de cambiar la medida de la ventana
// y tener abierto el nav movile al mismo tiempo.
window.addEventListener("resize", ()=>{
  if (window.innerWidth > 630) {
    nav_contenedor_general.style.height = "50px";
  }
})



document.addEventListener("DOMContentLoaded", () => {
// obtenemos el nombre de usuario que está en localStorage
	const userName = localStorage.getItem("usuario");


// obtenemos el div al que le vamos a agregar los tres botones (icono de perfil, nombre de usuario y carrito)
// como el metodo getElementsByClassName devuelve una lista espicificamos que vamos a trabajar solo con el primer elemento [0]
	const parentDivs = document.getElementsByClassName("navegador__menu_2")[0];
 

// usando innerHTML con Template strings (tipo ${}) le ponemos el ya contenido de toda la sección con formato html
// We use bootstrap class to deploy the user menu
	parentDivs.innerHTML = `
  <div class="dropdown nav-item"> 
      <a class="btn btn-sm btn-warning dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"><div class="navegador__menu_2__lista__link"><span id="data">${userName}</span></div></a>
      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
            <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
            <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
            <li><a class="dropdown-item" style="cursor:pointer;"  id="btn-theme">Dark</a></li> 
            <li><a class="dropdown-item" style="cursor:pointer;" id="btn-logout">Cerrar sesión</a></li> 
      </ul>
  </div>
	`; 
  
  // Logout button.
  const btnLogOut=document.getElementById("btn-logout");
  btnLogOut.addEventListener('click',()=>{
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
  }) 
  
  // Theme Button - Dark/light exchange
  const btnTheme=document.getElementById("btn-theme");
  btnTheme.addEventListener('click',()=>{
    
    localStorage.setItem('dark-light',!JSON.parse(localStorage.getItem('dark-light')))

    themeChanger()
    if(JSON.parse(localStorage.getItem('dark-light'))){
      document.getElementById('btn-theme').innerText = 'Light'
    }else{
      document.getElementById('btn-theme').innerText = 'Dark'
    }

  }) 
      // If you enter to another page of the web, this part of the code change the theme to dark or light mode, depends of the user selection.
      if(!localStorage.getItem('dark-light')){
        localStorage.setItem('dark-light',false)
      }
        /* If in the local storage it's true, then it gets all the divs within that page that has the `change` class, and then changes the color */
        if(JSON.parse(localStorage.getItem('dark-light'))){
          themeChanger()
        }
      
});
// This is the change theme function. Is used to toggle between dark and light themes
const themeChanger = ()=>{
  const divs = document.getElementsByClassName('change')
  for (const div of divs) {
    
    div.classList.toggle('dark-light')
    if(div.classList.contains('jumbotron') && div.classList.contains('dark-light')){
      div.style.filter = "invert(90%)"
    }else{
      div.style.filter = "invert(0%)"
    }
    if(div.tagName === 'LI' && div.classList.contains('dark-light')){
      div.style.border = "solid 1px white"
    }else{
      div.style.border = ""
    }
  }
  if(JSON.parse(localStorage.getItem('dark-light')) == false){
    const divsSacar = document.getElementsByClassName('dark-light')
    for (const divs of divsSacar) {
        divs.classList.remove('dark-light')
    }
  }
} 




/*
  HOLA SOY NICOLAS. ESTE CODIGO ES POR SI LO QUIEREN HACER CON EL SESSION Y NO CON EL LOCAL.

  document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("usuario") === null) { // compruebo si el local no tiene algun valor para usuario
      mostrarUserName(sessionStorage.getItem("usuario"));
    }else{   // de no ser asi le mando el del local.
      mostrarUserName(localStorage.getItem("usuario"));
    }

  });

  // la funcion modularizada para mostrar el nombre
  function mostrarUserName(nombre) {
  // obtenemos el div al que le vamos a agregar los tres botones (icono de perfil, nombre de usuario y carrito)
  // como el metodo getElementsByClassName devuelve una lista espicificamos que vamos a trabajar solo con el primer elemento [0]
    const parentDivs = document.getElementsByClassName("navegador__menu_2")[0];
   
  
  // usando innerHTML con Template strings (tipo ${}) le ponemos el ya contenido de toda la sección con formato html
    parentDivs.innerHTML = `
      <a id="img_carrito" class="d-flex align-items-center me-3 rounded-circle" href="#"><img class="h-100" src="img/carrito.png" alt="carrito de compras"></a>
      <a href="my-profile.html"><div class="navegador__menu_2__lista__link"><span id="data">${nombre}</span></div></a>
      <a id="img_user" class="d-flex align-items-center rounded-circle" href="my-profile.html"><img class="h-100" src="img/user-Icon.png" alt="logo de usuario (menu de usuario)"></a>
    `;
  }

  AGREGAR ESTO AL LOGIN EN LA PARTE DE LOGEARSE (EN LA DEL SESION): sessionStorage.setItem("usuario", `${user.value}`);

*/