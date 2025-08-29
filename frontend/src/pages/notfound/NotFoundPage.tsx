import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const token = localStorage.getItem('token');
  const redirectPath = token ? '/' : '/login';
  const valueButton = token ? 'Volver a Home' : 'Volver a Login';
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-10 shadow-lg">
        <div className="mb-4 flex h-16 w-16 items-center justify-center">
          <span className="text-6xl text-red-500">404</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Página no encontrada</h1>
        <p className="mb-6 w-full text-center text-base text-gray-600">
          La ruta que estás buscando no existe o fue movida.
        </p>
        <Link
          to={redirectPath}
          className="inline-block rounded-md bg-blue-600 px-6 py-2 font-semibold text-white shadow transition-colors hover:bg-blue-700"
        >
          {valueButton}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
