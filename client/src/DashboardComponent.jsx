import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

export default function DashboardComponent() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState([]);
  const productsPerPage = 5;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: token,
        },
      });
      const cartItems = response.data;

      // Verificar si el producto ya existe en el carrito
      const existingItem = cartItems.find((item) => item.product_id === productId);

      if (existingItem) {
        toast.info('El producto ya está agregado al carrito');
        setAddedToCart([...addedToCart, productId]);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, { productId }, {
          headers: {
            Authorization: token,
          },
        });
        console.log('Producto agregado al carrito');
        toast.success('Producto agregado al carrito');
        setAddedToCart([...addedToCart, productId]);
      }
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      toast.error('Error al agregar el producto al carrito');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product_list`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
      }
    };
    fetchProducts();
  }, [currentPage]);

  return (
    <div className="bg-white">
      <ToastContainer />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">Productos</h2>

        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {currentProducts.map((product) => (
            <div key={product.product_id} className="border p-4 rounded-lg transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <div className="relative h-72 w-full overflow-hidden rounded-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="relative mt-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                </div>
                <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                  />
                  <p className="relative text-lg font-semibold text-white">{product.price}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => handleAddToCart(product.product_id)}
                  disabled={addedToCart.includes(product.product_id)}
                  className={`relative flex items-center justify-center rounded-md border-transparent px-8 py-2 text-sm font-medium ${addedToCart.includes(product.product_id)
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  {addedToCart.includes(product.product_id) ? (
                    <>
                      Agregado al carrito<span className="sr-only">, {product.name}</span>
                    </>
                  ) : (
                    <>
                      Agregar al carrito<span className="sr-only">, {product.name}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} transition-colors duration-300 hover:bg-blue-600 hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
