import { Container, Typography } from "@mui/material";
import TabComponent from "../../components/TabComponent";
import { useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../../components/Loader";


// const OrderSummary = lazy(() => import("./orderSummary/OrderSummary"));
const OrderHistory = lazy(() => import("./orderHistory/OrderHistory"));
const Benefits = lazy(() => import("./benefits/Benefits"));
const Quotes = lazy(() => import("./quotes/Quotes"));


const TABS = {
    // SUMMARY: "Summary",
    HISTORY: "History of Orders",
    // BENEFITS: "Benefits",
    QUOTES: "Quotes"
};

const PATHS = {
    // [TABS.SUMMARY]: "ordersSummary",
    [TABS.HISTORY]: "ordersHistory",
    // [TABS.BENEFITS]: "benefits",
    [TABS.QUOTES]: "quotes"
};

function Performance() {
    const navigate = useNavigate();
    const location = useLocation();


    const getActiveTab = () => {
        return Object.keys(PATHS).find(tab => location.pathname.includes(PATHS[tab])) || TABS.SUMMARY;
    };

    const active = getActiveTab();

    function handleOnChange(newAlignment) {
        if (newAlignment) {
            navigate(`/client/performance/${PATHS[newAlignment]}`);
        }
    }

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>
                Performance
            </Typography>

            <TabComponent
                items={Object.values(TABS)}
                active={active}
                tabSx={{
                    fontSize: "1rem",
                    width: { xs: "33%", sm: "auto" }
                }}
                onChange={(_, newAlignment) => handleOnChange(newAlignment)}
            />
            <Suspense fallback={<Loader />}>
                {active === TABS.HISTORY ? <OrderHistory /> : active === TABS.BENEFITS ? <Benefits /> : <Quotes />}
            </Suspense>
        </Container>
    );
}

export default Performance;