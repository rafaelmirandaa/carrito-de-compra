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
       const contenedor = document.querySelector('.filas');
       const plantilla = document.querySelector('.card-template');
        
    productos.forEach((plato) => {
  const card = plantilla.cloneNode(true); // clona todo el HTML
  card.classList.remove('card-template');

  // Ahora buscamos dentro del clon
  card.querySelector('.categoria').textContent = plato.category;
  card.querySelector('.nombre').textContent = plato.name;
  card.querySelector('.precio-span').textContent = `$${plato.price}`;
  
  // Actualizar imágenes
  card.querySelector('source[media="(min-width: 1024px)"]').srcset = plato.image.desktop;
  card.querySelector('source[media="(min-width: 768px)"]').srcset = plato.image.tablet;
  card.querySelector('img').src = plato.image.mobile;
  card.querySelector('img').alt = plato.name;

        contenedor.appendChild(card);
    });



















}    
document.addEventListener('DOMContentLoaded', iniciarApp);