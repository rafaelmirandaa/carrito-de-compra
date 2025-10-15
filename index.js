let productos = [];
const carrito = document.querySelector('#carrito');
const carrito_contenedor = document.querySelector('#carrito');
const listaplatos = document.querySelector('#lista-platos');
let articulosCarrito = [];


function iniciarApp(){
    obtenerDatos();
}
     function obtenerDatos(){
        const rutas = "/data.json";
        fetch(rutas)
            .then((respuesta)=> respuesta.json())
            .then((datos) =>{
                productos = datos;
                llenarCards();
            })
            .catch((error) => {
                console.error("No me puedo conectar");
            });
    }

    function llenarCards(){
        const cards = document.querySelectorAll('.producto'); // tomamos el producto correspondiente
            
            cards.forEach((card, index) => {
                const producto = productos[index]; // tomamos el producto correspondiente
                 if (!producto) return;

            // Imágenes
            card.querySelector('.img-desktop').srcset = producto.image.desktop;
            card.querySelector('.img-tablet').srcset = producto.image.tablet;
            card.querySelector('.img-mobile').src = producto.image.mobile;
            card.querySelector('.img-mobile').alt = producto.name;

            // Textos
            card.querySelector('.category').textContent = producto.category;
            card.querySelector('.name').textContent = producto.name;
            card.querySelector('.price').textContent = `$${producto.price}`;
    });
    }        
    cargarEventListeners();
    function cargarEventListeners(){
        //cuando agregas un plato prsionando Add to Cart
        listaplatos.addEventListener('click', agregarPlato);
       
        
    }

//Funciones
function agregarPlato(e){ //colocamos e para que con el e.target ver donde estamosdando click
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const platosSeleccionado = e.target.parentElement.parentElement;

        leerplatos(platosSeleccionado);
    }
    
}

//lee el contenido de HTML
function leerplatos(plato){
   //console.log(plato);

    //crear objeto con el contenido del plato 
    const infoPlato = {
        imagen : plato.querySelector('img').src,
        titulo : plato.querySelector('.name').textContent,
        precio : parseFloat(plato.querySelector('.precio .price').textContent.replace('$', '')),
        id : plato.querySelector('button').getAttribute('data-id'),
        cantidad : 1
    }

    //console.log(infoPlato)
    //Agrega elemeentos del carrito
    articulosCarrito = [...articulosCarrito, infoPlato];

   console.log(articulosCarrito);
   carritoHTML();
}

//Muestra el Carrito de compras en el HTML
function carritoHTML(){
    //limpia el contenedor antes de llenarlo
    carrito_contenedor.innerHTML = '';

    articulosCarrito.forEach(carrito =>{
        const fila = document.createElement('DIV');
        fila.classList.add('item-carrito')

        fila.innerHTML = `
        <p class="nombre-plato">${carrito.titulo}</p>
        <p class="cantidad-plato">${carrito.cantidad}x</p>
        <p>$${carrito.precio.toFixed(2)}</p>
        <p>$${(carrito.cantidad * carrito.precio).toFixed(2)}</p>
        <a href="#" class="borrar-curso" data-id="${carrito.id}">
            <img src="/assets/images/icon-remove-item.svg" alt="X">
        </a>
        <hr>
        
        `;

        //Agregar el HTML del carrito en el DIV
        carrito_contenedor.appendChild(fila);
    })



}






document.addEventListener('DOMContentLoaded', iniciarApp);