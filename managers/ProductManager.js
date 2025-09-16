import { v4 as uuidv6 } from 'uuid';
import fs from 'fs';


class ProductManager {

    constructor(pathFile) {
        this.pathFile = pathFile;
    }

// metodo de la class que usamos para generar uuidv6 

    generateUuidv6() {
        return uuidv6();
    }


// metodo reutilizable para leer json 

    async ReadDataJson() {
        try {

            const Filedata = await fs.promises.readFile(this.pathFile, 'utf-8');
            return JSON.parse(Filedata);

        } catch (error) {

            throw new Error ('Error no se pudo leer el archivo json' + error.message);
        }
    }

// metodo para añadir productos 

    async AddProduct(newProduct) {
        try {

            //recuperamos los productos gracias al readdatajson 
            const data = await this.ReadDataJson();
            const NewID = this.generateUuidv6();

            // creamos un nuevo producto con la id 
            const product = { code: NewID, ...newProduct };
            data.push(product);

            // cambios guardados 
            await fs.promises.writeFile(this.pathFile, JSON.stringify(data, null, 2), 'utf-8');
            return product
        } catch (error) {
            // errores por si algo sale mal 
            throw new Error('No se pudo agregar el producto' + error.message);
        }
    }

    async GetProducts() {
        try {
            // recuperamos los productos gracias al readdatajson
            const data = await this.ReadDataJson(); 
            return data;
        } catch (error) {
            //error por si no se obtiene el producto
            throw new Error('No se pudo obtener los productos' + error.message);
        }
    }

    async setProductsByid(productId, updateProduct) {
        try {
            // recuperamos los productos otra vez
            const data = await this.ReadDataJson();
            const IndexProduct = data.findIndex( product => product.code === productId );
            if ( IndexProduct === -1 ) throw new Error ('Producto no encontrado');
            data[IndexProduct] = { ...data[IndexProduct], ...updateProduct };

            await fs.promises.writeFile(this.pathFile, JSON.stringify(data, null, 2), 'utf-8');
             return data;
        } catch (error) {
            throw new Error('No se pudo actualizar el producto' + error.message);
        }
    }

    async deleteProduct(productId) {
        try {
            // recuperamos los productos otra vez
            const data = await this.ReadDataJson();
            const filtered = data.filter(product => product.id !== productId);
            await fs.promises.writeFile(this.pathFile, JSON.stringify(filtered, null, 2), 'utf-8');
            return filtered;    
        } catch (error) {
            throw new Error('Ocurrio un error al querer eliminar el producto' + error.message);
        }
    }
}

export default ProductManager;