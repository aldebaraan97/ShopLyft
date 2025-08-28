// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Main from './components/Main.jsx';
import ProductList from './components/product/ProductList.jsx';
import Product from './components/product/Product.jsx';
import ProductForm from './components/product/ProductForm.jsx';
import ProductEdit from './components/product/ProductEdit.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import { isAuthenticated } from './api/auth.js';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser({
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId')
      });
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route index element={<Main />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<Product />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<div>Not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
