import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ProductList from '../components/product/ProductList.jsx';

export default function Main() {
  return (
    <>
      {<Header />}
      <div className="main-container">
        <h1>Welcome to ShopLyft</h1>
        <p>Your one-stop shop for all your needs!</p>
        <ProductList />
        <Link to="/products">Browse Products</Link>
        <br />
        <Link to="/products/new">Add New Product</Link>
      </div>
      {<Footer />}
    </>
  );
}