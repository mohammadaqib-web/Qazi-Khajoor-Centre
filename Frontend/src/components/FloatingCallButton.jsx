import CallIcon from "@mui/icons-material/Call";
import { Box } from "@mui/material";

const phoneNumber = import.meta.env.VITE_APP_PHONE_NUMBER;

const FloatingCallButton = () => {
  return (
    <Box
      component="a"
      href={`tel:${phoneNumber}`}
      sx={{
        position: "fixed",
        bottom: 90, // keep above WhatsApp button if both exist
        right: 20,
        backgroundColor: "#3B2416",
        color: "#fff",
        width: 56,
        height: 56,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#3B2416",
        },
      }}
    >
      <CallIcon fontSize="large" />
    </Box>
  );
};

export default FloatingCallButton;