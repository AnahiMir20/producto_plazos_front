var productSKU
var plazos

function validateText(valor) {
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        return false;
    }
    else {
        return true
    }
}

async function getPlazos() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/deadlines", requestOptions)
        .then(response => response.json())
        .then((result) => {
            console.log(result[0])
            plazos = result[0];
        })
        .catch(error => console.log('error', error));
}

async function getProducts() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/products", requestOptions)
        .then(response => response.json())
        .then(result => showProducts(result[0]))
        .catch(error => console.log('error', error));
}

function showProducts(products) {
    products.forEach(producto => {
        console.log(producto)


        let productox = `
    <div class="block product no-border z-depth-2-top z-depth-2--hover">
    <div class="block-image">
        <a href="#">
            <img src="img/play.jpg" class="img-center">
        </a>
        <span class="product-ribbon product-ribbon-right product-ribbon--style-1 bg-blue text-uppercase">New</span>
    </div>
    <div class="block-body text-center">
        <h3 class="heading heading-5 strong-600 text-capitalize">
            <a href="#">
               ${producto.name}
            </a>
        </h3>
        <p class="product-description">
            ${producto.description} $${producto.price} SKU:${producto.SKU}
        </p>
        <div class="product-buttons mt-4">
            <div class="row align-items-center"> 
            <div class="col-4">
            <button type="button"  onclick=editProduct(${producto.SKU}) class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Editar
        </button>
                </div>
                <div class="col-4">
                    <button type="button" onclick=deleteProduct(${producto.SKU}) class="btn btn-block btn-danger btn-circle btn-icon-left">
                        Eliminar
                    </button>
                </div>
                <div class="col-4">
                <button type="button"  onclick=seeProduct(${producto.SKU},"${producto.name}",${producto.price}) class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                Ver plazos
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`;

        let productoHTML = document.createElement('div');
        // productoHTML.classList.add('contenedor-producto', 'col-xl-3', 'col-md-4', 'col-sm-6', 'Secondary')
        productoHTML.classList.add('col-md-6')

        productoHTML.innerHTML += productox;
        document.getElementById('productosInternos').appendChild(productoHTML);
    });
}


const editProduct = (id) => {
    productSKU = id;
}

async function actualizarProductoPut() {
    console.log(productSKU)
    editarPrecio = document.getElementById('editarPrecio').value;
    console.log(editarPrecio)
    if (editarPrecio) {
        console.log("editando")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "SKU": productSKU,
            "price": editarPrecio
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/products/update", requestOptions)
            .then(response => response.text())
            .then((result) => {
                console.log(result)
                alert("Actualizado")
                location.reload();
            })
            .catch(error => console.log('error', error));
    }
    else {
        alert("Favor de ingresar un numero valido")

    }
}

async function deleteProduct(SKU) {
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/products/delete/" + SKU, requestOptions)
        .then(response => response.text())
        .then((result) => {
            console.log(result)
            location.reload();
        })
        .catch(error => console.log('error', error));
}

const seeProduct = (SKU, name, price) => {
    console.log(SKU, name, price)
    let plazoTML = document.createElement('ul');
    $("#listaPlazos").empty()
    $("#nombrePlazos").empty()
    $("#nombrePlazos").append(name)
    $("#precioPlazos").empty()
    $("#precioPlazos").append(`$${price}`)
    $("#listaPlazos").append('<li class="list-group-item">Tipo de Pago: Abono Normal o Abono Puntual </li>')
    plazoTML.classList.add('list-group')
    plazos.forEach(plazo => {
        console.log(plazo)


        let plazox = `
        <li class="list-group-item"> A ${plazo.weeks} Semanas $${((plazo.normal_rate * price) + (price / plazo.weeks)).toFixed(3)} o $${((plazo.punctual_rate * price) + (price / plazo.weeks)).toFixed(3)} </li>
   `;


        plazoTML.innerHTML += plazox;
        document.getElementById('listaPlazos').appendChild(plazoTML);
    });
    // productSKU = producto;
}

async function crearProducto() {

    crearSKU = document.getElementById('crearSKU').value;
    crearNombre = document.getElementById('crearNombre').value;
    crearDescripcion = document.getElementById('crearDescripcion').value;
    crearPrecio = document.getElementById('crearPrecio').value;
    if (!crearSKU) {
        alert("se necesita el SKU")
    }
    else if (!validateText(crearNombre)) {
        alert("se necesita un nombre")
    }
    else if (!validateText(crearDescripcion)) {
        alert("se necesita una descripcion")
    }
    else if (!(crearPrecio)) {
        alert("se necesita un precio")
    }
    else {
        console.log(crearSKU, crearNombre, crearDescripcion, crearPrecio)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "SKU": crearSKU,
            "name": crearNombre,
            "description": crearDescripcion,
            "price": crearPrecio
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/products/insert", requestOptions)
            .then(response => response.text())
            .then((result) => {
                console.log(result)
                location.reload();
            })
            .catch(error => console.log('error', error));
    }

}

async function crearPlazo() {

    crearSemana = document.getElementById('crearSemana').value;
    crearNomal = document.getElementById('crearNormal').value;
    crearPuntual = document.getElementById('crearPuntual').value;

    if (!crearSemana) {
        alert("se necesitan las semanas")
    }
    else if (!crearNomal) {
        alert("se necesita una tasa normla")
    }
    else if (!crearPuntual) {
        alert("se necesita una tasa puntual")
    }

    else {
        console.log(crearSemana, crearNomal, crearPuntual)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "weeks": crearSemana,
            "normal": crearNomal,
            "punctual": crearPuntual
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/deadlines/insert", requestOptions)
            .then(response => response.text())
            .then((result) => {
                console.log(result)
                location.reload();
            })
            .catch(error => console.log('error', error));
    }

}

async function buscar() {
    buscarTexto = document.getElementById('buscarTexto').value;
    console.log(buscarTexto, typeof (buscarTexto))
    buscarEntero = parseInt(buscarTexto);
    console.log(buscarTexto, isNaN(buscarEntero))
    if (!validateText) {
        alert("Ingrese un valor")
    }
    else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "find": isNaN(buscarEntero) ? buscarTexto : buscarEntero
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/products/find", requestOptions)
            .then(response => response.json())
            .then(result => showProduct(result[0][0]))
            .catch((error) => {
                console.log('error', error)
                location.reload();
        });
            
    }

}

function showProduct(producto) {
    console.log(producto)
    $("#productosInternos").empty()
    let productox = `
    <div class="block product no-border z-depth-2-top z-depth-2--hover">
    <div class="block-image">
        <a href="#">
            <img src="img/play.jpg" class="img-center">
        </a>
        <span class="product-ribbon product-ribbon-right product-ribbon--style-1 bg-blue text-uppercase">New</span>
    </div>
    <div class="block-body text-center">
        <h3 class="heading heading-5 strong-600 text-capitalize">
            <a href="#">
               ${producto.name}
            </a>
        </h3>
        <p class="product-description">
            ${producto.description} $${producto.price} SKU:${producto.SKU}
        </p>
        <div class="product-buttons mt-4">
            <div class="row align-items-center"> 
            <div class="col-4">
            <button type="button"  onclick=editProduct(${producto.SKU}) class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Editar
        </button>
                </div>
                <div class="col-4">
                    <button type="button" onclick=deleteProduct(${producto.SKU}) class="btn btn-block btn-danger btn-circle btn-icon-left">
                        Eliminar
                    </button>
                </div>
                <div class="col-4">
                <button type="button"  onclick=seeProduct(${producto.SKU},"${producto.name}",${producto.price}) class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                Ver plazos
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`;

    let productoHTML = document.createElement('div');
    // productoHTML.classList.add('contenedor-producto', 'col-xl-3', 'col-md-4', 'col-sm-6', 'Secondary')
    productoHTML.classList.add('col-md-6')

    productoHTML.innerHTML += productox;
    document.getElementById('productosInternos').appendChild(productoHTML);
}

getProducts()
getPlazos()

