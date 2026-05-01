import { Typography, Box, Container } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import VerifyOtp from "./VerifyOtp";
import EnterNewPassword from "./EnterNewPassword";


function ResetPassword() {

    const [searchParams] = useSearchParams()

    const forgotPasswordStep = searchParams.get('forgotPasswordStep') || "sendOTP"

    const resetPasswordMaping = {
        sendOTP: ForgotPassword,
        verifyOTP: VerifyOtp,
        enterNewPassword: EnterNewPassword
    }

    const ActiveStep = resetPasswordMaping[forgotPasswordStep]

    return (
        <Container
            maxWidth={"xs"}
            sx={{
                mt: "6rem",
                flex: 1,
                py: 2
            }}
        >
            <ActiveStep />
            <Box sx={{ textAlign: "center", mt: "1.2rem" }}>
                <Typography component={Link} to={"/accounts/signIn"} sx={{ textDecoration: "none", color: "#1172cc" }}>Sign In now</Typography>
            </Box>
        </Container>
    );
}

export default ResetPassword;