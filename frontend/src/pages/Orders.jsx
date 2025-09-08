import { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders";
import { isAuthenticated, getCurrentUser } from "../api/auth";
import {
  Container, Paper, Stack, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, CircularProgress, Alert, Button
} from "@mui/material";

const statusChip = (s) => {
  const u = String(s ?? "PENDING").toUpperCase();
  const color = u === "CONFIRMED" ? "success" : u === "PENDING" ? "warning" : u === "CANCELLED" ? "error" : "default";
  return <Chip label={u} color={color} size="small" sx={{ fontWeight: 600 }} />;
};
const fmtMoney = (v) => {
  const n = Number.parseFloat(v ?? 0);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
};

export default function Orders() {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const userId = authed ? getCurrentUser()?.userId : null;

  useEffect(() => { if (!authed) navigate("/login", { replace: true }); }, [authed, navigate]);
  if (!authed) return null;

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => getOrders(userId),
    enabled: !!userId,
    // Ensure the UI always sees an array
    select: (d) => (Array.isArray(d) ? d : []),
  });

  if (isLoading) return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack alignItems="center"><CircularProgress /></Stack>
    </Container>
  );
  if (error) return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Alert severity="error">Failed to load orders.</Alert>
    </Container>
  );

  const rows = data; // guaranteed array

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Your Orders</Typography>
        <Button component={RouterLink} to="/" variant="outlined">Continue shopping</Button>
      </Stack>

      <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
        {rows.length === 0 ? (
          <Alert severity="info">No orders yet.</Alert>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell>#{o.id}</TableCell>
                  <TableCell>{o.orderDate ? new Date(o.orderDate).toLocaleString() : "—"}</TableCell>
                  <TableCell>{statusChip(o.status)}</TableCell>
                  <TableCell align="right">${fmtMoney(o.totalAmount)}</TableCell>
                  <TableCell align="right">
                    <Button
                      component={RouterLink}
                      to={`/checkout/success?o=${o.id}`}
                      size="small"
                      variant="outlined"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}
