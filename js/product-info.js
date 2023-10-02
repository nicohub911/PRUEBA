const PRODUCT_ID = localStorage.getItem("IdProducto");
const PRODUCT_URL = `https://japceibal.github.io/emercado-api/products/${PRODUCT_ID}.json`;
const COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${PRODUCT_ID}.json`;
const UI_SUBMIT_BUTTON = document.getElementById("btnSubmit");
let apiData;


//se rehízo el fetch para poder usarlo en otras funciones
async function fetchData(_url){
    try{
        const request = await fetch(_url)
        const resp = await request.json()
        return resp
    }catch(e){
        console.log('error' + e)
    }

};

// muestra la informacion del producto y crea un modal de bootsrap para poder mostrar las imagenes más grandes si el usuario hace click en la imagen principal
async function showProductInfo() {
    const objectProduct = await fetchData(PRODUCT_URL);
    apiData = objectProduct;
	const modalContainer = document.getElementById("img-modal");
    const container = document.getElementById("product__info");
	
	modalContainer.innerHTML = `
	    <div class="modal-header">
			<h1 class="modal-title fs-5">${objectProduct.name} \> imágenes</h1>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
		</div>
		<div class="modal-body bg-dark overflow-hidden">
			<div class="d-flex flex-wrap align-items-center justify-content-center" >
				<div class="col-md-2">
					<div class="row g-0">
						<div class="col-3 col-md-12 mt-1 mb-1">
							<img onclick="changeModalImg(0)" style="cursor: pointer;" class="img-thumbnail" src="${objectProduct.images[0]}" alt="primer imagen del producto">
						</div>
						<div class="col-3 col-md-12 mt-1 mb-1">
							<img onclick="changeModalImg(1)" style="cursor: pointer;" class="img-thumbnail" src="${objectProduct.images[1]}" alt="segunda imagen del producto">
						</div>
						<div class="col-3 col-md-12 mt-1 mb-1">
							<img onclick="changeModalImg(2)" style="cursor: pointer;" class="img-thumbnail" src="${objectProduct.images[2]}" alt="tercera imagen del producto">
						</div>
						<div class="col-3 col-md-12 mt-1 mb-1">
							<img onclick="changeModalImg(3)" style="cursor: pointer;" class="img-thumbnail" src="${objectProduct.images[3]}" alt="cuarta imagen del producto">
						</div>
					</div>
				</div>
				<div class="col-12 col-md-10 text-center">
					<img id="main-modal-img" style="width:95%; max-height: 90vh;"src="${objectProduct.images[0]}" alt="imagen principal del producto">
				</div>
			</div>
		</div>
	`
	
    container.innerHTML = 
    `
	<div class="producto_info__contenedor d-flex flex-wrap justify-content-center">
		<div class="producto_info__contenedor__imgCont carousel slide col-md-5" id="productImageCarousel" data-bs-ride="carousel" data-bs-interval="false">	
           
            <div class="carousel-inner active">
              <div class="carousel-item active producto_info__contenedor__imgCont__imgprincipal">
         	     <img data-bs-toggle="modal" data-bs-target="#fs-modal" class="d-block w-100" id="imgPrincipal" src="${objectProduct.images[0]}" alt="imagen principal del producto">
              </div>
              <div class="carousel-item">
                  <img data-bs-toggle="modal" data-bs-target="#fs-modal" src="${objectProduct.images[1]}" alt="segunda imagen del producto" class="d-block w-100">
              </div>
              <div class="carousel-item">
                  <img data-bs-toggle="modal" data-bs-target="#fs-modal" src="${objectProduct.images[2]}" alt="tercera imagen del producto" class="d-block w-100">
              </div>
              <div class="carousel-item">
                 <img data-bs-toggle="modal" data-bs-target="#fs-modal" src="${objectProduct.images[3]}" alt="cuarta imagen del producto" class="d-block w-100">
              </div>
              <div class="carousel-indicators">
              <button type="button" data-bs-target="#productImageCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#productImageCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#productImageCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#productImageCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
             </div>  
             <button class="carousel-control-prev" type="button" data-bs-target="#productImageCarousel" data-bs-slide="prev">
             <span class="carousel-control-prev-icon" aria-hidden="true"></span>
             <span class="visually-hidden">Previous</span>
             </button>
             <button class="carousel-control-next" type="button" data-bs-target="#productImageCarousel" data-bs-slide="next">
             <span class="carousel-control-next-icon" aria-hidden="true"></span>
             <span class="visually-hidden">Next</span>
             </button>
			
		    </div>
        

		</div>

        <div class="producto_info__contenedor__informacion ps-5 p-3 change">
            <h1 class="producto_info__contenedor__informacion__titulo ">${objectProduct.name}</h1>
            <h2 class="producto_info__contenedor__informacion__precio "><span>${objectProduct.currency}</span> ${objectProduct.cost}</h2>
            <p class="producto_info__contenedor__informacion__descripcion "><b>Descripcion: </b>${objectProduct.description}</p>
            <p class="producto_info__contenedor__informacion__otros "><small>Categoria: <a href="products.html">${objectProduct.category}</a></small><small>Vendidos: ${objectProduct.soldCount}</small></p>
        </div>
	</div>

    `
	

    displayComments();
	showRelated(objectProduct);
}

/* muestra los comentarios del producto incluyendo las estrellas, llama a la funcion fetch dentro de un bloque try
Si hay error muestra en el espacio de los comentarios que no se pudieron cargar los mismos.
En caso contrario, ordena el array de mas reciente a mas antiguo y le hace un foreach para mostrar todos,
con template strings se llama a la funcion displayRating para mostrar las estrellas
*/
async function displayComments() {
    const divOpinion = document.getElementById('opiniones')
	divOpinion.innerHTML= "";	
    const APIcomments = await fetchData(COMMENTS_URL); 
	
	
    let comments = (JSON.parse(localStorage.getItem(`${PRODUCT_ID}_user_comments`))) || [];
    comments = comments.concat(APIcomments.sort((a, b) => {return new Date(b.dateTime) - new Date(a.dateTime)}));
    
	if(comments.length !== 0) {
		comments.forEach(comment => {
			divOpinion.innerHTML += `
			<li class="list-group-item change">
				<p class="change"><span class='fw-bold'>${comment.user} </span> - <span>${comment.dateTime}</span> - <span class="text-nowrap">${displayRating(comment.score)}</span></p>
				<p class="text-break change"><span>${comment.description}</p>
			</li>
			`
		});
        /* The api takes a few seconds to bring all the comments, so we put this here to make sure all the comments are loaded to change their class to dark */
        if(JSON.parse(localStorage.getItem('dark-light'))){
            const divs = document.getElementsByClassName('change')
            for (const div of divs) {
              div.classList.add('dark-light')
            }
          }
	} else {
		divOpinion.innerHTML = `
			<li class="list-group-item" style="background-color:#ff6054;">
			<h2>No hay comentarios para mostrar.</h2></li>
		`;
	}
}

// esta funcion repite las estrellas el numero de valoraciones que hay y si no hay 5 estrellas pone las vacias
function displayRating(rating){
    const checkedStars =  '<span class="fa fa-star checked"></span>'.repeat(rating) ;
    const uncheckedStars = '<span class="fa fa-star"></span>'.repeat(5 - rating );
    return checkedStars + uncheckedStars;
}

// muestra los productos relacionados con sus respectivos links en el apartado dedicado
function showRelated(productObject) {
	const arrayRelated = productObject.relatedProducts;
    const relatedContainer = document.getElementById("related_products");
	arrayRelated.forEach(product => {
		relatedContainer.innerHTML += `
<div class="flex-fill col-12 h-25">
	<a class="related_productos__contenedor__carta__link" href="#">
		<div onclick="goToProductInfo(${product.id})" class="releated_products__contenedor__carta card rounded mb-2">
			<div class="main_productos__contenedor__carta__contenedorimg"><img src="${product.image}" alt="${product.name}" class="main_productos__contenedor__carta__contenedorimg__img"></div>
		<h4 class="w-100 text-center">${product.name}</h4>  
		</div>
	</a>
</div>
		`
	});
}


// igual a la funcion que se encuentra en en products.js pero recarga la página en lugar de redireccionar
function goToProductInfo(id) { 
    localStorage.setItem("IdProducto", id);
    location.reload();
}


// cambia la imagen del modal
function changeModalImg(i) {
    const img = document.getElementById("main-modal-img");
    img.src = `${apiData.images[i]}`;
}


UI_SUBMIT_BUTTON.addEventListener('click',()=>{
    const commentText=document.getElementById("UI_comment");
    const starsNumber = document.getElementsByName("rating3"); // Traemos todos los radio button de las estrellas
    let selectedStars = ""; //Variable donde se va a guardar la cantidad de estrellas
    for (let i = 0; i < starsNumber.length; i++) { // se recorre el arreglo de estrellas que se trajo para encontrar la seleccionada
        if (starsNumber[i].checked) {
            selectedStars = starsNumber[i].value;
          break; // Salir del bucle si se encuentra una seleccionado
        } 
    }
    uploadComment(commentText.value, selectedStars) // Se llama a la funcion encargada de cargar y mostrar el comentario y se le envian los objectProduct recibidos.
    commentText.value="";
    starsNumber[0].checked=true; //Se resetean las estrellas y el textarea del comentario
});

function uploadComment(message, rating){
	
  // se obtiene fecha actual y se le da el formato que tienen los demás comentarios. Se usa la función padStart para asegurarnos que tengan 2 digitos.
  const uploadDate = new Date();
  
  const formattedDate = `
		${uploadDate.getFullYear()}-${(uploadDate.getMonth() +1).toString().padStart(2, "0")}-${uploadDate.getDate().toString().padStart(2, "0")}
		${uploadDate.getHours().toString().padStart(2, "0")}:${uploadDate.getMinutes().toString().padStart(2, "0")}:${uploadDate.getSeconds().toString().padStart(2, "0")}
  `

  // Nuevo comentario HTML
   
  const commentObject = {
	product: PRODUCT_ID,
    user: localStorage.getItem("usuario"),
    dateTime: formattedDate,
    description: message,
    score: rating,
  };

  // Obtenemos comentarios del storage o lo incializamos vacio si no hay comentarios guardados
  const storedComments = JSON.parse(localStorage.getItem(`${PRODUCT_ID}_user_comments`)) || [];

  // Agregamos el nuevo comentario a los existentes, se usa unshift para que se agrege al principio y queden todos los comentarios ordenados por fecha
  storedComments.unshift(commentObject);

  // Guardamos en el localStorage
  localStorage.setItem(`${PRODUCT_ID}_user_comments`, JSON.stringify(storedComments));

 
  displayComments();
}

showProductInfo();