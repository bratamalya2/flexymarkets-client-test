import { Card, Box, Typography, Button, Stack, useTheme, alpha } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../globalState/userState/userStateApis";
import { Link } from "react-router-dom";

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME || "Adam Capitals";

function WalletCard() {
    const theme = useTheme();
    const { selectedTheme } = useSelector((state) => state.themeMode);

    const brandLight = theme.palette.custom.brandLight;
    const brandDark = theme.palette.custom.brandDark;

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const mainBalance = Number(
        (!isLoading && data?.data?.assetData?.mainBalance) || 0
    ).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return (
        <Card
            sx={{
                p: 3,
                borderRadius: 4,
                background: `linear-gradient(
          135deg,
          ${alpha(brandLight, 0.1)} 0%,
          ${alpha(brandLight, 0.2)} 40%,
          ${brandDark} 100%
        )`,
                color: brandDark,
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box color={selectedTheme === "dark" ? "white" : brandDark}>
                    <Typography fontWeight={700} fontSize={20}>
                        {SHORT_BRAND_NAME}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Global Trading Wallet
                    </Typography>
                </Box>

                <Typography
                    component={Link}
                    to="/client/transactions/transactionsList"
                    variant="body2"
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    Transaction history →
                </Typography>
            </Stack>

            <Box
                sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    background: `linear-gradient(
                        135deg,
                        ${brandDark} 0%,
                        ${alpha(brandDark, 0.8)} 60%,
                        ${brandLight} 100%
                    )`,
                    color: "white",
                }}
            >
                <Typography fontSize={28} fontWeight={700}>
                    {mainBalance} USD
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    Wallet Balance
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        startIcon={<AddIcon />}
                        component={Link}
                        to="/client/transactions/deposit"
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            background: brandLight,
                            color: brandDark,
                            fontWeight: 600,
                            "&:hover": {
                                background: alpha(brandLight, 0.8),
                            },
                        }}
                    >
                        Deposit
                    </Button>

                    <Button
                        startIcon={<ArrowOutwardIcon />}
                        component={Link}
                        to="/client/transactions/withdrawal"
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            color: brandLight,
                            borderColor: alpha(brandLight, 0.45),
                            "&:hover": {
                                borderColor: brandLight,
                                background: alpha(brandLight, 0.1),
                            },
                        }}
                    >
                        Withdraw
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
}

export default WalletCard;
