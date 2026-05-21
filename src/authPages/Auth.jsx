import { Box, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/Loader";
import earthRotationVideo from "/public/img/eirthrotation.mp4";

const SignIn = lazy(() => import("./signIn/SignIn"));
const SignUp = lazy(() => import("./signUp/SignUp"));

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;
const BRAND_LOGO_DARK = import.meta.env.VITE_BRAND_LOGO_DARK;

function Auth() {
    const location = useLocation();

    const isSignUp = location.pathname.toLowerCase().includes("signup");
    const ActiveComponent = isSignUp ? SignUp : SignIn;

    const heading = isSignUp ? "Register" : "Welcome Back";
    const subheading = isSignUp
        ? "Fill up your details and open an account in a few minutes"
        : "Login with your email and password";

    return (
        <Box sx={{
            background: "rgb(233, 233, 233)",
            minHeight: "100dvh",
            position: "relative",
            overflowX: "hidden"
        }}>
            {/* Video Background */}
            <Box sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                width: { xs: "80%", md: "62%" },
                height: { xs: "80%", md: "90%" },
                right: { xs: "-150px", md: "-240px" },
                top: { xs: "-100px", md: "-200px" },
                zIndex: 0,
                overflow: "hidden"
            }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                >
                    <source src={earthRotationVideo} type="video/mp4" />
                </video>
            </Box>

            <Grid container sx={{ minHeight: "100vh", alignItems: "stretch", justifyContent: "center", m: 0 }}>
                {/* LEFT — Form Card */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ display: "flex", alignItems: "center", p: { xs: 2, md: 3 } }}
                >
                    <Grid
                        sx={{
                            bgcolor: "white",
                            borderRadius: "20px",
                            boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                            p: { xs: "1rem", md: "1.5rem" },
                            my: "0.75rem",
                            mx: "auto",
                            width: "100%",
                            maxWidth: "500px",
                            position: "relative",
                            minHeight: { xs: "auto", md: "calc(100vh - 32px)" },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}
                    >
                        {/* Logo */}
                        {BRAND_LOGO_DARK && (
                            <Box sx={{ textAlign: "center", mb: 1 }}>
                                <img src={BRAND_LOGO_DARK} alt="logo" style={{ height: "40px", objectFit: "contain" }} />
                            </Box>
                        )}

                        {/* Heading */}
                        <Box sx={{ mt: "2rem", mb: "1.5rem", textAlign: "center" }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {heading}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                                {subheading}
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Suspense fallback={
                            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                                <Loader />
                            </Box>
                        }>
                            <ActiveComponent />
                        </Suspense>
                    </Grid>
                </Grid>

                {/* RIGHT — Hero Text */}
                <Grid
                    item
                    md={6}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "flex-end",
                        px: "1.5rem",
                        pb: "3rem",
                        position: "relative",
                        zIndex: 1
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                mb: "1rem",
                                fontSize: { md: "28px", lg: "clamp(28px, 4.5vw, 58px)" },
                                lineHeight: 1.05,
                            }}
                        >
                            Build Your<br />
                            Digital Portfolio<br />
                            With Confidence
                        </Typography>
                        <Typography sx={{ maxWidth: "520px" }}>
                            At {SHORT_BRAND_NAME} explore a wide range of account types. Compare and choose
                            the trading account that suits your trading personality!
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Auth;
