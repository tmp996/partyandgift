// Importar las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./utils/database');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Crear una instancia de Express
const app = express();

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// Middleware para analizar solicitudes codificadas en URL
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: '*', // Use the environment variable
  methods: ['GET', 'POST', 'PUT', 'DELETE'],        // Allow specific methods
  credentials: true                 // To allow sending of cookies
}));

// Route for login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Search for the user in the database
  const user = await db.getUserByEmail(email);
  if (!user) {
    return res.status(401).send('User not found');
  }
  // Check the password
  if (bcrypt.compareSync(password, user.password)) {
    let token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '7d' });
    return res.json({ message: 'Successful login', token: token });
  } else {
    return res.status(401).send('Incorrect email or password');
  }
});

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dqy0f7skk',
  api_key: '626754323673753',
  api_secret: 'eZMydSf0i92LcK3EOdmgwMAEUbU'
});

// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // Comprueba si el usuario ya existe en la base de datos
  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).send('El correo electrónico ya está en uso');
  }

  // Crea un nuevo usuario
  const hashedPassword = bcrypt.hashSync(password, 10);
  await db.createUser(email, hashedPassword);
  return res.send('Usuario registrado exitosamente');
});

// Ruta de registro empleado
app.post('/register/empleado', async (req, res) => {
  const { email, password, nombre, apellido, cargo, role } = req.body; // Se obtiene también el campo 'role' del cuerpo de la solicitud

  // Comprueba si el empleado ya existe en la base de datos
  const existingEmpleado = await db.getEmpleadoByEmail(email);
  if (existingEmpleado) {
    return res.status(400).send('El correo electrónico ya está en uso');
  }

  // Crea un nuevo empleado
  const hashedPassword = bcrypt.hashSync(password, 10);
  await db.createemployee(email, hashedPassword, nombre, apellido, cargo, role); // Se pasa el campo 'role' a la función createemployee
  return res.send('Empleado registrado exitosamente');
});


// Ruta para el inicio de sesión de empleados
app.post('/login/empleado', async (req, res) => {
  const { email, password } = req.body;
  // Busca el empleado en la base de datos
  const empleado = await db.getEmpleadoByEmail(email);
  if (!empleado) {
    return res.status(401).send('Empleado no encontrado');
  }
  // Comprueba la contraseña
  if (bcrypt.compareSync(password, empleado.password)) {
    let token = jwt.sign({ id: empleado.id, role: empleado.role }, 'secret key');
    return res.json({ message: 'Inicio de sesión de empleado exitoso', token: token });
  } else {
    return res.status(401).send('Correo electrónico o contraseña incorrectos');
  }
});

// Ruta para obtener todas las categorías
app.get('/categories', async (req, res) => {
  try {
    const categorias = await db.obtenerCategorias();
    res.status(200).json(categorias); // Devuelve todas las categorías
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para registrar un nuevo producto
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/products', upload.single('image'), async (req, res) => {
  const { category_id, name, description, price, stock } = req.body;
  const image = req.file;

  try {
    const result = await cloudinary.uploader.upload(image.path);
    const image_url = result.secure_url;

    const producto = await db.insertarProducto(category_id, name, description, price, stock, image_url);

    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un producto por su ID
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Verifica si el producto con el ID dado existe
    const existingProduct = await db.obtenerProductoPorId(productId);
    if (!existingProduct) {
      return res.status(404).send('Producto no encontrado');
    }

    // Elimina el producto de la base de datos
    await db.eliminarProducto(productId);

    res.status(200).send('Producto eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener un producto por su ID
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  
  try {
    // Busca el producto en la base de datos por su ID
    const product = await db.obtenerProductoPorId(productId);
    
    // Verifica si el producto existe
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    
    // Si el producto existe, lo devuelve en la respuesta
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar un producto por su ID
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { category_id, name, description, price, stock, image_url } = req.body;

  try {
    // Verifica si el producto con el ID dado existe
    const existingProduct = await db.obtenerProductoPorId(productId);
    if (!existingProduct) {
      return res.status(404).send('Producto no encontrado');
    }

    // Actualiza el producto en la base de datos
    await db.actualizarProducto(productId, {
      category_id: category_id || existingProduct.category_id,
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      price: price || existingProduct.price,
      stock: stock || existingProduct.stock,
      image_url: image_url || existingProduct.image_url
    });
    res.status(200).send('Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener los 10 productos registrados o agregados recientemente
app.get('/recent-products', async (req, res) => {
  try {
    // Obtiene los 10 productos más recientes de la base de datos
    const recentProducts = await db.obtenerProductosRecientes(10);

    res.status(200).send(recentProducts);
  } catch (error) {
    console.error('Error al obtener los productos recientes:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener todos los productos de una categoría
app.get('/products/category/:category_id', async (req, res) => {
  const categoryId = req.params.category_id;

  if (!categoryId) {
    return res.status(400).json({ error: 'ID de categoría no proporcionado' });
  }

  try {
    const productos = await db.obtenerProductosPorCategoria(categoryId);

    if (!productos || productos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para la categoría especificada' });
    }

    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).send('Error al obtener los productos por categoría');
  }
});

// Ruta para el envio del formulario del producto
app.post('/register/product', async (req, res) => {
  const { category_id, name, description, price, stock, image_url } = req.body;

  try {
    // Crea un nuevo producto en la base de datos
    const producto = await insertarProducto(category_id, name, description, price, stock, image_url);

    res.status(201).json(producto); // Devuelve el producto creado
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// // Ruta para cambiar la contraseña del usuario
// app.post('/change-password', authenticateToken, async (req, res) => {
//   const { newPassword } = req.body;
//   const userId = req.user.id; // Obtener el ID del usuario del token

//   // Actualizar la contraseña en la base de datos
//   const hashedPassword = bcrypt.hashSync(newPassword, 10);
//   await db.updateUserPassword(userId, hashedPassword);

//   res.send('Contraseña cambiada exitosamente');
// });

// Ruta para obtener la lista de productos
const ITEMS_PER_PAGE = 5;
app.get('/page_product_list', async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;

  try {
    const products = await db.obtenerProductosPorPagina(page, ITEMS_PER_PAGE);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});

// Ruta para obtener la lista de productos
app.get('/product_list', async (req, res) => {
  try {
    const products = await db.obtenerTodosLosProductos();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});




// Ruta para registrar la direccion de pedido
app.post('/order_address', async (req, res) => {
  const { nombre, apellido, direccion, ciudad, email, telefono, id_orders} = req.body;
  
  try {
    // Crea una nueva direccion para el pedido en la base de datos
    await db.createaddress(nombre, apellido, direccion, ciudad, email, telefono, id_orders);
    res.status(201).send('Direccion del pedido agregado exitosamente');
  } catch (error) {
    console.error('Error al registrar direccion de pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

const { verifyToken } = require('./middleware/auth');

app.post('/cart/add', verifyToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;
  try {
    await db.agregarAlCarrito(userId, productId, 1);
    res.status(200).send('Producto agregado al carrito exitosamente');
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener los productos del carrito de un usuario
app.get('/cart', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await db.obtenerCarritoPorUsuario(userId);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/cart/:itemId', verifyToken, async (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.userId;

  try {
    await db.eliminarDelCarrito(userId, itemId);
    res.status(200).send('Producto eliminado del carrito exitosamente');
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/cart/:itemId', verifyToken, async (req, res) => {
  const itemId = req.params.itemId;
  const { quantity } = req.body;
  const userId = req.userId;

  try {
    await db.actualizarCantidadEnCarrito(userId, itemId, quantity);
    res.status(200).send('Cantidad del producto actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});


app.post('/addresses', verifyToken, async (req, res) => {
  const userId = req.userId;
  const direccion = req.body;

  try {
    const direccionGuardada = await db.guardarDireccionUsuario(userId, direccion);
    res.status(200).json(direccionGuardada);
  } catch (error) {
    console.error('Error al guardar la dirección del usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// app.js
app.get('/get_address', verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const direccion = await db.obtenerDireccionUsuario(userId);
    res.status(200).json(direccion);
  } catch (error) {
    console.error('Error al obtener la dirección del usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/edit_address', verifyToken, async (req, res) => {
  const userId = req.userId;
  const direccion = req.body;
  try {
    const direccionActualizada = await db.actualizarDireccionUsuario(userId, direccion);
    res.status(200).json(direccionActualizada);
  } catch (error) {
    console.error('Error al actualizar la dirección del usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(3001, async () => {
  console.log('Server is running on port 3001');
  
  // Create default admin user
  await db.createDefaultAdmin();

});