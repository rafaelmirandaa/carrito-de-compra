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

// Leer info del plato
function leerplatos(card){
    const infoPlato = {
        imagen : card.querySelector('img')?.src || '',
        titulo : card.querySelector('.name')?.textContent || 'Plato',
        precio : parseFloat(card.closest('.producto').querySelector('.price').textContent.replace('$','')) || 0,
        id : parseInt(card.querySelector('button').dataset.id),
        cantidad : 1
    };
    return infoPlato;
}

// Agregar plato al carrito y manejar contador
function agregarPlato(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const card = e.target.closest('.card-contenido');
        const boton = e.target;
        const id = parseInt(boton.dataset.id);

        // Leer info del plato
        const platoSeleccionado = leerplatos(card);
        let item = articulosCarrito.find(p => p.id === id);

        if(!item){
            articulosCarrito.push({...platoSeleccionado, cantidad: 1});
            item = articulosCarrito.find(p => p.id === id);
        }

        // Cambiar el botón a contador
        boton.classList.remove('agregar-carrito');
        boton.innerHTML = `
            <button class="btn-minus">-</button>
            <span class="quantity">${item.cantidad}</span>
            <button class="btn-plus">+</button>
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
                articulosCarrito = articulosCarrito.filter(p => p.id !== id);
                boton.innerHTML = `<img src="/assets/images/icon-add-to-cart.svg" alt=""> Add to Cart`;
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
function eliminarPlato(e){
    e.preventDefault();
    const boton = e.target.closest('.borrar-plato');
    if(boton){
        const platoid = parseInt(boton.dataset.id);
        const plato = articulosCarrito.find(p => p.id === platoid);
        if(plato){
            plato.cantidad -= 1;
            if(plato.cantidad <= 0){
                articulosCarrito = articulosCarrito.filter(p => p.id !== platoid);
                // Restaurar botón en card si existe
                const cardBoton = document.querySelector(`.producto [data-id="${platoid}"]`);
                if(cardBoton && !cardBoton.classList.contains('agregar-carrito')){
                    cardBoton.innerHTML = `<img src="/assets/images/icon-add-to-cart.svg" alt=""> Add to Cart`;
                    cardBoton.classList.add('agregar-carrito');
                }
            }
            carritoHTML();
            actualizarContadorCarrito();
            cuentaTotal();
        }
    }
}

// Calcular total del carrito
function cuentaTotal(){
    const carritoTotalDiv = document.querySelector('.carrito-total');
    const totalElemento = document.querySelector('#total-carrito');
    if (!carritoTotalDiv || !totalElemento) return;

    if (articulosCarrito.length === 0) {
        carritoTotalDiv.style.display = 'none';
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
            </div>
            <div class="carrito-mensaje">
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
document.addEventListener('DOMContentLoaded', iniciarApp);
cargarEventListeners();
