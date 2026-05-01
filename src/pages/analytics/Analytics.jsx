import { Container, Typography } from "@mui/material";
import TabComponent from "../../components/TabComponent";
import { useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../../components/Loader";


const AnalystViews = lazy(() => import("./analystViews/AnalystViews"));
const MarketNews = lazy(() => import("./marketNews/MarketNews"));


const TABS = {
  ANALYST_VIEWS: "Analyst Views",
  MARKET_NEWS: "Market News",
};

const PATHS = {
  [TABS.ANALYST_VIEWS]: "analystViews",
  [TABS.MARKET_NEWS]: "marketNews",
};

function Analytics() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () =>
    Object.keys(PATHS).find((tab) => location.pathname.includes(PATHS[tab])) || TABS.ANALYST_VIEWS;

  const active = getActiveTab();

  function handleOnChange(newAlignment) {
    if (newAlignment) {
      navigate(`/client/analytics/${PATHS[newAlignment]}`);
    }
  }

  return (
    <Container>
      <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>
        Analysts
      </Typography>

      <TabComponent
        items={Object.values(TABS)}
        active={active}
        tabSx={{ fontSize: "1rem", width: { xs: "50%", sm: "auto" } }}
        onChange={(_, newAlignment) => handleOnChange(newAlignment)}
      />

      <Suspense fallback={<Loader />}>
        {active === TABS.MARKET_NEWS ? <MarketNews /> : <AnalystViews />}
      </Suspense>
    </Container>
  );
}

export default Analytics;