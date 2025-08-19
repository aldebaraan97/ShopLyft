import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Product from './components/product/Product.jsx';
import ProductList from './components/product/ProductList.jsx';
import ProductForm from './components/product/ProductForm.jsx';
import Main from './components/Main.jsx';
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/products/new" element={<ProductForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
