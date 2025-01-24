import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({
  fontFamily: "Manrope, sans-serif",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
