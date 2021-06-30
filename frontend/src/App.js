import React from "react";
import NavBar from "./Navbar";
import { AuthProvider } from "./content/AuthContent";
import { SnackbarProvider } from "notistack";

export default function App() {

  return (
    <div style={{ height: "100vh", maxHeight: "100vh", overflowY: "auto" }}>
      <AuthProvider>
        <SnackbarProvider maxSnack={3}>
          <NavBar />
        </SnackbarProvider>
      </AuthProvider>
    </div>
  );
}
