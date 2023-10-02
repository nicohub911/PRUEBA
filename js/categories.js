const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;



function setCatID(id) { // establece el catID para poder mostrar en productos los... de la categoria que se desea
    localStorage.setItem("catID", id);
    window.location = "products.html"  // lo mandas al products.html
}

/*________________________________________________para_abajo_estan_el_tema_de_los_filtros________________________________________________*/

// funcion que te verifica si esta activado el filtro de mincount
// y maxcount ( y lo filtra ). Lo termina mostrando en el contenedor cat-list-container.
function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="productCont m-1 position-relative rounded cursor-active">
                <div class="productCont__imgCont"><img src="${category.imgSrc}" alt="${category.description}" class="productCont__imgCont__img position-absolute"></div> 
                <div class="productCont__Cont position-absolute">
                    <div class="h-100 w-100 position-relative">
                        <div class="productCont__Cont__slider w-100 d-flex flex-column">
                            <div class="productCont__Cont__slider__slide_1 w-100 h-50 d-flex justify-content-center align-items-center">
                                <h4 class="productCont__Cont__slider__slide_1__title position-absolute">${category.name}</h4>
                                <small class="productCont__Cont__slider__slide_1__count position-absolute">${category.productCount} artículos</small>
                            </div>
                            <div class="productCont__Cont__slider__slide_2 w-100 h-50 d-flex justify-content-center align-items-center p-3">
                                <p class="productCont__Cont__slider__slide_2__descripcion">${category.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}
//funcion para mostrar solo las categorias que se buscaron y no tener que modificar CurrentCategories
function showSearchedCategoriesList(categories){
    if(categories.length==0){
        document.getElementById("cat-list-container").innerHTML = "";
    }
    let htmlContentToAppend = "";
    for(let i = 0; i < categories.length; i++){
        let category = categories[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="productCont m-1 position-relative rounded cursor-active">
                <div class="productCont__imgCont"><img src="${category.imgSrc}" alt="${category.description}" class="productCont__imgCont__img position-absolute"></div> 
                <div class="productCont__Cont position-absolute">
                    <div class="h-100 w-100 position-relative">
                        <div class="productCont__Cont__slider w-100 d-flex flex-column">
                            <div class="productCont__Cont__slider__slide_1 w-100 h-50 d-flex justify-content-center align-items-center">
                                <h4 class="productCont__Cont__slider__slide_1__title position-absolute">${category.name}</h4>
                                <small class="productCont__Cont__slider__slide_1__count position-absolute">${category.productCount} artículos</small>
                            </div>
                            <div class="productCont__Cont__slider__slide_2 w-100 h-50 d-flex justify-content-center align-items-center p-3">
                                <p class="productCont__Cont__slider__slide_2__descripcion">${category.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}


function Buscar(valorDeBusqueda){
    if (valorDeBusqueda){
    const SearchedCategoriesArray=currentCategoriesArray.filter(categoria=>{
        const terminoDeBusqueda = valorDeBusqueda.toLowerCase();
        const nombre=categoria.name.toLowerCase();
        const descripcion=categoria.description.toLowerCase();
        /*Se pasa el valor de busqueda, asi como la descripcion y el nombre de la categoria 
        correspondiente a minisculas y se devuelven solo los articulos que coinciden */
        
        return nombre.includes(terminoDeBusqueda) || descripcion.includes(terminoDeBusqueda);
        
    });
    console.log(SearchedCategoriesArray);
    return SearchedCategoriesArray;// Se devuelve el array filtrado.
} else{
    showCategoriesList(); // si no hay criterio de busqueda se muestran todas las categorias.
    return currentCategoriesArray;
}
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data
            showCategoriesList()
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });
    //Codigo que se encarga de traer el buscador y llamar a la funcion correspondiente cuando se reciba un input
    const Buscador=this.getElementById("buscador");
    Buscador.addEventListener('input', ()=>{
        showSearchedCategoriesList(Buscar(Buscador.value.trim()));
    }); 

    document.getElementById("sortAsc").addEventListener("click", function(){ // si apretan el filtro de orden alfabetico...
        sortAndShowCategories(ORDER_ASC_BY_NAME,Buscar(Buscador.value.trim()));
    });

    document.getElementById("sortDesc").addEventListener("click", function(){ // si apretan el filtro alfabetico (alreves)...
        sortAndShowCategories(ORDER_DESC_BY_NAME,Buscar(Buscador.value.trim()));
    });

    document.getElementById("sortByCount").addEventListener("click", function(){ // si apretan el filtro de cantidad de productos...
        sortAndShowCategories(ORDER_BY_PROD_COUNT,Buscar(Buscador.value.trim())); // Se agrego adaptacion que hace que tome en cuenta si hay algo ingresado en el buscador
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){ // limpia los campos de filtro
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;
        buscador.value = "";

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){ // cuando le haga click al boton de filtrar...
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount); // transformo en valor numerico el minCount
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount); // transformo en valor numerico el maxCount
        }
        else{
            maxCount = undefined;
        }

        sortAndShowCategories(null,Buscar(Buscador.value.trim())); // Se manda a mostrar el resultado de buscar pero filtrado ahora tambien por cantidad
    });
});


// funcion para los filtros de cant de stock, 
// alfabetico y alfabetico alreves.
function sortCategories(criteria, array){ // recibe un criterio para ordenar y un array
    let result = []; // para guardar el resultado
    if (criteria === ORDER_ASC_BY_NAME){ // si el criterio es ordenarlos alfabeticamente...
        result = array.sort(function(a, b) { // lo guarda ordenado en result
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){ // si el criterio es ordenarlos alreves (del alfabeto)...
        result = array.sort(function(a, b) { // lo guarda ordenado en result
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){ // si el criterio es por la cantidad de stock...
        result = array.sort(function(a, b) {  // lo guarda ordenado en result
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);
            
            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    return result; // la funcion returna el result con el criterio con el que se haya ordenado.
}


// funcion para llamar a la funcion que ordena por los filtros 
//de cant de stock, alfabetico y alfabetico alreves.
function sortAndShowCategories(sortCriteria, categoriesArray){
    if(!sortCriteria){
        showSearchedCategoriesList(categoriesArray);
    } else {
    showSearchedCategoriesList(sortCategories(sortCriteria,categoriesArray)); // muestro el resultado de las categorias filtradas
}}