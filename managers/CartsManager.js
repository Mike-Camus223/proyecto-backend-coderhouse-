import fs from 'fs';
import { v4 as uuidv6 } from 'uuid';

class CartManager {

    constructor(pathFileCart) {
        this.pathFileCart = pathFileCart;
    }

    // metodo de la class que usamos para generar uuidv6 

    generateUuidv6() {
        return uuidv6();
    }

// metodo reutilizable para leer json 


    async readDataJson() {
        try {

            const fileData = await fs.promises.readFile(this.pathFileCart, 'utf-8');
            return JSON.parse(fileData);

        } catch (error) {
            throw new Error('Error inesperado no se pudo leer el archivo json' + error.message);
        }
    }

    async CreateCart() {
        try {

            const data = await this.readDataJson();
            const NewIDCart = this.generateUuidv6();
            const cart = { id: NewIDCart, products: [] };
            data.push(cart);
            await fs.promises.writeFile(this.pathFileCart, JSON.stringify(data, null, 2), 'utf-8');
            return cart;

        } catch (error) {
            throw new Error('Error inesperado no se pudo crear el carrito' + error.message);
        }
    }

    async GetCartByID(CartId) {
        try {

            const data = await this.readDataJson();
            const cart = data.find(cart => cart.id === CartId);
            if (!cart) throw new Error('No se pudo encontrar al carriito');
            return cart

        } catch (error) {
            throw new Error ('Error inesperado no se pudo obtener el carrito');
        }
    }

    async addProductstoCart(CartId, productId) {
        try {
            const data = await this.readDataJson();
            const cartIndex = data.findIndex(cart => cart.id === CartId);
            if (cartIndex === -1) throw new Error('No se encontro el carrito');
            const cart = data[cartIndex];
            const productIndex = cart.products.findIndex(p => p.product === productId);

            if( productIndex !== -1 ) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await fs.promises.writeFile(this.pathFileCart, JSON.stringify(data, null, 2), 'utf-8');
            return cart;

        } catch (error) {
            throw new Error('Error no se pudo agrregar un producto al carrito' + error.message);
        }
    }
}

export default CartManager;