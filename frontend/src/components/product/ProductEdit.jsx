import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../../api/products';
import ProductUpdateForm from './ProductUpdateForm.jsx';

export default function ProductEdit() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load product.</p>;

  return <ProductUpdateForm product={data} />;
}