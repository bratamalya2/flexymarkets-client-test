import { useState } from "react";
// import CopiersDashboard from "./ranklistcomponents/Copiers";
// import RatingDashboard from "./ranklistcomponents/Rating";

import {
  ToggleButton,
  ToggleButtonGroup,
  Box,
  useTheme,
  alpha
} from "@mui/material";
// import RiskbandDashboard from "./ranklistcomponents/Riskband";
// import WinrateDashboard from "./ranklistcomponents/Winrate";
// import ReturnDashboard from "./ranklistcomponents/Return";
import MasterTradersTable from "./ranklistcomponents/MasterTradersTable";
import WatchListTable from "./ranklistcomponents/WatchListTable";
import SubscriptionList from "./ranklistcomponents/SubscriptionList";
// import TradeList from "./ranklistcomponents/TradeList";

function Ranklistcomponent() {
  const theme = useTheme();
  const [view, setView] = useState("master_traders");

  const handleChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <>
      {/* Header Toggle */}
      <Box
        mx={3}
        my={3}
        display="flex"
        alignItems="center"
        sx={{
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.5)
            : "#ffffff80",
          borderRadius: "14px",
          padding: "6px",
          width: "fit-content",
        }}
      >
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleChange}
          sx={{
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: "10px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              "&.Mui-selected": {
                backgroundColor: "#1976d2 !important",
                color: "#ffffff",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.35)",
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              }
            },
          }}
        >
          {/* <ToggleButton value="rating">
            Rating
          </ToggleButton>

          <ToggleButton value="copier">
            Copiers
          </ToggleButton> */}

          {/* <ToggleButton value="riskband">
            Risk band
          </ToggleButton> */}

          {/* <ToggleButton value="winrate">
            Win Rate
          </ToggleButton>
          <ToggleButton value="return">
            Return
          </ToggleButton> */}
          {/* <ToggleButton value="trade_list">
            Trade List
          </ToggleButton> */}
          <ToggleButton value="master_traders">
            Master Traders
          </ToggleButton>
          <ToggleButton value="subscription_list">
            Subscription List
          </ToggleButton>
          <ToggleButton value="watch_list">
            Watch List
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      {/* {view === "rating" && <RatingDashboard />}
      {view === "copier" && <CopiersDashboard />} */}
      {/* {view === "riskband" && <RiskbandDashboard />} */}
      {/* {view === "winrate" && <WinrateDashboard />}
      {view === "return" && <ReturnDashboard />} */}
      {/* {view === "trade_list" && <TradeList />} */}
      {view === "subscription_list" && <SubscriptionList />}
      {view === "master_traders" && <MasterTradersTable />}
      {view === "watch_list" && <WatchListTable />}
    </>
  );
}

export default Ranklistcomponent;
