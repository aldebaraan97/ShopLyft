import { Link } from 'react-router-dom';
import ProductList from '../components/product/ProductList.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Main() {

  return (
    <>
      <Header />
      <div className="main-container">
        <ProductList />
        <Link to="/products">Browse Products</Link>
        <br />
        <Link to="/products/new">Add New Product</Link>
      </div>
      <Footer />
    </>
  );
}
