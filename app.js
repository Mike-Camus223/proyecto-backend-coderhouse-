import express from 'express';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartsManager.js';


const app = express();

app.use(express.json());

const productManager = new ProductManager('./data/products.json');
const cartManager = new CartManager('./data/carts.json');

app.get("/", (req, res)=> {
  res.send("Bienvenido a mi API coderhouse!");
});

// --------------- API DE PRODUCTOS ------------------ //

// Get todos los productos

app.get('/api/products', async (req, res) => {
  try {
    const products = await productManager.GetProducts();
    res.status(200).json({ message: 'Lista de productos', products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get producto por id

app.get('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await productManager.GetProducts();
    const product = products.find(p => p.code === pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post nuevo producto

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await productManager.AddProduct(newProduct);
    res.status(201).json({ message: 'Producto añadido con éxito', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Put actualizar producto

app.put('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;
    const updated = await productManager.setProductsByid(pid, updates);
    res.status(200).json({ message: 'Producto actualizado correctamente', updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete del producto

app.delete('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await productManager.deleteProduct(pid);
    res.status(200).json({ message: 'Producto eliminado', products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ---------------- API DE CARRITOS ------------------ //

// Post crear carrito
app.post('/api/carts', async (req, res) => {
  try {
    const cart = await cartManager.CreateCart();
    res.status(201).json({ message: 'Carrito creado con éxito', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get productos de un carrito

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.GetCartByID(cid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post agregar producto a un carrito

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductstoCart(cid, pid);
    res.status(200).json({ message: 'Producto agregado al carrito', updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --------------- Correr el server --------------- //

app.listen(8080, () => {
  console.log("Servidor en línea correctamente!");
});
