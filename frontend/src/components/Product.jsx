import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../api/products';

const fmt = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });

export default function Product() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id, // React Query option that says “only run this query when id is truthy.”
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load product</p>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <h1>{data.name}</h1>
      <p>{data.category}</p>
      <p>{data.description}</p>
      <p>{fmt.format(Number(data.price))}</p>
      <p>In stock: {data.stockQuantity}</p>
    </div>
  );
}
