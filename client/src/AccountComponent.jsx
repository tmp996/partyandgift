import { useNavigate } from "react-router-dom";
import { CogIcon, ViewColumnsIcon } from '@heroicons/react/24/outline'

function AccountComponent() {
  let navigate = useNavigate();

  const handleChangePassword = () => {
    navigate("/reset-password"); // path you want to redirect to
  };

  const handleViewPurchaseHistory = () => {
    // Implementar la lógica para ver el historial de compras
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="p-6 w-64 bg-white border-r dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
        <div className="mt-6">
          <button onClick={handleChangePassword} className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded mt-2 w-full">
            <CogIcon className="h-5 w-5" />
            <span className="mx-4 font-medium">Cambiar contraseña</span>
          </button>
          <button onClick={handleViewPurchaseHistory} className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded mt-2 w-full">
            <ViewColumnsIcon className="h-5 w-5" />
            <span className="mx-4 font-medium">Ver historial de compras</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountComponent;
