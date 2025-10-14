function iniciarApp(){

    obtenerDatos();

    function obtenerDatos(){
        const datos = "/data.json";
        fetch(datos)
            .then((respuesta)=> respuesta.json())
            .then((datos) =>{
                console.log(datos);
            })
            .catch((error) => {
                console.error("No me puedo conectar");
            });
    }
    function leerDatosPlatos(platos){
        const infoplatos = {
            imagen:platos.querryselector('img').src,
            name:platos.querryselector('h2').textContent
        }
            console.log(infoplatos);
    }


}    
document.addEventListener('DOMContentLoaded', iniciarApp);