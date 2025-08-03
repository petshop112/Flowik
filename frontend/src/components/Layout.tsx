import NavBar from "./ui/navbar/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./ui/Footer";

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <NavBar />
    
    <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="p-6 md:p-8 lg:p-12 mx-auto">
          <Outlet />
        </div>
      </div>
    </main>

    <Footer></Footer>
  </div>
);

export default Layout;
