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
import { productsMenuData } from "./productsMenuData";

const ProductsMegaMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
          PRODUCTS
        </Button>

        {/* MEGA MENU */}
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          disablePortal
          modifiers={[
            { name: "offset", options: { offset: [0, 12] } },
          ]}
          sx={{ zIndex: 1300 }}
        >
          <Paper
            sx={{
              p: 4,
              width: "100%",
              maxWidth: "1200px",
              backgroundColor: "#FFF8EB",
            }}
          >
            <Grid container spacing={4}>
              {productsMenuData.map((column, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      fontSize: 14,
                      textTransform: "uppercase",
                    }}
                  >
                    {column.title}
                  </Typography>

                  {column.items.map((item) => (
                    <Typography
                      key={item}
                      sx={{
                        mb: 1.2,
                        fontSize: 14,
                        cursor: "pointer",
                        "&:hover": { color: "#C59A3D" },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default ProductsMegaMenu;
