import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getProduct } from "../../api/products";
import { isAuthenticated, getCurrentUser } from "../../api/auth";
import { addItem } from "../../api/cart";

import {
  Container,
  Breadcrumbs,
  Link as MUILink,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Divider,
  Skeleton,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const fmt = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const API_BASE_URL = "http://localhost:8080/api";

async function deleteProduct(id) {
  await axios.delete(`${API_BASE_URL}/products/${id}`);
  return id;
}

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const authed = isAuthenticated();
  const userId = authed ? getCurrentUser().userId : null;

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  const { mutate: remove, isPending: isDeleting, error: deleteError } = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.removeQueries({ queryKey: ["product", id] });
      navigate("/", { replace: true });
    },
  });

  const { mutate: addToCart, isPending: isAdding } = useMutation({
    mutationFn: () => addItem(userId, Number(id), 1), // add 1 by default
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  function handleDelete() {
    if (window.confirm("Delete this product permanently?")) remove();
  }

  // ---------------------------------------------------------------------------

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Breadcrumbs / Back */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MUILink component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </MUILink>
        <Typography color="text.primary">Product</Typography>
      </Breadcrumbs>

      <Button
        component={RouterLink}
        to="/"
        size="small"
        startIcon={<ArrowBackIosNewIcon fontSize="small" />}
        sx={{ mb: 2, textTransform: "none" }}
      >
        Back
      </Button>

      {isLoading ? (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Skeleton variant="text" height={44} width="60%" />
            <Skeleton variant="text" height={24} width={120} />
            <Skeleton variant="text" height={22} width="90%" />
            <Skeleton variant="text" height={22} width="70%" />
            <Skeleton variant="text" height={22} width="40%" />
          </CardContent>
          <Divider />
          <CardActions sx={{ p: 2 }}>
            <Skeleton variant="rounded" width={120} height={36} />
            <Skeleton variant="rounded" width={140} height={36} />
            <Skeleton variant="rounded" width={160} height={36} />
          </CardActions>
        </Card>
      ) : error ? (
        <Alert severity="error">Failed to load product.</Alert>
      ) : (
        <>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {product.name}
                </Typography>
                {product.category && <Chip label={product.category} color="primary" variant="outlined" />}
              </Stack>

              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                {product.description || "No description."}
              </Typography>

              <Stack direction="row" spacing={3} sx={{ mt: 2 }} alignItems="center">
                <Typography variant="h6">{fmt.format(Number(product.price))}</Typography>
                <Typography variant="body2" color="text.secondary">
                  In stock: <strong>{product.stockQuantity}</strong>
                </Typography>
              </Stack>

              {deleteError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {deleteError?.response?.data?.message || "Failed to delete product."}
                </Alert>
              )}
            </CardContent>

            <Divider />

            <CardActions sx={{ p: 2 }}>
              <Button
                onClick={() => navigate(`/products/${id}/edit`)}
                startIcon={<EditOutlinedIcon />}
                variant="outlined"
                sx={{ textTransform: "none" }}
              >
                Edit this item
              </Button>

              <Button
                onClick={handleDelete}
                startIcon={<DeleteOutlineIcon />}
                color="error"
                variant="outlined"
                disabled={isDeleting}
                sx={{ textTransform: "none" }}
              >
                {isDeleting ? "Deleting…" : "Delete this item"}
              </Button>

              <Stack sx={{ flexGrow: 1 }} />

              <Button
                startIcon={<ShoppingCartOutlinedIcon />}
                variant="contained"
                disabled={!authed || isAdding}
                onClick={() => addToCart()}
                sx={{ textTransform: "none" }}
              >
                {authed ? (isAdding ? "Adding…" : "Add to Cart") : "Login to buy"}
              </Button>
            </CardActions>
          </Card>
        </>
      )}
    </Container>
  );
}
