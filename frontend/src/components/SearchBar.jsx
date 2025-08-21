// src/pages/SearchBar.jsx (or wherever you put it)
import { useState } from 'react';

export default function SearchBar({ placeholder = 'Search…', onSubmitTo }) {
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitTo?.(q);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Search</button>
    </form>
  );
}
