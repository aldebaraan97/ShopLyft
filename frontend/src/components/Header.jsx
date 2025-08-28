import { Link, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchBar from './SearchBar.jsx';
import { useState } from 'react';
import axios from 'axios';
import { logout } from '../api/auth.js';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [choices, setChoices] = useState([]); // multiple hits to choose from
  const [searching, setSearching] = useState(false);

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleSearchToProduct = async (q) => {
    const query = (q || '').trim();
    if (!query) return;

    // numeric → treat as ID
    if (/^\d+$/.test(query)) {
      navigate(`/products/${query}`);
      return;
    }

    setSearching(true);
    try {
      const { data: results } = await axios.get('http://localhost:8080/api/products/search', {
        params: { query },
      });

      // 1) exact NAME match → go directly
      const exact = results.find(
        (p) => p.name?.toLowerCase() === query.toLowerCase()
      );
      if (exact) {
        navigate(`/products/${exact.id}`);
        return;
      }

      // 2) only one hit → go directly
      if (results.length === 1) {
        navigate(`/products/${results[0].id}`);
        return;
      }

      // 3) multiple hits → show quick picks under the bar
      setChoices(results.slice(0, 8)); // show first few; tweak as you like
    } catch (e) {
      alert('Search failed. Try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <AppBar position="static" component="nav" color="transparent" elevation={0}>
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <Link to="/" className="">
            ShopLyft
          </Link>
          <SearchBar
            className=""
            placeholder="Search products…"
            onSubmitTo={handleSearchToProduct}
          />
          <Link to="/products/new" className="">
            Form
          </Link>
          <div className="flex gap-6 mt-2">
            {user ? (
              <>
                <span>Welcome, {user.username}</span>
                <Button onClick={handleLogout}>Logout</Button>
                <Link to="/cart">
                  <ShoppingCartIcon className="" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div className="main-container">
        {searching && <p>Searching…</p>}
        {!!choices.length && (
          <div style={{ marginBottom: 16 }}>
            <p>Multiple matches—pick one:</p>
            <ul style={{ paddingLeft: 16 }}>
              {choices.map((p) => (
                <li key={p.id}>
                  <a
                    href={`/products/${p.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/products/${p.id}`);
                    }}
                  >
                    {p.name} — {p.category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
