import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout({ user, onLogout }) {
  return (
    <div className="app">
      <Header user={user} onLogout={onLogout} />
      <main className="main-container">
        <Outlet />   {/* child routes render here */}
      </main>
      <Footer />
    </div>
  );
}