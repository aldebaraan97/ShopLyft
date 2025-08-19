import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Product from './components/Product.jsx';
import ProductList from './components/ProductList.jsx';
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
