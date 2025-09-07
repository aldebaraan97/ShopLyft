import { Link } from 'react-router-dom';
import ProductList from '../components/product/ProductList.jsx';

export default function Main() {

  return (
    <>
      <div className="main-container">
        <ProductList />
      </div>
    </>
  );
}
