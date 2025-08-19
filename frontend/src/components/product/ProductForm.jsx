import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createProduct(payload) {
  const res = await axios.post("/api/products", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export default function ProductForm() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "Grains",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setForm({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        category: "Grains",
      });
      setServerError("");
    },
    onError: (err) => {
      setServerError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create product."
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
    if (!form.price) e.price = "Price is required";
    if (Number.isNaN(parseFloat(form.price))) e.price = "Price must be a number";
    if (!form.stockQuantity && form.stockQuantity !== 0)
      e.stockQuantity = "Stock quantity is required";
    if (!Number.isInteger(Number(form.stockQuantity)))
      e.stockQuantity = "Stock must be an integer";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const eventObj = validate();
    setErrors(eventObj);
    if (Object.keys(eventObj).length) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
      category: form.category,
    };
    mutate(payload);
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: 16 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Create Product</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          {errors.name && <small style={{ color: "crimson" }}>{errors.name}</small>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Price
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="1.50"
              step="0.01"
              min="0"
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          {errors.price && <small style={{ color: "crimson" }}>{errors.price}</small>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Stock Quantity
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              placeholder="1000"
              step="1"
              min="0"
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          {errors.stockQuantity && (
            <small style={{ color: "crimson" }}>{errors.stockQuantity}</small>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            >
              <option>Grains</option>
              <option>Fruits</option>
              <option>Meat</option>
              <option>Seafood</option>
              <option>Vegetables</option>
              <option>Beverages</option>
              <option>Frozen</option>
            </select>
          </label>
        </div>

        {serverError && (
          <div style={{ color: "crimson", marginBottom: 12 }}>{serverError}</div>
        )}

        {isSuccess && (
          <div style={{ color: "seagreen", marginBottom: 12 }}>
            Product created successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: "10px 16px",
            fontWeight: 600,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "Saving…" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
