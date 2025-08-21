export default function Header({ userName = 'Gonzalo Lopez', role = 'Administrador' }) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-8 py-8">
      <h1 className="text-2xl font-semibold text-blue-800"> Hola {userName.split(' ')[0]}</h1>

      <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
        <img
          src="/icons/Avatars_Image.png"
          alt="Avatar"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
        />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </header>
  );
}
