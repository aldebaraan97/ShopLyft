import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateProduct(id, payload) {
  const res = await axios.put(`/api/products/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export default function ProductUpdateForm({ product }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stockQuantity: product.stockQuantity || "",
    category: product.category || "Grains",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (payload) => updateProduct(product.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setServerError("");
    },
    onError: (err) => {
      setServerError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update product."
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
      e.stockQuantity = "Stock quantity must be an integer";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    mutate(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Product</h2>
      {serverError && <p style={{ color: 'crimson' }}>{serverError}</p>}
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p style={{ color: 'crimson' }}>{errors.name}</p>}
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} />
        {errors.price && <p style={{ color: 'crimson' }}>{errors.price}</p>}
      </div>
      <div>
        <label>Stock Quantity:</label>
        <input type="number" name="stockQuantity" value={form.stockQuantity} on Change={handleChange} />
        {errors.stockQuantity && <p style={{ color: 'crimson' }}>{errors.stockQuantity}</p>}
      </div>
      <div>
        <label>Category:</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Grains">Grains</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Dairy">Dairy</option>
          <option value="Meat">Meat</option>
          <option value="Beverages">Beverages</option>
          <option value="Snacks">Snacks</option>
          <option value="Condiments">Condiments</option>
          <option value="Frozen">Frozen</option>
          <option value="Bakery">Bakery</option>
        </select>
      </div>
      <button type="submit" disabled={isPending} style={{ padding: '8px 12px', fontWeight: 600 }}>
        {isPending ? 'Updating…' : 'Update Product'}
      </button>
      {isSuccess && <p style={{ color: 'green' }}>Product updated successfully!</p>}
    </form>
  );
}