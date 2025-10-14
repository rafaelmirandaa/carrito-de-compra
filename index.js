let productos = [];
const carrito = document.querySelector('#carrito');
const listaplatos = document.querySelector('#lista-platos');


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
        precio : plato.querySelector('.precio .price').textContent

    }

    console.log(infoPlato)

}




document.addEventListener('DOMContentLoaded', iniciarApp);