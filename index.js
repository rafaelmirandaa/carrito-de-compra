let productos = [];
const carrito = document.querySelector('#carrito');
const carrito_contenedor = document.querySelector('#carrito-contenedor');
const listaplatos = document.querySelector('#lista-platos');
let articulosCarrito = [];


function iniciarApp(){
    carritoHTML();
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

        //Eliminar plato del carrito 
        carrito.addEventListener('click', eliminarPlato);
}

//Funciones
function agregarPlato(e){ //colocamos e para que con el e.target ver donde estamosdando click
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const platosSeleccionado = e.target.parentElement.parentElement;

        leerplatos(platosSeleccionado);
    }
}
//elimina platos
function eliminarPlato(e){
     e.preventDefault();
    // Revisar si se hizo click en el botón o el icono de borrar
    const boton = e.target.closest('.borrar-plato');
    if (boton) {
        const platoid = boton.getAttribute('data-id');
        // Buscar el plato en el arreglo
        const plato = articulosCarrito.find(p => p.id === platoid);
        if (plato) {
            // Restar 1 a la cantidad
            plato.cantidad -= 1;
            // Si la cantidad llega a 0, eliminarlo del arreglo
            if (plato.cantidad === 0) {
                articulosCarrito = articulosCarrito.filter(p => p.id !== platoid);

            }
            // Actualizar carrito y contador
            carritoHTML();
            actualizarContadorCarrito(); // Actualiza la cantidad en el encabezado
            cuentaTotal(); 
        }
    }
}
function cuentaTotal(){
    const carritoTotalDiv = document.querySelector('.carrito-total');
    if (!carritoTotalDiv) return;

    if (articulosCarrito.length === 0) {
        // Carrito vacío → ocultar div
        carritoTotalDiv.style.display = 'none';
    } else {
        // Carrito con elementos → calcular total y mostrar div
        const totalCarrito = articulosCarrito.reduce((acum, plato) => acum + (plato.precio * plato.cantidad), 0);
        const totalElemento = document.querySelector('#total-carrito');
        if (totalElemento) {
            totalElemento.textContent = totalCarrito.toFixed(2);
        }
        carritoTotalDiv.style.display = 'block';
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

    //Revisar si el elmento ya existe
    const existe = articulosCarrito.some( plato => plato.id === infoPlato.id);
    if(existe){
    
        //actualizamos la cantidad
        const platos = articulosCarrito.map(plato =>{
            if(plato.id === infoPlato.id){
                plato.cantidad++;
                return plato;
            }else{
                return plato;
            }
        });
        articulosCarrito=[...platos];
    }else{
        articulosCarrito = [...articulosCarrito, infoPlato];
    }
   carritoHTML();
}
//Muestra el Carrito de compras en el HTML
function carritoHTML(){
        //limpia el contenedor antes de llenarlo
        carrito_contenedor.innerHTML = '';

        if(articulosCarrito.length ===0)
         {
    
            const carrito_vacio = document.createElement('DIV');
            carrito_vacio.classList.add('carrito-vacio')

            carrito_vacio.innerHTML =`
                <div class="imagen-carrito">
                    <img src="/assets/images/illustration-empty-cart.svg" alt="Carrito Vacio">
                </div>
                <div class="carrito-mensaje">
                <p>You added items will appear here</p>
                </div>
                

            `;//para comenzar en 0 el contador del carrito
            carrito_contenedor.appendChild(carrito_vacio);
            const contador = document.querySelector('#cantidad-platos');
            if(contador){
                contador.textContent = 0;
            }
        }else{
            articulosCarrito.forEach(carrito =>{
            const fila = document.createElement('DIV');
            fila.classList.add('item-carrito')

            const precioNumero = parseFloat(carrito.precio);

            fila.innerHTML = `
            <p class="nombre-plato">${carrito.titulo}</p>
            <div class="fila-detalle">
                <p class="cantidad-plato">${carrito.cantidad}x</p>
                <p class="valor-unitario">@$${carrito.precio.toFixed(2)}</p>
                <p class="valor-total">$${(carrito.cantidad * precioNumero).toFixed(2)}</p>
                <a href="#"  class="borrar-plato" data-id="${carrito.id}">
                    <img  src="/assets/images/icon-remove-item.svg" alt="Borrar Plato">
                </a>
            </div>  
            `;
            //Agregar el HTML del carrito en el DIV
            carrito_contenedor.appendChild(fila);
            actualizarContadorCarrito();
            cuentaTotal();
        }
    )}
};
function actualizarContadorCarrito() {
    // Sumar todas las cantidades del carrito
    const totalPlatos = articulosCarrito.reduce((acumulador, plato) => {
        return acumulador + plato.cantidad;
    }, 0);

    // Actualizar el elemento del encabezado
    const contador = document.querySelector('#cantidad-platos');
    if (contador) {
        contador.textContent = totalPlatos;
    }
}
document.addEventListener('DOMContentLoaded', iniciarApp);