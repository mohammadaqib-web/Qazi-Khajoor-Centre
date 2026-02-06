import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#F5EDE3",
  //     },
  //     secondary: {
  //       main: "#D4A373",
  //     },
  //     background: {
  //       default: "#F5EDE3",
  //       paper: "#FFFFFF",
  //     },
  //     text: {
  //       primary: "#3B2416",
  //       secondary: "#6F4E37",
  //     },
  //   },

  components: {
    // MuiAppBar: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: "transparent",
    //       backgroundImage: "none",
    //     },
    //   },
    // },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F5EDE3",
          backgroundImage: "url('/assets/bg.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
          backgroundAttachment: "fixed",
        },
      },
    },
  },
});

export default theme;
