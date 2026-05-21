import { Container, Typography } from "@mui/material";
import TabComponent from "../../../components/TabComponent";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense, useState, useEffect, useRef, useMemo } from "react";
import Loader from "../../../components/Loader";
import TransactionsList from "../../transactions/transactionsList/TransactionsList";
import { initiateMT5AccountDetailsSocketConnection } from "../../../socketENV/MT5AccountDetailsSocketENV";
import { useSelector } from "react-redux";
import OrderHistory from "../../performance/orderHistory/OrderHistory";


const MT5AccountsActions = lazy(() => import("./MT5AccountsActions"));


const TABS = {
    MT5AccountAction: "MT5 Account Actions",
    TransactionList: "Transaction History",
    Position: "Position"
};

const PATHS = {
    [TABS.MT5AccountAction]: "MT5AccountAction",
    [TABS.TransactionList]: "TransactionHistory",
    [TABS.Position]: "Position"
};

function MT5AccountsDetails() {

    const { token } = useSelector((state) => state.auth);
    const [activeAccountDetails, setActiveAccountDetails] = useState(null)

    const { id } = useParams()

    const socketRef = useRef()

    const navigate = useNavigate();
    const location = useLocation();


    const getActiveTab = () => {
        return Object.keys(PATHS).find(tab => location.pathname.includes(PATHS[tab])) || TABS.MT5AccountAction;
    };

    const active = getActiveTab();

    function handleOnChange(newAlignment) {
        if (newAlignment) {
            navigate(`/client/MT5AccountsDetails/${PATHS[newAlignment]}/${id}`);
        }
    }

    useEffect(() => {
        if (!id || !token) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        socketRef.current = initiateMT5AccountDetailsSocketConnection({
            login: id,
            token,
            accountData
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [id, token]);

    const accountData = (data) => {
        if (data) {
            setActiveAccountDetails(data?.marginDetails ? data?.marginDetails : data)
        }
    }

    const detailsData = useMemo(() => ({
        "Actual leverage": activeAccountDetails ? activeAccountDetails?.MarginLeverage || "- - - - -" : "- - - - -",
        "Free margin": activeAccountDetails ? activeAccountDetails?.MarginFree || "0.00 USD" : "0.00 USD",
        "Unrealized P&L": activeAccountDetails ? activeAccountDetails?.Profit || "0.00 USD" : "0.00 USD",
        "Equity": activeAccountDetails ? activeAccountDetails?.Equity || "0.00 USD" : "0.00 USD",
        "Credit": activeAccountDetails ? activeAccountDetails?.Credit || "0.00 USD" : "0.00 USD"
    }), [activeAccountDetails]);


    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>
                MT5 Accounts Details
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
                {active === TABS.MT5AccountAction && (
                    <MT5AccountsActions login={id} detailsData={detailsData} />
                )}

                {active === TABS.TransactionList && (
                    <TransactionsList marginTop="2rem" login={id} />
                )}

                {active === TABS.Position && (
                    <OrderHistory login={id} marginTop="2rem" />
                )}
            </Suspense>
        </Container>
    );
}

export default MT5AccountsDetails;