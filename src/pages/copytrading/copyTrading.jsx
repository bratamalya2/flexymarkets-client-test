import { useState } from "react";
import TradingHero from "./copytradinghero/herocomponent.jsx";
import Ranklistcomponent from "./ranklist/ranklistpage.jsx";
import TradingDashboardLayout from "./recommendation/recommendation.jsx";

import {
  ToggleButton,
  ToggleButtonGroup,
  Box,
  useTheme
} from "@mui/material";

export default function Copytranding() {
  const theme = useTheme();
  const [view, setView] = useState("dashboard");

  const handleChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <>
      <TradingHero />

      <Box
        mx={3}
        my={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : "#f5f5f5",
          borderRadius: "16px",
          padding: "8px 12px",
        }}
      >
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleChange}
          sx={{
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: "12px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              "&.Mui-selected": {
                backgroundColor: "#1976d2 !important",
                color: "#ffffff",
                boxShadow: "0 4px 16px rgba(25,118,210,0.4)",
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              }
            },
          }}
        >
          <ToggleButton value="dashboard">
            Dashboard
          </ToggleButton>

          <ToggleButton value="ranklist">
            Rank List
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {view === "dashboard" && <TradingDashboardLayout />}
      {view === "ranklist" && <Ranklistcomponent />}
    </>
  );
}