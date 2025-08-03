const Footer = () => {
    return (
        <footer className="bg-gray-900/50 border-t border-gray-700 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-gray-300 text-sm">
                        © 2025 MisinoMascotas. Todos los derechos reservados.
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-300">
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
