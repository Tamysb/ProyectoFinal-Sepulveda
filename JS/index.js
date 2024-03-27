const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'e151bfcce1msh62dc157c9493e5ep187439jsn3e19e5f5912f',
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
	}
};

//OBTENER ELEMENTOS 
function obtenerElementosCarritoDesdeLocalStorage (){
    const elementosCarritoGuardados = localStorage.getItem('elementosCarrito');
    return elementosCarritoGuardados ? JSON.parse(elementosCarritoGuardados) : [];
 }
// GUARDAR ELEMNENTOS

function guardarElementosCarritoEnLocalStorage(){
   localStorage.setItem('elementosCarrito', JSON.stringify(elementosCarrito))
}
// OBTENER JUEGOS
async function obtenerJuegos(){
   try {
	const response = await fetch(url, options);
	const result = await response.json();
    const primerosDiezJuegos = result.slice(0,10)
    console.log(result)
    primerosDiezJuegos.forEach(juego =>{
        switch(juego.id){
            case 540:
                juego.precio = 10000;
                break;

            case 521:
                juego.precio = 5000;
                break;
           
            case 517:
                juego.precio = 4500;
                break;
               
            case 516:
                juego.precio = 6200;
                break;
            case  508:
                juego.precio = 7600;
                break;
            case  345:
                juego.precio = 8000;
                break;
            case 516:
                juego.precio = 6000;
                break;
            case  475:
                juego.precio = 3700;
                break;
            case  523:
                juego.precio = 2800;
                break;
            case  340:
                juego.precio = 1800;
                break;
            
            default:
                juego.precio = 0;
                break;
        }
    })
    return primerosDiezJuegos
   } 
   catch (error) {
    console.error(error);
   } 
}
obtenerJuegos()
// CONTENEDOR JUEGOS
async function renderizarJuegos(){
    const contenedorJuegos = document.getElementById('contenedorJuegos');
    const datosJuegos = await obtenerJuegos();

    datosJuegos.forEach(juego => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';

         const titulo = document.createElement('h2');
         titulo.textContent = juego.title;

         const imagen = document.createElement('img');
         imagen.src = juego.thumbnail

         const descripcion = document.createElement('p');
         descripcion.textContent = juego.short_description;
         const precio = document.createElement('p');
         precio.textContent = `precio: $${juego.precio || 'gratis'}`;

         const botonComprar = document.createElement('button');
         botonComprar.textContent = 'comprar';
         botonComprar.addEventListener('click', () => agregarAlCarrito(juego))
    
        tarjeta.appendChild(titulo)
        tarjeta.appendChild(imagen)
        tarjeta.appendChild(descripcion)
        tarjeta.appendChild(precio)
        tarjeta.appendChild(botonComprar)
        
        contenedorJuegos.appendChild(tarjeta);
    
        });
        
}renderizarJuegos()

const elementosCarrito = obtenerElementosCarritoDesdeLocalStorage();
// AGREGAR ELEMENTOS AL CARRITO
function agregarAlCarrito(juego){
    const indice=elementosCarrito.findIndex(item=>item.id===juego.id)
    if (indice===-1){
        elementosCarrito.push({...juego, cantidad:1})
    }
    else{
        elementosCarrito[indice].cantidad++
            
    }
        
    Toastify({
        position: "right",
        text: `${juego.title}$${juego.precio*1.9}`,
        close: true,
            
    }).showToast()
    guardarElementosCarritoEnLocalStorage();
    renderizarCarrito();
}
// ELIMINAR ELEMENTOS DEL CARRITO
function eliminarDelCarrito(idjuego){
    const indice = elementosCarrito.findIndex((item)=>item.id===idjuego);
    
    if(indice!==-1){
        elementosCarrito.splice(indice,1)
    }
    guardarElementosCarritoEnLocalStorage();
    renderizarCarrito();
    
}
// CARRITO
const listaCarrito = document.getElementById('listaCarrito');
const totalSpan = document.getElementById('total');
function renderizarCarrito(){
    listaCarrito.innerHTML = '';
    let precioTotal = 0;
    elementosCarrito.forEach(item =>{
        
        const elementoLista = document.createElement('li');
        elementoLista.textContent= `${item.title}(x${item.cantidad})precio iva:$${(item.precio *1.9 )*item.cantidad}`;        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'eliminar';
        btnEliminar.addEventListener('click', () => eliminarDelCarrito(item.id))
        elementoLista.appendChild(btnEliminar);
        listaCarrito.appendChild(elementoLista);
        precioTotal += (item.precio * 1.9) * item.cantidad
    })
    totalSpan.textContent = precioTotal.toFixed(2)
}

function realizarCompra(){
    Swal.fire({
        position: "center",
        icon: "success",
        title: "compra exitosa",
        text: `$${totalSpan.textContent}`,
        showConfirmButton: true,
        
      })
    elementosCarrito.length = 0;
    guardarElementosCarritoEnLocalStorage()
    renderizarCarrito();
}
document.getElementById('btn-comprar').addEventListener('click',realizarCompra);


renderizarCarrito()