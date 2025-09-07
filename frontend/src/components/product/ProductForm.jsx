import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

const API_BASE_URL = "http://localhost:8080/api";

async function createProduct(payload) {
  const res = await axios.post(`${API_BASE_URL}/products`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

const CATEGORIES = [
  "Grains",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat",
  "Beverages",
  "Snacks",
  "Condiments",
  "Frozen",
  "Bakery",
];

export default function ProductForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "Grains",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const { mutate, isPending, isSuccess, data: created } = useMutation({
    mutationFn: (payload) => createProduct(payload),
    onSuccess: (product) => {
      // refresh product lists and optionally jump to the new item
      qc.invalidateQueries({ queryKey: ["products"] });
      setServerError("");
      // navigate to the detail page (comment out if you prefer to stay)
      navigate(`/products/${product.id}`);
    },
    onError: (err) => {
      setServerError(
        err?.response?.data?.message || err?.message || "Failed to create product."
      );
    },
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";

    const priceNum = parseFloat(form.price);
    if (form.price === "" || Number.isNaN(priceNum) || priceNum < 0)
      e.price = "Price must be a number ≥ 0";

    const stockNum = Number(form.stockQuantity);
    if (form.stockQuantity === "" || !Number.isInteger(stockNum) || stockNum < 0)
      e.stockQuantity = "Stock quantity must be an integer ≥ 0";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    mutate({
      name: form.name.trim(),
      description: (form.description || "").trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      category: form.category,
    });
  }

  return (
    <Card
      variant="outlined"
      component="form"
      onSubmit={handleSubmit}
      sx={{ borderRadius: 2, maxWidth: 940, mx: "auto", mt: 2 }}
    >
      <CardHeader
        title="Create Product"
        subheader="Add a new product to the catalog"
        sx={{ pb: 0, "& .MuiCardHeader-title": { fontWeight: 700 } }}
      />

      <CardContent>
        <Box sx={{ display: "grid", gap: 2 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          {isSuccess && created && (
            <Alert severity="success">Product created successfully!</Alert>
          )}

          {/* Row 1: uniform inputs */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                size="medium"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                select
                fullWidth
                size="medium"
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Price (CAD)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: 0 }}
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
                size="medium"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={form.stockQuantity}
                onChange={handleChange}
                inputProps={{ step: "1", min: 0 }}
                error={!!errors.stockQuantity}
                helperText={errors.stockQuantity}
                fullWidth
                size="medium"
                required
              />
            </Grid>
          </Grid>

          {/* Row 2: description full width */}
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={4}
            size="medium"
            placeholder="Enter product description"
          />

          <Box>
            <Box component="span" sx={{ color: "text.secondary", fontSize: 12 }}>
              * All fields marked as required must be filled.
            </Box>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{ textTransform: "none" }}
        >
          {isPending ? "Creating…" : "Create Product"}
        </Button>
      </CardActions>
    </Card>
  );
}
