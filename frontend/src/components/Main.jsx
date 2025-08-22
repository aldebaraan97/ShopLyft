import { Link } from 'react-router-dom';
import ProductList from '../components/product/ProductList.jsx';

export default function Main() {

  return (
    <>
      <div className="main-container">
        <ProductList />
        <Link to="/products">Browse Products</Link>
        <br />
        <Link to="/products/new">Add New Product</Link>
      </div>
    </>
  );
}
