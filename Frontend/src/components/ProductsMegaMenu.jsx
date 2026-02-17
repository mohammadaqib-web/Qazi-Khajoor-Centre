import {
  Box,
  Button,
  Popper,
  Paper,
  Grid,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { productsMenuData } from "./productsMenuData";

const ProductsMegaMenu = ({ categories }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleToggle = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        {/* PRODUCTS BUTTON */}
        <Button
          onClick={handleToggle}
          sx={{
            color: "#3B2416",
            fontWeight: "bold",
            backgroundColor: open ? "#D4A373" : "transparent",
            "&:hover": { backgroundColor: "#D4A373" },
          }}
        >
          Products
        </Button>

        {/* MEGA MENU */}
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          disablePortal
          modifiers={[{ name: "offset", options: { offset: [0, 12] } }]}
          sx={{ zIndex: 1300 }}
        >
          <Paper
            sx={{
              p: 4,
              // width: "100%",
              minWidth: 600, // 👈 minimum width
              maxWidth: 1200,
              width: "auto",
              // maxWidth: "1200px",
              backgroundColor: "#FFF8EB",
            }}
          >
            {/* Title Only Once */}
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: 14,
                textTransform: "uppercase",
                cursor: "pointer",
                "&:hover": { color: "#C59A3D" },
              }}
              onClick={() => navigate(`/allProducts`)}
            >
              ALL PRODUCTS
            </Typography>

            <Grid container spacing={4}>
              {categories &&
                Array.from({ length: Math.ceil(categories.length / 4) }).map(
                  (_, columnIndex) => {
                    const columnItems = categories.slice(
                      columnIndex * 4,
                      columnIndex * 4 + 4,
                    );

                    return (
                      <Grid
                        // item
                        // xs={12}
                        // sm={6}
                        // md={3}
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={columnIndex}
                      >
                        {columnItems.map((item) => (
                          <Typography
                            key={item._id}
                            sx={{
                              mb: 1.2,
                              fontSize: 14,
                              cursor: "pointer",
                              textTransform: "uppercase",
                              "&:hover": { color: "#C59A3D" },
                            }}
                            onClick={() =>
                              navigate(
                                `/${encodeURIComponent(item.name)}/${item._id}`,
                              )
                            }
                          >
                            {item.name}
                          </Typography>
                        ))}
                      </Grid>
                    );
                  },
                )}
            </Grid>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default ProductsMegaMenu;
