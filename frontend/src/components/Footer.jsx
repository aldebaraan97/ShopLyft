import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        // soft tinted background for contrast with the page
        bgcolor: "grey.100",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="default" aria-label="home" href="/">
            <HomeIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} <strong>ShopLyft</strong>. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Powered by React &amp; Spring Boot
          </Typography>
          <FavoriteBorderIcon fontSize="small" sx={{ color: "text.disabled" }} />
        </Stack>
      </Container>
    </Box>
  );
}
