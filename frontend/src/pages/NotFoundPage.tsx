
const NotFoundPage = () => {
    return (
        <div className="h-screen flex items-center justify-center text-center">
            <div>
                <h1 className="text-4xl font-bold mb-4">404 - Pagina no encontrada</h1>
                <p className="text-gray-600">La ruta que estas buscando no existe.</p>
                <button className="bg-black rounded-sm p-2 m-4">
                    <a className="text-white" href="/">Volver a inicio</a>
                </button>
            </div>
        </div>
    )
}

export default NotFoundPage
