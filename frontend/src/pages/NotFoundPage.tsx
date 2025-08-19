import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const token = sessionStorage.getItem('token');
  const redirectPath = token ? '/' : '/login';
  const valueButton = token ? 'Volver a Home' : 'Volver a Login';
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div>
        <h1 className="mb-4 text-4xl font-bold">404 - Pagina no encontrada</h1>
        <p className="text-gray-600">La ruta que estas buscando no existe.</p>
        <button className="m-4 rounded-sm bg-black p-2 text-white">
          <Link to={redirectPath} className="text-grey-600">
            {valueButton}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
