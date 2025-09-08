import { Container, Paper, Stack, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link as RouterLink } from "react-router-dom";

export default function CheckoutCancel() {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <ErrorOutlineIcon color="warning" />
          <Typography variant="h5" fontWeight={700}>Payment canceled</Typography>
        </Stack>
        <Typography variant="body1" sx={{ mb: 3 }}>
          No charges were made. You can return to your cart to try again or keep shopping.
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button component={RouterLink} to="/cart" variant="contained">Back to cart</Button>
          <Button component={RouterLink} to="/" variant="outlined">Continue shopping</Button>
        </Stack>
      </Paper>
    </Container>
  );
}
