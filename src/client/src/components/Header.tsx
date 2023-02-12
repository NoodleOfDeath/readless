import React from "react";
import { AppBar, Toolbar } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <h1>ChatGPTalks</h1>
      </Toolbar>
    </AppBar>
  );
}
