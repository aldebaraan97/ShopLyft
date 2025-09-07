// src/components/product/ProductUpdateForm.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

async function updateProduct(id, payload) {
  const res = await axios.put(`${API_BASE_URL}/products/${id}`, payload, {
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

export default function ProductUpdateForm({ product }) {
  const qc = useQueryClient();

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    stockQuantity: product?.stockQuantity ?? "",
    category: product?.category || "Grains",
  });

  useEffect(() => {
    setForm({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? "",
      stockQuantity: product?.stockQuantity ?? "",
      category: product?.category || "Grains",
    });
  }, [product]);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (payload) => updateProduct(product.id, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.setQueryData(["product", product.id], updated);
      setServerError("");
    },
    onError: (err) => {
      setServerError(
        err?.response?.data?.message || err?.message || "Failed to update product."
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
        title="Update Product"
        subheader="Edit details and save your changes"
        sx={{ pb: 0, "& .MuiCardHeader-title": { fontWeight: 700 } }}
      />

      <CardContent>
        <Box sx={{ display: "grid", gap: 2 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          {isSuccess && <Alert severity="success">Product updated successfully!</Alert>}

          {/* Row 1: 4 equal columns on md+; 2 columns on sm; full-width on xs */}
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

          {/* Row 2: Description full width */}
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={4}
            size="medium"
          />

          <Box>
            <Box component="span" sx={{ color: "text.secondary", fontSize: 12 }}>
              * All fields marked as required must be filled.
            </Box>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3 }}>
        <Button type="submit" variant="contained" disabled={isPending} sx={{ textTransform: "none" }}>
          {isPending ? "Updating…" : "Update Product"}
        </Button>
      </CardActions>
    </Card>
  );
}
