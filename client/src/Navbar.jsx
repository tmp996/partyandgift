import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HiOutlineDocumentText, HiOutlineShoppingCart, HiUserCircle } from 'react-icons/hi';
import { FaSignOutAlt, FaRegHeart, FaRegSmile, FaRegKiss } from 'react-icons/fa';

function Navbar({ isLoggedIn, handleLogout }) {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);

  const handleCatalogEnter = () => {
    setIsCatalogOpen(true);
  };

  const handleCatalogLeave = () => {
    setIsCatalogOpen(false);
  };

  const handleEventEnter = () => {
    setIsEventOpen(true);
  };

  const handleEventLeave = () => {
    setIsEventOpen(false);
  };

  const handleCategoryClick = () => {
    setIsCatalogOpen(false);
    setIsEventOpen(false);
  };

  return (
    <nav className="mx-auto flex justify-between max-w-7xl items-center gap-x-6 lg:px-8" aria-label="Global">
      <Link to="/dashboard" className="flex items-center gap-x-4">
        <img className="h-16 w-auto" src="./partyandgift.png" alt="" />
        <div className="flex items-center gap-x-1 text-gray-900">
          <span className="text-lg font-semibold hover:text-blue-500">Inicio</span>
        </div>
        <div className="flex items-center gap-x-1 text-gray-900">
          <span className="text-lg font-semibold hover:text-blue-500">Acerca</span>
        </div>
      </Link>
      {isLoggedIn ? (
        <div className="flex gap-x-6 items-center">
          <div
            className="relative inline-block text-left"
            onMouseEnter={handleCatalogEnter}
            onMouseLeave={handleCatalogLeave}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <HiOutlineDocumentText className="inline-block mr-1 h-7 w-7" /> Catálogo
            </button>
            {isCatalogOpen && (
              <div
                className="absolute top-full mt-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                onMouseEnter={handleCatalogEnter}
                onMouseLeave={handleCatalogLeave}
              >
                <div className="grid grid-cols-2 gap-4 p-4">
                  <Link to="/arrangements" className="text-sm text-gray-900 hover:text-blue-500" onClick={handleCategoryClick}>
                    <HiOutlineDocumentText className="inline-block mr-1 h-5 w-5" /> Arreglos
                  </Link>
                  <Link to="/gift_boxes" className="text-sm text-gray-900 hover:text-blue-500" onClick={handleCategoryClick}>
                    <HiOutlineDocumentText className="inline-block mr-1 h-5 w-5" /> Caja de Regalos
                  </Link>
                  {/* Agrega más enlaces de categorías aquí */}
                </div>
              </div>
            )}
          </div>
          <div
            className="relative inline-block text-left"
            onMouseEnter={handleEventEnter}
            onMouseLeave={handleEventLeave}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <HiOutlineDocumentText className="inline-block mr-1 h-7 w-7" /> Eventos
            </button>
            {isEventOpen && (
              <div
                className="absolute top-full mt-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                onMouseEnter={handleEventEnter}
                onMouseLeave={handleEventLeave}
              >
                <div className="grid grid-cols-2 gap-4 p-4">
                  <Link to="/DayofMother" className="text-sm text-gray-900 hover:text-blue-500" onClick={handleCategoryClick}>
                    <FaRegHeart className="inline-block mr-1 h-5 w-5" /> Día de la Madre
                  </Link>
                  <Link to="/DayOfFather" className="text-sm text-gray-900 hover:text-blue-500" onClick={handleCategoryClick}>
                    <FaRegSmile className="inline-block mr-1 h-5 w-5" /> Día del Padre
                  </Link>
                  <Link to="/ValentinsDay" className="text-sm text-gray-900 hover:text-blue-500" onClick={handleCategoryClick}>
                    <FaRegKiss className="inline-block mr-1 h-5 w-5" /> Día de San Valentín
                  </Link>
                  {/* Agrega más enlaces de eventos aquí */}
                </div>
              </div>
            )}
          </div>
          <Link to="/carrito" className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 hover:text-blue-400">
            <HiOutlineShoppingCart className="inline-block mr-1 h-7 w-7" /> Carrito 
          </Link>
          <Link to="/account" className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 hover:text-blue-400">
            <HiUserCircle className="inline-block mr-1 h-7 w-7" /> Mi Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-red-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 flex items-center space-x-2"
          >
            <FaSignOutAlt />
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div className="flex gap-x-6 items-center">
          <Link to="/login" className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900">
            Iniciar Sesión
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Registrarse
          </Link>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Navbar;
