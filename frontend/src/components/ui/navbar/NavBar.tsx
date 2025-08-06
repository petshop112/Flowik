import Logout from "../../features/Logout";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../ui/navigation-menu";

import { Link } from "react-router-dom";
import useAuthToken from "../../../hooks/useAuthToken";
import { CircleUserRound } from "lucide-react";

const NavBar = () => {
  const token = useAuthToken();
  const userName = localStorage.getItem("username");

  return (
    <nav className="flex bg-slate-900 text-white justify-between rounded-2xl p-2 text-2xl">
      {/*Home link */}
      <NavigationMenu className="">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" data-test="nav-home">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {token ? (
        <div className="flex items-center gap-2">
          <div className="flex ">
            <span>
              <CircleUserRound />
            </span>
            <p className="ml-2 text-sm" data-test="nav-welcome-user">Welcome, {userName}</p>
          </div>

          {/*Products link */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/products" data-test="nav-products">Products</Link>
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
                  <Link to="/login" data-test="nav-login">Login</Link>
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
                  <Link to="/register" data-test="nav-register">Register</Link>
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
