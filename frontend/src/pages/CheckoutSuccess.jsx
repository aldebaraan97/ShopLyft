import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Paper, Stack, Typography, Divider, Chip, Button, CircularProgress, Alert, List, ListItem, ListItemText } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { http } from "../api/http"; // axios instance that attaches Authorization

async function fetchOrder(orderId) {
  const { data } = await http.get(`/orders/order/${orderId}`);
  return data;
}

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("o");
  const qc = useQueryClient();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
    // Poll while pending to give the webhook time to flip status to CONFIRMED
    refetchInterval: (q) => (q.state.data?.status === "PENDING" ? 3000 : false),
  });

  // make navbar badge refresh
  // (safe even if you don't have that query mounted yet)
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;
  if (userId) qc.invalidateQueries({ queryKey: ["cart", userId] });

  if (!orderId) return <Container sx={{ py: 6 }}><Alert severity="warning">Missing order id.</Alert></Container>;
  if (isLoading) return <Container sx={{ py: 6, display: "flex", justifyContent: "center" }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 6 }}><Alert severity="error">Couldn’t load your order.</Alert></Container>;

  const totalNum = Number.parseFloat(order?.totalAmount ?? 0);
  const totalDisplay = Number.isFinite(totalNum) ? totalNum.toFixed(2) : String(order?.totalAmount ?? "0.00");
  const items = order?.orderItems ?? []; // render if backend returns them

  const status = order?.status ?? "PENDING";
  const isPending = status === "PENDING";
  const statusChip = (
    <Chip
      color={isPending ? "warning" : "success"}
      icon={isPending ? <HourglassBottomIcon /> : <CheckCircleOutlineIcon />}
      label={status}
      sx={{ fontWeight: 600 }}
    />
  );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>Thanks! 🎉</Typography>
          {statusChip}
        </Stack>

        <Typography sx={{ mb: 1 }}>
          Order <strong>#{order?.id}</strong> is <strong>{status}</strong>.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>Summary</Typography>
        {items.length > 0 ? (
          <List dense>
            {items.map((oi) => (
              <ListItem key={oi.id} disableGutters>
                <ListItemText
                  primary={`${oi.product?.name ?? "Item"} × ${oi.quantity}`}
                  secondary={`$${Number(oi.price ?? 0).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Items will appear once the payment confirmation is processed.
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="h6">Total: ${totalDisplay}</Typography>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/orders" variant="contained">View all orders</Button>
            <Button component={RouterLink} to="/" variant="outlined">Continue shopping</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
