let productos = [];
let articulosCarrito = [];
const carrito = document.querySelector('#carrito');
const carrito_contenedor = document.querySelector('#carrito-contenedor');
const listaplatos = document.querySelector('#lista-platos');


// Iniciar app
function iniciarApp(){
    carritoHTML();
    obtenerDatos();
}
// Obtener datos de JSON
function obtenerDatos(){
    fetch("/data.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            productos = datos;
            llenarCards();
        })
        .catch(error => console.error("No me puedo conectar"));
}
// Llenar los cards con los datos
function llenarCards(){
    const cards = document.querySelectorAll('.producto');
    cards.forEach((card, index) => {
        const producto = productos[index];
        if(!producto) return;

        // Imágenes que traigo del JSON
        card.querySelector('.img-desktop').srcset = producto.image.desktop;
        card.querySelector('.img-tablet').srcset = producto.image.tablet;
        card.querySelector('.img-mobile').src = producto.image.mobile;
        card.querySelector('.img-mobile').alt = producto.name;

        //Todo el texto
        card.querySelector('.category').textContent = producto.category;
        card.querySelector('.name').textContent = producto.name;
        card.querySelector('.price').textContent = `$${producto.price.toFixed(2)}`;
        
    });
}
// Leer info del plato
function leerplatos(card) {
    const cardContainer = card.closest('.producto'); // se pone en el contenedor principal

    const tituloElem = cardContainer.querySelector('.name');
    const precioElem = cardContainer.querySelector('.price');

    const infoPlato = {
        imagen: cardContainer.querySelector('img')?.src || '',
        titulo: tituloElem ? tituloElem.textContent.trim() : '',
        precio: precioElem ? parseFloat(precioElem.textContent.replace('$','')) : 0,
        id: parseInt(cardContainer.querySelector('button')?.dataset.id) || 0,
        cantidad: 1
    };
    return infoPlato;
}
// Agregar plato al carrito y manejar contador
function agregarPlato(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const card = e.target.closest('.card-contenido');
        const boton = e.target;
        const border = card.querySelector('img');
        const id = parseInt(boton.dataset.id);

        // Leer info del plato
        const platoSeleccionado = leerplatos(card);
        let item = articulosCarrito.find(plato => plato.id === id);

        if(!item){
            articulosCarrito.push({...platoSeleccionado, cantidad: 1});
            item = articulosCarrito.find(plato => plato.id === id);
        }
        
       // Cambiar el botón a contador y aplicar fondo naranja
        border.style.border = "4px solid #CF370D";
        boton.classList.remove('agregar-carrito');
        boton.classList.add('activo'); // fondo naranja
        boton.innerHTML = `
            <spam class="btn-minus">-</spam>
            <span class="quantity">${item.cantidad}</span>
            <span class="btn-plus">+</span>
        `;
        const quantitySpan = boton.querySelector('.quantity');

        // Botón +
        boton.querySelector('.btn-plus').onclick = () => {
            item.cantidad++;
            quantitySpan.textContent = item.cantidad;
            carritoHTML();
            actualizarContadorCarrito();
            cuentaTotal();
        };

        // Botón -
        boton.querySelector('.btn-minus').onclick = () => {
            item.cantidad--;
            if(item.cantidad <= 0){
                // Volver a estado inicial
                border.style.border = "none";
                articulosCarrito = articulosCarrito.filter(plato => plato.id !== id);
                boton.innerHTML = `<img src="/assets/images/icon-add-to-cart.svg" alt=""> Add to Cart`;
                boton.classList.remove('activo'); // quitar fondo naranja
                boton.classList.add('agregar-carrito');
            } else {
                quantitySpan.textContent = item.cantidad;
            }
            carritoHTML();
            actualizarContadorCarrito();
            cuentaTotal();
        };

        // Actualizar carrito y total al agregar
        carritoHTML();
        actualizarContadorCarrito();
        cuentaTotal();
    }
}
// Eliminar plato desde carrito
function eliminarPlato(e) {
    e.preventDefault(); // evita el salto de página
    const boton = e.target.closest('.borrar-plato'); // selecciona el botón eliminar

    if (boton) {
        const platoid = parseInt(boton.dataset.id); // obtiene el ID del plato

        // Elimina solo el plato con ese ID
        articulosCarrito = articulosCarrito.filter(p => p.id !== platoid);

        // Restaura el botón en la card original del producto
        const cardBoton = document.querySelector(`.producto [data-id="${platoid}"]`);
        
        if (cardBoton) {
            cardBoton.innerHTML = `<img src="/assets/images/icon-add-to-cart.svg" alt=""> Add to Cart`;
            cardBoton.classList.add('agregar-carrito');

            cardBoton.classList.remove('activo');
            cardBoton.style.backgroundColor = ''; 
            // Busca la imagen dentro de la card del producto
            const card = cardBoton.closest('.producto');
            const img = card ? card.querySelector('img') : null;
            if (img) {
                img.style.border = "none"; // 🔸 ahora sí se borra correctamente
            }
        }

        // Actualiza la interfaz
        carritoHTML();
        actualizarContadorCarrito();
        cuentaTotal();
    }
}
// Calcular total del carrito
function cuentaTotal(){
    const carritoTotalDiv = document.querySelector('.carrito-total');
    const carritoMensaje = document.querySelector('.carrito-mensaje');
    const totalElemento = document.querySelector('#total-carrito');
    if (!carritoTotalDiv || !totalElemento) return;

    if (articulosCarrito.length === 0) {
        carritoTotalDiv.style.display = 'none';
        if (carritoMensaje) carritoMensaje.style.display = 'none';
        totalElemento.textContent = '0.00';
    } else {
        const totalCarrito = articulosCarrito.reduce((acum, plato) => acum + (plato.precio * plato.cantidad), 0);
        totalElemento.textContent = totalCarrito.toFixed(2);
        carritoTotalDiv.style.display = 'flex';
    }
}
// Actualizar contador del header
function actualizarContadorCarrito() {
    const totalPlatos = articulosCarrito.reduce((acumulador, plato) => acumulador + plato.cantidad, 0);
    const contador = document.querySelector('#cantidad-platos');
    if (contador) contador.textContent = totalPlatos;
}
// Mostrar el carrito en HTML
function carritoHTML(){
    carrito_contenedor.innerHTML = '';

    if(articulosCarrito.length === 0){
        const carrito_vacio = document.createElement('DIV');
        carrito_vacio.classList.add('carrito-vacio');
        carrito_vacio.innerHTML = `
            <div class="imagen-carrito">
                <img src="/assets/images/illustration-empty-cart.svg" alt="Carrito Vacio">
                <p>You added items will appear here</p>
            </div>
        `;
        carrito_contenedor.appendChild(carrito_vacio);
        const contador = document.querySelector('#cantidad-platos');
        if(contador) contador.textContent = 0;
    } else {
        articulosCarrito.forEach(plato => {
            const fila = document.createElement('DIV');
            fila.classList.add('item-carrito');
            fila.innerHTML = `
                <p class="nombre-plato">${plato.titulo}</p>
                <div class="fila-detalle">
                    <p class="cantidad-plato">${plato.cantidad}x</p>
                    <p class="valor-unitario">@$${plato.precio.toFixed(2)}</p>
                    <p class="valor-total">$${(plato.cantidad * plato.precio).toFixed(2)}</p>
                    <a href="#" class="borrar-plato" data-id="${plato.id}">
                        <img src="/assets/images/icon-remove-item.svg" alt="Borrar Plato">
                    </a>
                </div>  
            `;
            carrito_contenedor.appendChild(fila);
        });
    }
}
// Escuchar eventos
function cargarEventListeners(){
    listaplatos.addEventListener('click', agregarPlato);
    carrito.addEventListener('click', eliminarPlato);
}
// Iniciar app y listeners
document.addEventListener('DOMContentLoaded', ()=>{
    iniciarApp() 
    cargarEventListeners();
});

