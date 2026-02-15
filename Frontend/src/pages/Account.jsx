import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import bgPattern from "../assets/bg.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const sections = ["Profile", "Orders", "Change Password", "Logout"];

const ProfileSection = () => (
  <>
    <Typography variant="h6" fontWeight={700} mb={3}>
      Profile Information
    </Typography>

    <Divider sx={{ backgroundColor: "#fff", borderWidth: 1, mt: -3, mb: 3 }} />

    <Grid
      container
      spacing={3}
      sx={{
        // target LABEL (first Typography inside Info)
        "& .MuiTypography-root:first-of-type": {
          color: "rgba(255,255,255,0.6)", // gray label
          fontSize: 13,
        },

        // target VALUE (second Typography)
        "& .MuiTypography-root:nth-of-type(2)": {
          color: "#fff",
          fontWeight: 600,
        },
      }}
    >
      <Grid size={{ xs: 12, md: 6 }}>
        <Info label="Full Name" value="Mohammad Aqib" />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Info label="Phone Number" value="Not added" />
      </Grid>
    </Grid>
  </>
);

const Info = ({ label, value }) => (
  <Box>
    <Typography fontSize={13} color="gray">
      {label}
    </Typography>
    <Typography fontWeight={600}>{value}</Typography>
  </Box>
);

const OrdersSection = () => (
  <>
    <Typography variant="h6" fontWeight={700} mb={3}>
      My Orders
    </Typography>

    <Box
      sx={{
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {[0, 1, 2, 3].map((item, index) => (
        <Box sx={{ width: { xs: "100%", sm: 185 } }} key={index}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              {/* IMAGE LEFT */}
              <Grid size={{ xs: 12 }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1607664608695-45aaa6d621fc"
                  alt="Product"
                  sx={{
                    width: "100%",
                    // maxWidth: 100,
                    borderRadius: 2,
                    objectFit: "contain",
                  }}
                />
              </Grid>

              {/* DETAILS RIGHT */}
              <Grid size={{ xs: 12 }} sx={{ mt: -2 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Order #{item}
                </Typography>
                <Typography fontSize={14}>Amount: ₹1,250</Typography>
                <Typography fontSize={14}>Status: Delivered</Typography>
                <Typography fontSize={14}>Payment method: COD</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ))}
    </Box>
  </>
);

const ChangePassword = ({ showPassword, setShowPassword }) => (
  <>
    <Typography variant="h6" fontWeight={700} mb={3}>
      Change Password
    </Typography>

    <Grid container spacing={3} maxWidth={500}>
      <Grid size={{ xs: 12, md: 8 }}>
        <TextField
          fullWidth
          // label="New Password"
          placeholder="New Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <TextField
          fullWidth
          // label="Re-enter New Password"
          placeholder="Re-enter New Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#d4a373",
            color: "#000",
            fontWeight: 600,
            px: 4,
            "&:hover": {
              backgroundColor: "#c08a55",
            },
          }}
        >
          Update Password
        </Button>
      </Grid>
    </Grid>
  </>
);

const Account = () => {
  const [active, setActive] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Box
      sx={{ backgroundImage: `url(${bgPattern})`, minHeight: "100vh", py: 6 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* LEFT SIDEBAR */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ backgroundColor: "#3B2416", color: "#fff" }}>
              <Box sx={{ p: 2 }}>
                <Typography fontWeight={700}>Mohammad Aqib</Typography>
                <Typography fontSize={13} color="#ccc">
                  mohdaqib918@gmail.com
                </Typography>
              </Box>

              <Divider />

              <List>
                {sections.map((item) => (
                  <ListItemButton
                    key={item}
                    selected={active === item}
                    onClick={() => {
                      if (item !== "Logout") setActive(item);
                      else {
                        dispatch(logout());
                        toast.success("You are logged out!");
                        navigate("/auth");
                      }
                    }}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#fff",
                        color: "#000",
                      },
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "#000",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#fff",
                        color: "#000",
                      },
                    }}
                  >
                    <ListItemText primary={item} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* RIGHT CONTENT */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper sx={{ p: 4, backgroundColor: "#3B2416", color: "#fff" }}>
              {active === "Profile" && <ProfileSection />}
              {active === "Orders" && <OrdersSection />}
              {active === "Change Password" && (
                <ChangePassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Account;
