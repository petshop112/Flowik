import { Link } from "react-router-dom";

const NotFoundPage = () => {
    const token = sessionStorage.getItem("token");
    const redirectPath = token ? "/" : "/login";
    const valueButton = token ? "Volver a Home" : "Volver a Login";
    return (
        <div className="h-screen flex items-center justify-center text-center">
            <div>
                <h1 className="text-4xl font-bold mb-4">404 - Pagina no encontrada</h1>
                <p className="text-gray-600">La ruta que estas buscando no existe.</p>
                <button className="bg-black text-white rounded-sm p-2 m-4">
                    <Link to={redirectPath} className="text-grey-600">
                        {valueButton}
                    </Link>
                </button>
            </div>
        </div>
    )
}

export default NotFoundPage;
