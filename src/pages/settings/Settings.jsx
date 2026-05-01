import { Container, Typography, useMediaQuery } from "@mui/material";
import TabComponent from "../../components/TabComponent";
import { useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../../components/Loader";
import Selector from "../../components/Selector"


const Profile = lazy(() => import("./profile/Profile"));
const SecuritySettings = lazy(() => import("./securitySettings/SecuritySettings"));
const TradingConditions = lazy(() => import("./tradingConditions/TradingConditions"));
const TradingTerminals = lazy(() => import("./tradingTerminals/TradingTerminals"));
const UpdateProfile = lazy(() => import("./updateProfile/UpdateProfile"));
// const VirtualPrivateServer = lazy(() => import("./virtualPrivateServer/VirtualPrivateServer"));

const TABS = {
    Profile: "Profile",
    // Update_Profile: "Update Profile",
    Security_Settings: "Security Settings",
    Trading_Terminals: "Trading Terminals",
    Trading_Conditions: "Trading Conditions",
    // Virtual_Private_Server: "Virtual Private Server",
};

const PATHS = {
    [TABS.Profile]: "profile",
    // [TABS.Update_Profile]: "updateProfile",
    [TABS.Security_Settings]: "securitySettings",
    [TABS.Trading_Conditions]: "tradingConditions",
    [TABS.Trading_Terminals]: "tradingTerminals",
    // [TABS.Virtual_Private_Server]: "virtualPrivateServer"
};

const COMPONENTS = {
    [TABS.Profile]: Profile,
    // [TABS.Update_Profile]: UpdateProfile,
    [TABS.Security_Settings]: SecuritySettings,
    [TABS.Trading_Conditions]: TradingConditions,
    [TABS.Trading_Terminals]: TradingTerminals,
    // [TABS.Virtual_Private_Server]: VirtualPrivateServer
};

function Settings() {

    const matches = useMediaQuery('(min-width:620px)');

    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        return Object.keys(PATHS).find(tab => location.pathname.includes(PATHS[tab])) || TABS.Profile;
    };

    const active = getActiveTab();
    const ActiveComponent = COMPONENTS[active];

    function handleOnChange(newAlignment) {
        if (newAlignment) {
            navigate(`/client/settings/${PATHS[newAlignment]}`);
        }
    }

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>
                Settings
            </Typography>

            {
                matches
                    ?
                    <TabComponent
                        items={Object.values(TABS)}
                        active={active}
                        tabSx={{
                            fontSize: "1rem",
                            width: { xs: "33%", sm: "auto" }
                        }}
                        onChange={(_, newAlignment) => handleOnChange(newAlignment)}
                    />
                    :
                    <Selector
                        width={"300px"}
                        showDefaultOption={false}
                        items={Object.values(TABS)}
                        value={active}
                        onChange={(e) => handleOnChange(e.target.value)}
                    />
            }

            <Suspense fallback={<Loader />}>
                <ActiveComponent />
            </Suspense>
        </Container>
    );
}

export default Settings;