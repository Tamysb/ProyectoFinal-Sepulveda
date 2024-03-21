// Productos

class Producto{
    constructor(id,nombre, cantidad, precio){
    this.id=id
    this.nombre = nombre
    this.cantidad = cantidad
    this.precio = precio
    
}   
    IVA(){
        this.IVA = this.precio*1.9
    }
    DESC(){
        if(this.IVA >= 9000){
            this.DESC = (this.IVA-(this.IVA * 0.20))
        }
        else{
            this.DESC = 0
        }
    }
}
const productos=[
    new Producto(1,"producto1", 1, 5000),
    new Producto(2,"producto2", 1, 6000),
    new Producto(3,"producto3", 1, 10000),
    new Producto(4,"producto4", 1, 2000),
    new Producto(5,"producto5",1,3000)
]
for(const producto of productos){
    console.log(producto.IVA())
    console.log(producto.DESC())
}
// Carro de Compras
const contenedorProductos = document.getElementById('productos');
const contenedorElementosCarrito = document.getElementById('elementos-carrito');
const totalSpan = document.getElementById('total');

function renderizarProductos(){
    productos.forEach(producto =>{
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>precio:$${producto.precio}</p>
        <p>precio:$${producto.IVA}(iva incluido)</p>
        <button class="btn-agregar-carrito" data-id="${producto.id}">comprar</button> 
        `;
        contenedorProductos.appendChild(div);
        
    })
}

//agregar al carrito el producto

function agregarAlCarrito(idProducto){
    const elementosCarrito = JSON.parse(localStorage.getItem('carro'))||[];
    const itemExistente = elementosCarrito.find(item => item.id === idProducto);
    
    if(itemExistente){
        
        itemExistente.cantidad++
        
    }else{
        const producto = productos.find(p => p.id === idProducto);
        if(producto){
            elementosCarrito.push({...producto, cantidad:1});

        }
    }
    localStorage.setItem('carro', JSON.stringify(elementosCarrito))
    renderizarCarrito();
}

//eliminar el producto

function eliminarDelCarrito(idProducto){
    const elementosCarrito = JSON.parse(localStorage.getItem('carro'))||[];
    const indice = elementosCarrito.findIndex(item => item.id === idProducto);
    if(indice !== -1){
        elementosCarrito.splice(indice, 1);
    }
    localStorage.setItem('carro', JSON.stringify(elementosCarrito))
    renderizarCarrito()
}

function renderizarCarrito() {
    const elementosCarrito = JSON.parse(localStorage.getItem('carro'))||[];
    contenedorElementosCarrito.innerHTML = '';
    let precioTotal = 0;
    elementosCarrito.forEach(item =>{
            const li = document.createElement('li');
            li.textContent = `${item.nombre} x ${item.cantidad}  - $${item.precio * item.cantidad}-$${(item.IVA)*item.cantidad}-$${(item.DESC)*item.cantidad}`
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'eliminar';
            btnEliminar.addEventListener('click', () => eliminarDelCarrito(item.id))
            li.appendChild(btnEliminar);
            contenedorElementosCarrito.appendChild(li);
            precioTotal += (item.precio * 1.9) * item.cantidad
    })
    totalSpan.textContent = precioTotal;
    localStorage.setItem('carro', JSON.stringify(elementosCarrito))
}

function realizarCompra(){
    const elementosCarrito = JSON.parse(localStorage.getItem('carro'))||[];
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "compra exitosa",
        text: `$${totalSpan.textContent}`,
        showConfirmButton: true,
        
      })
    elementosCarrito.length = 0;
    localStorage.setItem('carro', JSON.stringify(elementosCarrito))
    renderizarCarrito();
}

document.getElementById('btn-comprar').addEventListener('click',realizarCompra);

contenedorProductos.addEventListener('click',function(evento){
    if(evento.target.classList.contains('btn-agregar-carrito')){
            const idProducto = parseInt(evento.target.getAttribute('data-id'));
            agregarAlCarrito(idProducto);
        }
        Toastify({
            position: "right",
            text: `$${totalSpan.textContent}`,
            close: true,
            
          }).showToast()
    
});


window.addEventListener('load',()=> {
    renderizarProductos(),
    renderizarCarrito()
})