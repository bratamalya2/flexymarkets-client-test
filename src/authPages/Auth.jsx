import { Container, Typography, Stack } from "@mui/material";
import TabComponent from "../components/TabComponent";
import { useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useMemo } from "react";
import Loader from "../components/Loader";

const SignIn = lazy(() => import("./signIn/SignIn"));
const SignUp = lazy(() => import("./signUp/SignUp"));

const TABS = {
    Sign_In: "Sign in",
    Sign_Up: "Create an account",
};

const PATHS = {
    [TABS.Sign_In]: "signIn",
    [TABS.Sign_Up]: "signUp",
};

const COMPONENTS = {
    [TABS.Sign_In]: SignIn,
    [TABS.Sign_Up]: SignUp,
};


const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function Auth() {

    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        return Object.keys(PATHS).find(tab =>
            location.pathname.toLowerCase().includes(PATHS[tab].toLowerCase())
        ) || TABS.Sign_In;
    };

    const active = getActiveTab();

    const ActiveComponent = useMemo(() => COMPONENTS[active], [active]);

    function handleOnChange(newAlignment) {
        if (newAlignment) {
            navigate(`/accounts/${PATHS[newAlignment]}`);
        }
    }

    return (
        <Container
            maxWidth={"xs"}
            sx={{
                mt: "6rem",
                flex: 1,
                py: 2
            }}
        >
            <Typography sx={{ fontSize: "1.7rem", fontWeight: "700", my: "1rem" }}>Welcome to {SHORT_BRAND_NAME}</Typography>
            <Stack>
                <TabComponent
                    items={Object.values(TABS)}
                    tabSx={{ fontSize: "1rem", width: "50%" }}
                    onChange={(_, newAlignment) => handleOnChange(newAlignment)}
                    active={active}
                />
            </Stack>
            <Suspense fallback={<Loader />}>
                {ActiveComponent ? <ActiveComponent /> : <Typography>Invalid tab</Typography>}
            </Suspense>
        </Container>
    );
}

export default Auth;