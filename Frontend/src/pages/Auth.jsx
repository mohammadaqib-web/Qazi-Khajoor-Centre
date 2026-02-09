import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import bgPattern from "../assets/bg.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5EDE3",
        backgroundImage: `url(${bgPattern})`,
        backgroundRepeat: "repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 800,
              color: "#3B2416",
              mb: 3,
            }}
          >
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </Typography>

          {/* FULL NAME (REGISTER ONLY) */}
          {!isLogin && (
            <TextField
              fullWidth
              label="Full Name*"
              sx={{ mb: 2 }}
            />
          )}

          {/* PHONE */}
          <TextField
            fullWidth
            label="Phone Number*"
            type="tel"
            sx={{ mb: 2 }}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            label="Password*"
            type="password"
            sx={{ mb: 2 }}
          />

          {/* FORGOT PASSWORD */}
          {isLogin && (
            <Typography
              sx={{
                textAlign: "right",
                fontSize: 14,
                mb: 2,
                color: "#6F4E37",
                cursor: "pointer",
              }}
            >
              Forgot your password?
            </Typography>
          )}

          {/* ACTION BUTTON */}
          <Button
            fullWidth
            sx={{
              backgroundColor: "#D4A373",
              color: "#3B2416",
              fontWeight: 700,
              py: 1.4,
              mb: 2,
              "&:hover": {
                backgroundColor: "#c18f5c",
              },
            }}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>

          {/* TOGGLE */}
          <Typography sx={{ fontSize: 14 }}>
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#D4A373",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setIsLogin(false)}
                >
                  Create Account
                </Box>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#D4A373",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </Box>
              </>
            )}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
