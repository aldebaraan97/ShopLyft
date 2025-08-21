import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { getProducts } from '../../api/products';
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
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load products</p>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        p: 2
      }}
    >
      {data.map((product) => (
        <Card
          key={product.id}
          sx={{ width: 320, display: 'flex', flexDirection: 'column' }}
          elevation={3}
        >
          <CardActionArea
            component={RouterLink}
            to={`/products/${product.id}`}
          >
            {/* Optional product image */}
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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
                noWrap
              >
                {product.description}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                ${Number(product.price).toFixed(2)}{' '}
                <Typography component="span" variant="caption" color="text.secondary">
                  • Stock: {product.stockQuantity}
                </Typography>
              </Typography>
            </CardContent>
          </CardActionArea>

          <CardActions sx={{ mt: 'auto', px: 2, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              variant="outlined"
              component={RouterLink}
              to={`/products/${product.id}`}
            >
              View
            </Button>
            <Button size="small" variant="contained">
              Add to Cart
            </Button>
            {/* <Button size="small">Buy Now</Button> */}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}
