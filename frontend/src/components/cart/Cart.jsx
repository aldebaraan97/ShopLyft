// src/components/cart/Cart.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, updateItem, removeItem, clearCart } from "../../api/cart";
import { getCurrentUser, isAuthenticated } from "../../api/auth";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Button,
  Divider,
  Stack,
  Alert,
  ButtonGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Cart() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const authed = isAuthenticated();
  const userId = authed ? getCurrentUser().userId : null;

  // redirect happens in an effect (keeps hooks stable)
  useEffect(() => {
    if (!authed) navigate("/login", { replace: true });
  }, [authed, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCart(userId),
    enabled: !!userId,
  });

  const items = data?.items ?? [];
  const total = useMemo(
    () =>
      items.reduce(
        (s, it) => s + Number(it?.product?.price || 0) * Number(it?.quantity || 0),
        0
      ),
    [items]
  );

  // local editable quantities per productId
  const [qtyDraft, setQtyDraft] = useState({});
  // initialize draft when cart loads/changes
  useEffect(() => {
    const m = {};
    for (const it of items) {
      if (it?.product?.id != null) m[it.product.id] = Number(it.quantity || 0);
    }
    setQtyDraft(m);
  }, [items]);

  const mutateUpdate = useMutation({
    mutationFn: ({ productId, quantity }) => updateItem(userId, productId, quantity),
    onSuccess: (_data, vars) => {
      // reset the draft for the row to whatever server accepted
      setQtyDraft((d) => ({ ...d, [vars.productId]: vars.quantity }));
      qc.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: () => alert("Failed to update item. Please try again."),
  });

  const mutateRemove = useMutation({
    mutationFn: (productId) => removeItem(userId, productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] }),
    onError: () => alert("Failed to remove item. Please try again."),
  });

  const mutateClear = useMutation({
    mutationFn: () => clearCart(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] }),
    onError: () => alert("Failed to clear cart. Please try again."),
  });

  function setQty(pid, next) {
    const value = Math.max(0, Number.isFinite(next) ? next : 0);
    setQtyDraft((d) => ({ ...d, [pid]: value }));
  }

  function submitQty(it) {
    const pid = it.product?.id;
    const current = Number(it.quantity || 0);
    const desired = Number(qtyDraft[pid] ?? current);

    if (desired === current) return; // nothing changed

    if (desired <= 0) {
      // 0 means remove (server already treats PUT 0 as remove, but we can call delete)
      mutateRemove.mutate(pid);
    } else {
      mutateUpdate.mutate({ productId: pid, quantity: desired });
    }
  }

  if (!authed) return null;
  if (isLoading) return <Box p={3}><Typography>Loading…</Typography></Box>;
  if (error) return <Box p={3}><Alert severity="error">Failed to load your cart</Alert></Box>;

  return (
    <Box p={3} maxWidth={900} mx="auto">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Your Cart</Typography>
        <Button component={RouterLink} to="/" variant="outlined">
          CONTINUE SHOPPING
        </Button>
      </Stack>

      {items.length === 0 ? (
        <Alert severity="info">Your cart is empty.</Alert>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center" width={220}>Quantity</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((it) => {
                const pid = it.product?.id;
                const price = Number(it.product?.price || 0);
                const serverQty = Number(it.quantity || 0);
                const draftQty = Number(qtyDraft[pid] ?? serverQty);
                const changed = draftQty !== serverQty;

                return (
                  <TableRow key={it.id}>
                    <TableCell>
                      <Typography fontWeight={600}>{it.product?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {it.product?.category}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">${price.toFixed(2)}</TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <ButtonGroup size="small" variant="outlined">
                          <IconButton
                            size="small"
                            onClick={() => setQty(pid, draftQty - 1)}
                            aria-label="decrease"
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </ButtonGroup>

                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={draftQty}
                          onChange={(e) => setQty(pid, Number(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              submitQty(it);
                            }
                          }}
                          onBlur={() => {
                            // auto-submit on blur if changed
                            if (changed) submitQty(it);
                          }}
                          sx={{ width: 90 }}
                        />

                        <ButtonGroup size="small" variant="outlined">
                          <IconButton
                            size="small"
                            onClick={() => setQty(pid, draftQty + 1)}
                            aria-label="increase"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </ButtonGroup>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">${(price * draftQty).toFixed(2)}</TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => submitQty(it)}
                          disabled={(!changed && draftQty >= 0) || mutateUpdate.isPending}
                        >
                          UPDATE
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => mutateRemove.mutate(pid)}
                          disabled={mutateRemove.isPending}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => mutateClear.mutate()}
                disabled={mutateClear.isPending}
              >
                CLEAR CART
              </Button>
              <Button variant="contained" disabled>
                CHECKOUT (STUB)
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </Box>
  );
}
