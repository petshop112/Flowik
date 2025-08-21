import Logout from '../../features/Logout';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../../ui/navigation-menu';

import { Link } from 'react-router-dom';
import useAuthToken from '../../../hooks/useAuthToken';
import { CircleUserRound } from 'lucide-react';

const NavBar = () => {
  const token = useAuthToken();
  const userName = sessionStorage.getItem('username');

  return (
    <nav className="flex justify-between rounded-2xl bg-slate-900 p-2 text-2xl text-white">
      {/*Home link */}
      <NavigationMenu className="">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {token ? (
        <div className="flex items-center gap-2">
          <div className="flex">
            <span>
              <CircleUserRound />
            </span>
            <p className="ml-2 text-sm">Welcome, {userName}</p>
          </div>

          {/*Products link */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <span>|</span>

          <Logout />
        </div>
      ) : (
        <div className="flex">
          {/*login link */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/login">Login</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <span>|</span>

          {/*Register link */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/register">Register</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <span>|</span>
          {/*Recover password link*/}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/recover-password">Recuperar contraseña</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
