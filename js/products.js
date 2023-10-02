document.addEventListener("DOMContentLoaded", function() {
  try {
    document.querySelector(".main_productos__contenedor__carta").addEventListener("click",()=>{
  
      window.location = "product-info.html";
    })    
  } catch (error) {
    
  }

  
  
  
  const catID = localStorage.getItem("catID"); // Obtener el catID del localStorage
  if (catID) {
    const URL_PRODUCTOS = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`; // link del json con el catID especifico
    console.log("Cargando productos para la categoría:", catID); // Probar si la función está siendo llamada

    fetch(URL_PRODUCTOS)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json(); // Convierte la respuesta en formato JSON.
      })
      .then(data => {
        // Aquí tienes acceso a los datos JSON en la variable "data".
        //console.log(data);  Muestra los datos en la consola para verificar.
        procesarDatos(data); // llamamos a prosesarDatos(datos) para manipular los datos.
      })
      .catch(error => {
        console.error('Hubo un error:', error);
    });
  }
});

/*==========================================================================FILTROS==========================================================================*/

 /* traido de HTML */

/* input Filtro */
  let minPrice = document.getElementById('minPrice')
  let maxPrice = document.getElementById('maxPrice')
  let maximo = 0

  /* input rango */
  let rangoMin = document.getElementById('rangoMin')
  let rangoMax = document.getElementById('rangoMax')
  /* Botones Filtro y Limpiar filtro */
  let boton_Filtrar = document.getElementById('boton_Filtrar')
  let boton_Limpiar = document.getElementById('boton_Limpiar')
  /* Botones otros Filtros */
  let boton_menorAMayor = document.getElementById('boton_menorAMayor')
  let boton_mayorAMenor = document.getElementById('boton_mayorAMenor')
  let boton_relevancia = document.getElementById('boton_relevancia')

localStorage.removeItem('prods')

  /* Cuando se cambia el input slider minimo se pone el valor en el input number  de arriba*/
  rangoMin.addEventListener('input',(e)=>{
    minPrice.value=e.target.value
  })
  /* Cuando se cambia el input slider maximo se pone el valor en el input number de arriba */
  rangoMax.addEventListener('input',(e)=>{
      maxPrice.value= Math.floor(((100-e.target.value)*maximo)/100)
  })

  /* Cuando se hace clic en filtrar, corre esta evento  y filtra por el rango de los input slider se guarda en el
   localstorage para usarlo despues y se manda a hacer re-render*/
  boton_Filtrar.addEventListener('click', () =>{
    let nuevosProdsFiltrados = JSON.parse(localStorage.getItem('prods')).filter((producto) => producto.cost >= minPrice.value && producto.cost <= maxPrice.value);
    localStorage.setItem('prodsFiltrados', JSON.stringify(nuevosProdsFiltrados))
    procesarDatos(nuevosProdsFiltrados)
  })

  /* Limpia todos los filtros, pone el rango max y min en 0 y limpia local storage productos filtrados y hace re-render */
  boton_Limpiar.addEventListener('click', () =>{
    rangoMin.value = 0
    rangoMax.value = 0
    maxPrice.value = maximo
    minPrice.value = 0
    buscador.value = "";
    localStorage.removeItem('prodsFiltrados')
    procesarDatos(JSON.parse(localStorage.getItem('prods')))
  })

  /* ordena de mayor a menor con los productos filtrados o no filtrados si esta en el localstorage*/
  boton_mayorAMenor.addEventListener('click',()=>{
    let newprods = JSON.parse(localStorage.getItem('prods')).sort((a,b) => {return a.cost - b.cost});
    
    if(JSON.parse(localStorage.getItem('prodsFiltrados'))){
      let newprods2 = JSON.parse(localStorage.getItem('prodsFiltrados')).sort((a,b) => {return a.cost - b.cost});
      procesarDatos(newprods2)
      
    }else{
      procesarDatos(newprods)
    }
  })
  /* ordena de menor a mayor con los productos filtrados o no filtrados si esta en el localstorage*/
  boton_menorAMayor.addEventListener('click',()=>{
    let newprods = JSON.parse(localStorage.getItem('prods')).sort((a,b) => {return b.cost - a.cost});
    if(JSON.parse(localStorage.getItem('prodsFiltrados'))){
      let newprods2 = JSON.parse(localStorage.getItem('prodsFiltrados')).sort((a,b) => {return b.cost - a.cost});
      procesarDatos(newprods2)
      
    }else{
      procesarDatos(newprods)
    }

  })
  /* ordena por relevancia (mas comprados) si esta en el localstorage, se filtra ese, sino, todos */
  boton_relevancia.addEventListener('click',()=>{
    let newprods = JSON.parse(localStorage.getItem('prods')).sort((a,b) => {return b.soldCount - a.soldCount});
    if(JSON.parse(localStorage.getItem('prodsFiltrados'))){
      let newprods2 = JSON.parse(localStorage.getItem('prodsFiltrados')).sort((a,b) => {return b.soldCount - a.soldCount});
      procesarDatos(newprods2)
      
    }else{
      procesarDatos(newprods)
    }

  })

/*===============================================================================BUSCADOR===============================================================================*/

const buscador = document.getElementById('buscador');

// agregamos un evento input al campo de búsqueda que se activa cada vez que se introduce o se borra texto en el campo.
buscador.addEventListener('input', () => {
const searchTerm = buscador.value.toLowerCase().trim(); // Término de e búsquedan minúsculas sin espacios al principio y al final

let productosFiltrados = JSON.parse(localStorage.getItem('prods')); // Obtener todos los productos

// obtenemos los valores de los filtros de precio
const minPriceValue = minPrice.value !== '' ? parseFloat(minPrice.value) : 0;
const maxPriceValue = maxPrice.value !== '' ? parseFloat(maxPrice.value) : Infinity;

// filtramos por rango de precios
productosFiltrados = productosFiltrados.filter((producto) => {
  return producto.cost >= minPriceValue && producto.cost <= maxPriceValue;
});

// Si hay término de búsqueda, filtramos por búsqueda
if (searchTerm) {
  productosFiltrados = productosFiltrados.filter((producto) => {
    return producto.name.toLowerCase().includes(searchTerm) || producto.description.toLowerCase().includes(searchTerm);
  });
}

// llamamos a la funcion para mostrar los productos filtrados
procesarDatos(productosFiltrados);
});

/*=======================================================================MOSTRAR_PRODUCTOS=======================================================================*/

function procesarDatos(data) {
  /* Si esta funcion viene del fetch, trae data.prodcuts y se guarda en productos, si viene de otro lado,(otro evento) viene sin el products y se guarda en productos */
  let productos  // accedemos dentro de data, al array de objetos que se llama products (los productos/objetos con todas sus propiedades).
  if(data.products){
    productos = data.products
  }else{
    productos = data
  }
  /* Si no estan los productos en el localstorage, se guardan en el localstorage */
    if(!localStorage.getItem('prods'))localStorage.setItem('prods', JSON.stringify(productos))
    
  // Ordenar los productos por precio
  // let newprods = productos.sort((a,b) => {return a.cost -b.cost});
    let contenido = "";
    // Aquí ponemos los datos en una variable string (con codigo html).
    for (const producto of productos) { // recorremos el array que tiene los productos (productos es el array y producto el objeto por el que esta pasando (algo asi como el indice: [n] )).
        contenido += `
                    <div onclick="goToProductInfo(${producto.id})" class="main_productos__contenedor__carta change">
                    <a class="main_productos__contenedor__carta__link" href="#">
                        <div class="main_productos__contenedor__carta__contenedorimg"><img src="${producto.image}" alt="${producto.name}" class="main_productos__contenedor__carta__contenedorimg__img"></div>
                        <div class="main_productos__contenedor__carta__contenido change">
                            <h4 class="main_productos__contenedor__carta__contenido__titulo">${producto.name}</h4>    
                            <p class="main_productos__contenedor__carta__contenido__descripcion change">${producto.description}</p>
                            <div class="main_productos__contenedor__carta__contenido__informacion">
                                <div class="main_productos__contenedor__carta__contenido__informacion__datos1 ">
                                    <small class="main_productos__contenedor__carta__contenido__informacion__datos__texto ">${producto.cost} ${producto.currency}</small>
                                </div>
                                <div class="main_productos__contenedor__carta__contenido__informacion__datos2 ">
                                  <small class="main_productos__contenedor__carta__contenido__informacion__datos__texto">${producto.soldCount} Vendidos</small>
                                </div>
                            </div>
                        </div>
                      </a>
                    </div>
                    `
      /* guarda el precio maximo de todos los productos */
      if(producto.cost > maximo) {
        maximo = producto.cost
        maxPrice.value = maximo
        rangoMax.value =0
        rangoMin.max = maximo
      }
      document.getElementById("contenedor_productos").innerHTML = contenido; // aqui ponemos ese codigo html dentro del contenedor al que hacemos referencia.                  
    }
  /* Si no hay prods, se muestra que no hay prods */
  if(productos.length === 0)document.getElementById("contenedor_productos").innerHTML = "<h3 class='my-5'>No hay productos</h3>"
}

/*================================================================MANDAR_AL_PRODUCTO_SELECCIONADO================================================================*/

function goToProductInfo(id) {
  localStorage.setItem("IdProducto", id);
  window.location = "product-info.html";
}