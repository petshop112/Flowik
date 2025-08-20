const Footer = () => {
  return (
    <footer className="border-t border-gray-700 bg-gray-900/50 py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm text-gray-300">
            © 2025 MisinoMascotas. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6 text-sm text-gray-300">
            <a href="#" className="transition-colors hover:text-white">
              Términos
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacidad
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
