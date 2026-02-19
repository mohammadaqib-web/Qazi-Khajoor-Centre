import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import logo from "../assets/logo-dark.png";

const fade = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  30% { opacity: 1; transform: scale(1); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: scale(1.05); }
`;

const breathe = keyframes`
  0% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.95); }
`;

const PageLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#f5f0e6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Box
        component="img"
        src={logo}
        sx={{
          width: 250,
          animation: `${breathe} 1.5s ease-in-out infinite`,
        }}
      />
    </Box>
  );
};

export default PageLoader;
