// Product.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getProduct } from '../../api/products';
import SearchBar from '../../components/SearchBar'; // <- import

const fmt = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });

async function deleteProduct(id) {
  await axios.delete(`/api/products/${id}`);
  return id;
}

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  const { mutate: remove, isPending: isDeleting, error: deleteError } = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.removeQueries({ queryKey: ['product', id] });
      navigate('/', { replace: true });
    },
  });

  function handleDelete() {
    if (window.confirm('Delete this product permanently?')) remove();
  }

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

      {deleteError && (
        <p style={{ color: 'crimson' }}>
          {deleteError?.response?.data?.message || 'Failed to delete product.'}
        </p>
      )}

      <button onClick={handleDelete} disabled={isDeleting} style={{ marginTop: 12, padding: '8px 12px', fontWeight: 600 }}>
        {isDeleting ? 'Deleting…' : 'Delete this item'}
      </button>
    </div>
  );
}
