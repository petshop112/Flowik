import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../features/auth/authSlice';
import { useAutoLogout } from '../../../hooks/useAutoLogout';

interface HeaderProps {
  userName?: string;
  role?: string;
}

export default function Header({
  userName = 'Gonzalo Lopez',
  role = 'Administrador',
}: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useAutoLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-8 py-8">
      <h1 className="text-2xl font-semibold text-blue-800"> Hola {userName.split(' ')[0]}</h1>

      <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
        <img
          src="/icons/Avatars_Image.png"
          alt="Avatar"
          className="h-9 w-9 cursor-pointer rounded-full object-cover ring-2 ring-blue-100"
          onClick={() => setOpenMenu((prev) => !prev)}
        />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>

        {/* Dropdown */}
        {openMenu && (
          <div
            ref={menuRef}
            className="absolute top-12 right-0 z-20 w-40 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
          >
            <button
              onClick={handleLogout}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
