import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import bgPattern from "../assets/bg.png";
import { loginSuccess } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1 = form, 2 = otp
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Setup Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("Recaptcha verified");
          },
        },
      );
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    try {
      setupRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        `+91${formData.number}`,
        window.recaptchaVerifier,
      );

      setConfirmationResult(result);
      setStep(2);
      alert("OTP Sent Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to send OTP");
    }
  };

  // Verify OTP + Register/Login
  const handleVerifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();

      if (isLogin) {
        // LOGIN API
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API}/auth/login`,
          {
            number: formData.number,
            password: formData.password,
          },
        );

        localStorage.setItem("token", res.data.token);
        alert("Login Success");
      } else {
        // REGISTER API
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API}/auth/register`,
          {
            ...formData,
            firebaseToken,
          },
        );
        const loginTime = dayjs().valueOf();
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
            loginTime: loginTime,
          }),
        );
        toast.success("Login Successful!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    }
  };

  // LOGIN API
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/auth/login`,
        {
          number: formData.number,
          password: formData.password,
        },
      );
      const loginTime = dayjs().valueOf();
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
          loginTime: loginTime,
        }),
      );
      toast.success("Login Successful!");
      navigate("/");
    } catch (error) {
      console.log({ error: error.response.data.message });
    }
  };

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
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            sx={{ fontSize: 26, fontWeight: 800, color: "#3B2416", mb: 3 }}
          >
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </Typography>

          {step === 1 && (
            <>
              {!isLogin && (
                <TextField
                  fullWidth
                  label="Full Name*"
                  name="name"
                  sx={{ mb: 2 }}
                  onChange={handleChange}
                />
              )}

              <TextField
                fullWidth
                label="Phone Number*"
                name="number"
                type="tel"
                sx={{ mb: 2 }}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Password*"
                name="password"
                type="password"
                sx={{ mb: 2 }}
                onChange={handleChange}
              />

              {isLogin ? (
                <Button
                  fullWidth
                  onClick={handleLogin}
                  sx={{
                    backgroundColor: "#D4A373",
                    color: "#3B2416",
                    fontWeight: 700,
                    py: 1.4,
                  }}
                >
                  Login
                </Button>
              ) : (
                <Button
                  fullWidth
                  onClick={handleSendOtp}
                  sx={{
                    backgroundColor: "#D4A373",
                    color: "#3B2416",
                    fontWeight: 700,
                    py: 1.4,
                  }}
                >
                  Sign up
                </Button>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                onClick={handleVerifyOtp}
                sx={{
                  backgroundColor: "#D4A373",
                  color: "#3B2416",
                  fontWeight: 700,
                  py: 1.4,
                }}
              >
                Verify OTP
              </Button>
            </>
          )}

          <div id="recaptcha-container"></div>

          <Typography sx={{ mt: 2 }}>
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <Box
                  component="span"
                  sx={{ color: "#D4A373", cursor: "pointer" }}
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
                  sx={{ color: "#D4A373", cursor: "pointer" }}
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
