// Productos

class Producto{
    constructor(id,nombre, cantidad, precio){
    this.id=id
    this.nombre = nombre
    this.cantidad = cantidad
    this.precio = precio
    this.precioConIVA = function(){
        let precioIVA = this.precio * 1.9;
        return precioIVA
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

// Carro de Compras
const contenedorProductos = document.getElementById('productos');
const contenedorElementosCarrito = document.getElementById('elementos-carrito');
const totalSpan = document.getElementById('total');
const desc = document.getElementById('descuento')

function renderizarProductos(){
    productos.forEach(producto =>{
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <p>$${producto.precioConIVA()} iva</p>
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
            li.textContent = `${item.nombre} x ${item.cantidad}  - $${item.precio * item.cantidad}-$${(item.precio*1.9)*item.cantidad}`
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
    alert(`compra exitosa $${totalSpan.textContent}`);
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
    
});


window.addEventListener('load',()=> {
    renderizarProductos(),
    renderizarCarrito()
})