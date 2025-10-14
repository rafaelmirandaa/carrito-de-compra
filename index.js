 let productos = [];

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
document.addEventListener('DOMContentLoaded', iniciarApp);