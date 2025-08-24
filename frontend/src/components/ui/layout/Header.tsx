import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../features/auth/authSlice';
import { useAutoLogout } from '../../../hooks/useAutoLogout';
import VectorIcon from '../../../icons/Vector.svg?react';
import { NotificationsPopover } from './NotificationsPopover';
interface HeaderProps {
  role?: string;
}

export default function Header({ role = 'Administrador' }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useAutoLogout();

  const storedUserName = sessionStorage.getItem('username') || 'Usuario';

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
    <header className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-18 py-8">
      <h1 className="text-2xl font-semibold text-blue-800"> Hola {storedUserName.split(' ')[0]}</h1>
      <div className="flex items-center">
        <NotificationsPopover />
        <div className="relative flex h-14 items-center border-l border-[#5685FA] pl-13">
          <div className="-ml-6 flex items-center gap-3">
            <img
              src="/icons/Avatars_Image.png"
              alt="Avatar"
              className="h-9 w-9 cursor-pointer rounded-full object-cover ring-2 ring-blue-100"
              onClick={() => setOpenMenu((prev) => !prev)}
            />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-[#042D95]">{storedUserName}</p>
              <p className="text-sm text-[#6A93FB]">{role}</p>
            </div>
          </div>

          {/* Dropdown */}
          {openMenu && (
            <div
              ref={menuRef}
              className="absolute top-14 left-0 z-20 flex w-[204px] flex-col items-start rounded-b-lg border-r border-b border-l border-[#5685FA] bg-white p-2 shadow-md"
              style={{ transform: 'translateX(-1px)' }}
            >
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-base leading-[1.2] font-normal text-black hover:bg-gray-50"
                style={{ fontFamily: '"Albert Sans", sans-serif' }}
              >
                <VectorIcon className="h-4.5 w-4.5" />
                <span className="text-black">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
