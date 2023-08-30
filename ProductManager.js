const fs = require("fs")

class ProductManager {
    constructor(path) {
        this.id = 1
        this.path = path
    }

    async addProduct(newProduct) {
        // crearse con un id autoincrementable
        newProduct.id = this.id
        this.id = this.id + 1

        const productos = await this.getProducts()
        productos.push(newProduct)
        const contenido = JSON.stringify(productos)
        await fs.promises.writeFile(this.path, contenido)
    }

    async getProducts() {
        const data = await fs.promises.readFile(this.path, 'utf8')
        const productos = JSON.parse(data)
        return productos
    }

    async getProductById(productId) {
        const productos = await this.getProducts()
        const productoEncontrado = productos.find(p => p.id === productId)

        if (!productoEncontrado) {
            return "Error: Este producto no existe"
        }

        return productoEncontrado
    }

    async updateProduct(productId, productoActualizado) {
        const productos = await this.getProducts()
        const productosActualizados = productos.map(p => {
            if (p.id == productId) {
                return {
                    ...productoActualizado,
                    id: p.id
                }
            } else {
                return p
            } 
        })

        const contenido = JSON.stringify(productosActualizados)
        await fs.promises.writeFile(this.path, contenido)
    }

    async deleteProduct(productId) {
        const productos = await this.getProducts()
        const productosActualizados = productos.filter( p => p.id !== productId)

        const contenido = JSON.stringify(productosActualizados)
        await fs.promises.writeFile(this.path, contenido)
    }
}

/*
 * ejecucion de la clase
*/


async function pruebas() {
    const Carrito = new ProductManager("./productos.txt")
    // agregar un producto y validar
    const pantalon = {
        title: "Pantalon",
        description: "Manga larga",
        price: 120,
        thumbnail: "pantalon.png",
        code: "abc1234",
        stock: 10
    }

    await Carrito.addProduct(pantalon)

    const productosNuevos = await Carrito.getProducts()
    console.log("crear", productosNuevos )

    // buscar producto por id
    const buscar = await Carrito.getProductById(1)
    console.log("buscar por id", buscar )

    // actualizar producto
    const productoActualizado = {
        title: "Pantalon",
        description: "Pantalon jean tipo vaquero",
        price: 150,
        thumbnail: "pantalon.png",
        code: "abc1234",
        stock: 10
    }
    await Carrito.updateProduct(1, productoActualizado)
    const actualizar = await Carrito.getProducts()
    console.log("actualizar", productosNuevos )
    
    // eliminar producto
    await Carrito.deleteProduct(1)
    const eliminados = await Carrito.getProducts()
    console.log("productosEliminados", eliminados)
}

pruebas()