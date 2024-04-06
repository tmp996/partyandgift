const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // ssl: {
  //   rejectUnauthorized: true
  // }
});

// Prueba de conexión directa
pool.connect()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

  cloudinary.config({
    cloud_name: 'dqy0f7skk',
    api_key: '626754323673753',
    api_secret: 'eZMydSf0i92LcK3EOdmgwMAEUbU'
  });

// Función para obtener un usuario por correo electrónico
const getUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0]; // Devuelve el primer usuario encontrado
  } catch (error) {
    console.error('Error al obtener el usuario por correo electrónico:', error);
    throw error;
  }
};

// Función para crear un nuevo usuario
const createUser = async (email, password) => {
  try {
    // Se incluye el campo 'role' en la consulta y se asigna 'user' como valor predeterminado
    const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)';
    // 'user' se pasa como tercer argumento en el arreglo de valores
    await pool.query(query, [email, password, 'user']);
  } catch (error) {
    console.error('Error al crear un nuevo usuario:', error);
    throw error;
  }
};

// Función para crear un nuevo empleado
const createemployee = async (email, password, nombre, apellido, cargo, role) => {
  try {
    // Se incluye el campo 'role' en la consulta
    const query = 'INSERT INTO employee (email, password, nombre, apellido, cargo, role) VALUES ($1, $2, $3, $4, $5, $6)';
    // Se pasa 'role' como sexto argumento en el arreglo de valores
    await pool.query(query, [email, password, nombre, apellido, cargo, role]);
  } catch (error) {
    console.error('Error al crear un nuevo empleado:', error);
    throw error;
  }
};

// Función para obtener un empleado por correo electrónico
const getEmpleadoByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM employee WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0]; // Devuelve el primer empleado encontrado
  } catch (error) {
    console.error('Error al obtener el empleado por correo electrónico:', error);
    throw error;
  }
};

// Función para actualizar la contraseña del usuario en la base de datos
async function updateUserPassword(userId, newPassword) {
  try {
    const query = 'UPDATE users SET password = $1 WHERE id = $2';
    await pool.query(query, [newPassword, userId]);
  } catch (error) {
    throw new Error('Error al actualizar la contraseña del usuario');
  }
}

// Función para crear la tabla de categorías
async function crearTablaCategorias() {
  const query = 'CREATE TABLE categorias (category_id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)';
  await pool.query(query);
}

// Función para insertar categorías de ejemplo
async function insertarCategorias() {
  const query = "INSERT INTO categorias (name, description) VALUES ('Decoración de fiestas', 'Productos para decorar fiestas y celebraciones'), ('Accesorios para photocall', 'Accesorios divertidos para sesiones de fotos'), ('Artículos para eventos especiales', 'Productos para eventos temáticos y especiales')";
  await pool.query(query);
}

const obtenerCategorias = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM categorias');
    return result.rows; // Se asume que la tabla se llama 'categorias'
  } finally {
    client.release();
  }
};

// Función para crear la tabla de productos
async function crearTablaProductos() {
  const query = 'CREATE TABLE productos (product_id SERIAL PRIMARY KEY, category_id INTEGER REFERENCES categorias(category_id), name VARCHAR(100) NOT NULL, description TEXT, price NUMERIC(8,2) NOT NULL, stock INTEGER NOT NULL, image_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)';
  await pool.query(query);
}

// Función para crear un nuevo producto
async function insertarProducto(category_id, name, description, price, stock, image_url) {
  const query = 'INSERT INTO productos (category_id, name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [category_id, name, description, price, stock, image_url];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Devuelve el primer registro insertado
}

// Función para obtener una página de productos paginados
const obtenerProductosPorPagina = async (pagina, productosPorPagina) => {
  try {
    const offset = (pagina - 1) * productosPorPagina;
    const query = `SELECT * FROM productos ORDER BY product_id OFFSET $1 LIMIT $2`;
    const { rows } = await pool.query(query, [offset, productosPorPagina]);
    return rows;
  } catch (error) {
    console.error('Error al obtener la lista de productos por página:', error);
    throw error;
  }
};

// Función para obtener todos los productos sin paginación
const obtenerTodosLosProductos = async () => {
  try {
    const query = `SELECT * FROM productos ORDER BY product_id`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener la lista de todos los productos:', error);
    throw error;
  }
};

// Función para obtener productos por categoria
const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const query = `SELECT * FROM productos WHERE category_id = $1`;
    const { rows } = await pool.query(query, [categoria]);
    return rows;
  } catch (error) {
    console.error('Error al obtener la lista de productos por categoría:', error);
    throw error;
  }
};

// Función para obtener los productos más recientes en PostgreSQL
const obtenerProductosRecientes = async (limit) => {
  try {
    const query = `SELECT * FROM productos ORDER BY created_at DESC LIMIT ${limit}`;
    const { rows } = await pool.query(query);

    return rows;
  } catch (error) {
    console.error('Error al obtener los productos recientes:', error);
    throw error;
  }
};

// Función para actualizar un producto por su ID
const actualizarProducto = async (idProducto, camposActualizados) => {
  const { category_id, name, description, price, stock, image_url } = camposActualizados;
  try {
    const query = 'UPDATE productos SET category_id = $1, name = $2, description = $3, price = $4, stock = $5, image_url = $6 WHERE product_id = $7';
    await pool.query(query, [category_id, name, description, price, stock, image_url, idProducto]);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};

// Función para eliminar un producto por su ID
const eliminarProducto = async (idProducto) => {
  try {
    const query = 'DELETE FROM productos WHERE product_id = $1';
    await pool.query(query, [idProducto]);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error;
  }
};

// Función para obtener un producto por su ID
const obtenerProductoPorId = async (idProducto) => {
  try {
    const query = 'SELECT * FROM productos WHERE product_id = $1'; // Utiliza un parámetro de consulta para evitar SQL injection
    const { rows } = await pool.query(query, [idProducto]);
    // Si no se encuentra ningún producto con el ID dado, retorna null
    if (rows.length === 0) {
      return null;
    }
    // Devuelve el primer producto encontrado (debería ser único ya que el ID es único)
    return rows[0];
  } catch (error) {
    console.error('Error al obtener el producto por ID:', error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const email = 'admin@admin.com';
    const password = 'party20and24gift';
    const nombre = 'admin';
    const apellido = 'admin';
    const cargo = 'admin';
    const role = 'admin';

    // Check if the admin user already exists
    const existingAdmin = await pool.query('SELECT * FROM employee WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      console.log('El usuario administrador predeterminado ya existe');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the default admin user
    const query = 'INSERT INTO employee (email, password, nombre, apellido, cargo, role) VALUES ($1, $2, $3, $4, $5, $6)';
    await pool.query(query, [email, hashedPassword, nombre, apellido, cargo, role]);

    console.log('Usuario administrador predeterminado creado con éxito');
  } catch (error) {
    console.error('Error al crear el usuario administrador predeterminado:', error);
  }
};

// Función para crear envio de pedido
const createaddress = async (nombre, apellido, direccion, ciudad, email, telefono, id_orders) => {
  try {
    const query = 'INSERT INTO addresses (nombre, apellido, direccion, ciudad, email, telefono, id_orders) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    await pool.query(query, [nombre, apellido, direccion, ciudad, email, telefono, id_orders]);
  } catch (error) {
    console.error('Error al enviar la direccion de pedido:', error);
    throw error;
  }
};

// Función para insertar un producto en el carrito
const agregarAlCarrito = async (userId, productId, quantity) => {
  try {
    // Verifica si el carrito existe para el usuario
    const cartQuery = 'SELECT cart_id FROM cart WHERE user_id = $1';
    const { rows: cartRows } = await pool.query(cartQuery, [userId]);

    let cartId;
    if (cartRows.length === 0) {
      // Si el carrito no existe, crea uno nuevo
      const createCartQuery = 'INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id';
      const { rows: newCartRows } = await pool.query(createCartQuery, [userId]);
      cartId = newCartRows[0].cart_id;
    } else {
      cartId = cartRows[0].cart_id;
    }

    // Inserta el producto en el carrito
    const insertQuery = 'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, (SELECT price FROM productos WHERE product_id = $2))';
    await pool.query(insertQuery, [cartId, productId, quantity]);
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    throw error;
  }
};

const obtenerCarritoPorUsuario = async (userId) => {
  try {
    const query = `
      SELECT ci.item_id, ci.quantity, p.product_id, p.name, p.description, p.price, p.image_url,
             a.address_line1, a.address_line2, a.city, a.postal_code, a.phone
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.cart_id
      JOIN productos p ON ci.product_id = p.product_id
      LEFT JOIN addresses a ON c.user_id = a.user_id
      WHERE c.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener el carrito por usuario:', error);
    throw error;
  }
};


const guardarDireccionUsuario = async (userId, direccion) => {
  try {
    const { address_line1, address_line2, city, postal_code, phone } = direccion;
    const query = `
      INSERT INTO addresses (user_id, address_line1, address_line2, city, postal_code, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) DO UPDATE
      SET address_line1 = $2, address_line2 = $3, city = $4, postal_code = $5, phone = $6
      RETURNING *;
    `;
    const values = [userId, address_line1, address_line2, city, postal_code, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al guardar la dirección del usuario:', error);
    throw error;
  }
};



// database.js
const obtenerDireccionUsuario = async (userId) => {
  try {
    const query = `
      SELECT address_line1, address_line2, city, postal_code, phone
      FROM addresses
      WHERE user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null; // Devuelve null si no se encuentra una dirección
  } catch (error) {
    console.error('Error al obtener la dirección del usuario:', error);
    throw error;
  }
};

const actualizarDireccionUsuario = async (userId, direccion) => {
  try {
    const { address_line1, address_line2, city, postal_code, phone } = direccion;
    const query = `
      UPDATE addresses
      SET address_line1 = $1, address_line2 = $2, city = $3, postal_code = $4, phone = $5
      WHERE user_id = $6
      RETURNING address_line1, address_line2, city, postal_code, phone;
    `;
    const values = [address_line1, address_line2, city, postal_code, phone, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar la dirección del usuario:', error);
    throw error;
  }
};

// Función para eliminar un producto del carrito
const eliminarDelCarrito = async (userId, itemId) => {
  try {
    // Verifica si el carrito existe para el usuario
    const cartQuery = 'SELECT cart_id FROM cart WHERE user_id = $1';
    const { rows: cartRows } = await pool.query(cartQuery, [userId]);

    if (cartRows.length === 0) {
      throw new Error('El carrito no existe para este usuario');
    }

    const cartId = cartRows[0].cart_id;

    // Elimina el producto del carrito
    const deleteQuery = 'DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2';
    await pool.query(deleteQuery, [cartId, itemId]);
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    throw error;
  }
};


// Función para actualizar la cantidad de un producto en el carrito
const actualizarCantidadEnCarrito = async (userId, itemId, newQuantity) => {
  try {
    // Verifica si el carrito existe para el usuario
    const cartQuery = 'SELECT cart_id FROM cart WHERE user_id = $1';
    const { rows: cartRows } = await pool.query(cartQuery, [userId]);

    if (cartRows.length === 0) {
      throw new Error('El carrito no existe para este usuario');
    }

    const cartId = cartRows[0].cart_id;

    // Actualiza la cantidad del producto en el carrito
    const updateQuery = 'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND item_id = $3';
    await pool.query(updateQuery, [newQuantity, cartId, itemId]);
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    throw error;
  }
};






module.exports = {
  getUserByEmail,
  getEmpleadoByEmail,
  createemployee,
  createUser,
  updateUserPassword,
  crearTablaCategorias,
  insertarCategorias,
  obtenerCategorias,
  crearTablaProductos,
  insertarProducto,
  obtenerProductosPorPagina,
  obtenerTodosLosProductos,
  createDefaultAdmin,
  obtenerProductoPorId,
  actualizarProducto,
  createaddress,
  eliminarProducto,
  agregarAlCarrito,
  obtenerCarritoPorUsuario,
  guardarDireccionUsuario,
  obtenerDireccionUsuario,
  actualizarDireccionUsuario,
  obtenerProductosPorCategoria,
  obtenerProductosRecientes,
  eliminarDelCarrito,
  actualizarCantidadEnCarrito,
};