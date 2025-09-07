import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getProducts } from '../../api/products';
import { addItem, getCart } from '../../api/cart';
import { getCurrentUser, isAuthenticated } from '../../api/auth';

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardMedia
} from '@mui/material';

export default function ProductList() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  /** Load products */
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  /** Header/cart badge: read the user's cart */
  const user = getCurrentUser();
  const userId = user?.userId;
  const cartEnabled = !!userId && isAuthenticated();

  const { data: cart } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => getCart(userId),
    enabled: cartEnabled,
    staleTime: 5_000,
  });

  /** productId -> quantity (in cart) */
  const inCartMap = useMemo(() => {
    const map = {};
    (cart?.items || []).forEach((it) => {
      const pid = it?.product?.id;
      if (!pid) return;
      map[pid] = (map[pid] || 0) + (it.quantity || 0);
    });
    return map;
  }, [cart]);

  /** Track which card is adding (so only that one says "Adding…") */
  const [addingId, setAddingId] = useState(null);

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: async (product) => {
      if (!isAuthenticated()) {
        navigate('/login');
        throw new Error('LOGIN_REQUIRED');
      }
      return addItem(userId, product.id, 1);
    },

    /** Optimistic update for instant badge/stock feedback */
    onMutate: async (product) => {
      setAddingId(product.id);

      if (!cartEnabled) return {};

      await qc.cancelQueries({ queryKey: ['cart', userId] });
      const prev = qc.getQueryData(['cart', userId]);

      if (prev) {
        const items = [...(prev.items || [])];
        const idx = items.findIndex((it) => it.product?.id === product.id);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: (items[idx].quantity || 0) + 1 };
        } else {
          // minimal optimistic line; include product so UI can render it immediately
          items.push({ id: Math.random(), product, quantity: 1 });
        }
        qc.setQueryData(['cart', userId], { ...prev, items });
      }
      return { prev };
    },

    /** Revert optimistic update on error */
    onError: (_err, _product, ctx) => {
      if (ctx?.prev) qc.setQueryData(['cart', userId], ctx.prev);
    },

    /** Snap to the server's cart immediately (even before refetch completes) */
    onSuccess: (serverCart) => {
      if (serverCart) qc.setQueryData(['cart', userId], serverCart);
    },

    /** Always re-sync; clear button spinner */
    onSettled: () => {
      setAddingId(null);
      qc.invalidateQueries({ queryKey: ['cart', userId] });
      // If your backend decrements stock in DB on add, also:
      // qc.invalidateQueries({ queryKey: ['products'] });
    },

    retry: false, // avoid retrying LOGIN_REQUIRED, etc.
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load products</p>;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 2,
        p: 2,
      }}
    >
      {products.map((product) => {
        const already = inCartMap[product.id] || 0;
        const stockLeft = Math.max(0, Number(product.stockQuantity || 0) - already);

        const isThisAdding = isPending && addingId === product.id;

        return (
          <Card
            key={product.id}
            sx={{ display: 'flex', flexDirection: 'column' }}
            elevation={3}
          >
            <CardActionArea component={RouterLink} to={`/products/${product.id}`}>
              {product.imageUrl && (
                <CardMedia
                  component="img"
                  height="160"
                  image={product.imageUrl}
                  alt={product.name}
                />
              )}

              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {product.category}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                  {product.description}
                </Typography>

                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                  ${Number(product.price).toFixed(2)}{' '}
                  <Typography component="span" variant="caption" color="text.secondary">
                    • Stock: {stockLeft}
                    {already > 0 ? `  (in cart: ${already})` : ''}
                  </Typography>
                </Typography>
              </CardContent>
            </CardActionArea>

            <CardActions
              sx={{
                mt: 'auto',
                px: 2,
                pb: 2,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                size="small"
                variant="outlined"
                component={RouterLink}
                to={`/products/${product.id}`}
              >
                View
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={() => addToCart(product)}
                disabled={stockLeft <= 0 || isThisAdding}
              >
                {stockLeft <= 0 ? 'Out of stock' : isThisAdding ? 'Adding…' : 'Add to Cart'}
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
}
