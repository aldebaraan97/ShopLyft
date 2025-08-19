import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import Box from '@mui/material/Box';

export default function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load products</p>;

  return (
    <Box sx={{ display: 'flex' }}>
      {data.map(product => (
        <div key={product.id} style={{ marginBottom: 16 }}>
          <h2>{product.name}</h2>
          <p>{product.category}</p>
          <p>{product.description}</p>
          <p>
            {Number(product.price)} – <span>Stock: {product.stockQuantity}</span>
          </p>
          <Link to={`/products/${product.id}`}>View details</Link>
          <button>Add to Cart</button>
          <button>Buy Now</button>
        </div>
      ))}
    </Box>
  );
}
