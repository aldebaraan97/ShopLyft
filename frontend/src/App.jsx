// src/App.jsx
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Main from './components/Main.jsx';
import ProductList from './components/product/ProductList.jsx';
import Product from './components/product/Product.jsx';
import ProductForm from './components/product/ProductForm.jsx';
import ProductEdit from './components/product/ProductEdit.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<Product />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="*" element={<div>Not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
