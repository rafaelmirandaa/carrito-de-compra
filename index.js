function iniciarApp(){

    obtenerDatos();

    function obtenerDatos(){
        const datos = "/data.json";
        fetch(datos)
            .then(respuesta => respuesta.json())
                .then(productos =>{
                    obtenerPlato(productos);
                })
                .catch(error =>console.error("Error al obtener datos", error));
            }
    }

    function obtenerPlato(productos){
       const contenedor = document.querySelector('.tres-columnas');
        
       productos.forEach((plato, index )=>{
        const id = index + 1;
       
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = id;
        card.innerHTML =`
        <div class= "card-contenido">
            <picture>
                <source media="(min-width: 1024px)" srcset="${plato.image.desktop}">
                <source media="(min-width: 768px)" srcset="${plato.image.tablet}">
                <img src="${plato.image.mobile}" alt="${plato.name}">
                <div class ="button-add" >
            </picture>        
                    <img src="/assets/images/icon-add-to-cart.svg" alt="">
                    <a href="#" class="" data-id="1">Add to Cart</a>
        </div>
        <div class="info-card">
                        <h2>${plato.category}</h2>
                        <p class="sub-titulo">${plato.name}</p>
                        <p class="precio"><span class="">$${plato.price}</span></p>
        </div>    
        `;
        contenedor.appendChild(card);
    });
}    

document.addEventListener('DOMContentLoaded', iniciarApp);