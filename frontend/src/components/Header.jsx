import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  IconButton,
  InputBase,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Badge,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { logout, isAuthenticated } from "../api/auth";
import { getCart } from "../api/cart";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  // search
  const [query, setQuery] = useState("");
  const [choices, setChoices] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchWrapRef = useRef(null);

  const handleSearchToProduct = async (q) => {
    const term = (q || "").trim();
    if (!term) return;

    if (/^\d+$/.test(term)) {
      navigate(`/products/${term}`);
      return;
    }

    setSearching(true);
    try {
      const { data: results } = await axios.get(
        "http://localhost:8080/api/products/search",
        { params: { query: term } }
      );

      const exact = results.find(
        (p) => p.name?.toLowerCase() === term.toLowerCase()
      );
      if (exact) {
        navigate(`/products/${exact.id}`);
        setChoices([]);
        return;
      }
      if (results.length === 1) {
        navigate(`/products/${results[0].id}`);
        setChoices([]);
        return;
      }
      setChoices(results.slice(0, 8));
    } catch {
      alert("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    handleSearchToProduct(query);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setChoices([]);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // cart badge
  const userId = user?.userId || localStorage.getItem("userId");
  const { data: cart } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCart(userId),
    enabled: !!userId && isAuthenticated(),
    staleTime: 5000,
  });
  const count = useMemo(
    () => (cart?.items || []).reduce((n, it) => n + (it.quantity || 0), 0),
    [cart]
  );

  // auth
  const handleLogout = () => {
    logout();
    onLogout?.();
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          // gradient background
          background:
            "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
          color: "common.white",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, py: 1.25 }}>
            {/* Brand */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                mr: 1,
              }}
            >
              <StorefrontIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ShopLyft
              </Typography>
            </Box>

            {/* Search */}
            <Box
              component="form"
              onSubmit={submitSearch}
              ref={searchWrapRef}
              sx={{ position: "relative", flex: 1, maxWidth: 560, mx: 1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  borderRadius: 2,
                  // white input on colored app bar
                  bgcolor: "common.white",
                }}
              >
                <InputBase
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  sx={{ ml: 1, flex: 1, fontSize: 15 }}
                  inputProps={{ "aria-label": "search products" }}
                />
                <IconButton type="submit" aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>

              {!!choices.length && (
                <Paper
                  elevation={6}
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    mt: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                    zIndex: (t) => t.zIndex.appBar + 1,
                  }}
                >
                  <List dense disablePadding>
                    {choices.map((p) => (
                      <ListItemButton
                        key={p.id}
                        onClick={() => {
                          setChoices([]);
                          navigate(`/products/${p.id}`);
                        }}
                      >
                        <ListItemText
                          primary={p.name}
                          secondary={p.category}
                          primaryTypographyProps={{ noWrap: true }}
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

            {/* Right actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Button
                component={RouterLink}
                to="/products/new"
                startIcon={<AddCircleOutlineIcon />}
                color="inherit"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "rgba(255,255,255,0.6)",
                  "&:hover": { borderColor: "common.white", bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                Add New Product
              </Button>

              {user ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    Welcome, <strong>{user.username}</strong>
                  </Typography>

                  <Tooltip title="Cart">
                    <IconButton component={RouterLink} to="/cart" size="large" sx={{ color: "inherit" }}>
                      <Badge badgeContent={count} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Logout">
                    <IconButton onClick={handleLogout} sx={{ color: "inherit" }}>
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    color="inherit"
                    size="small"
                    sx={{ textTransform: "none", borderColor: "rgba(255,255,255,0.6)" }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: "none",
                      bgcolor: "rgba(255,255,255,0.18)",
                      color: "common.white",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {searching && (
        <Box
          sx={{
            height: 2,
            background: "linear-gradient(90deg, rgba(255,255,255,.6), rgba(255,255,255,0))",
          }}
        />
      )}
    </>
  );
}
