import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Header from './Header';

const Layout = () => (
  <div className="flex min-h-screen flex-col bg-gray-50">
    <Header />
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl">
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

export default Layout;
