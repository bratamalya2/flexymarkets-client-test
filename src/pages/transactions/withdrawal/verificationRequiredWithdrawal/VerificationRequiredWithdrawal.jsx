import { Card, Stack, Typography, useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { verificationRequiredWithdrawalData } from './verificationRequiredWithdrawalData';
import LockIcon from '@mui/icons-material/Lock';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


function DepositMethodsVerificationRequired() {

    const { selectedTheme } = useSelector((state) => state.themeMode);
    const matcheForCardSize = useMediaQuery('(min-width:675px)');
    const hideSpecification = useMediaQuery('(min-width:675px) and (max-width:760px)')
    const hideSpecification2 = useMediaQuery('(min-width:400px)')

    return (
        <Stack mt={"2rem"} gap={"1rem"}>
            <Typography variant='h6' fontWeight={"700"} fontSize={"1.5rem"}>Verification required</Typography>
            <Grid container size={12} spacing={4}>
                {
                    verificationRequiredWithdrawalData.map((item, i) => (
                        <Grid size={matcheForCardSize ? 6 : 12} key={i}>
                            <Card
                                component={Link}
                                to={"/client/transactions/withdrawal/withdrawalFrom"}
                                sx={{
                                    border: selectedTheme === "dark" ? "none" : "1px solid #c3c5c7",
                                    p: "1.5rem",
                                    borderRadius: ".7rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                    boxShadow: "none",
                                    transition: "box-shadow 0.3s ease-in-out",
                                    "&:hover": {
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                    },
                                    textDecoration: "none"
                                }}
                            >
                                <Grid
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: ".5rem",
                                        alignItems: "center"
                                    }}
                                >
                                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
                                        <img src={item.img} alt='error' />
                                        <Typography fontWeight={"700"} color='#72777a'>{item.methodName}</Typography>
                                    </Stack>
                                    <Stack px={"8px"} py={"2px"} borderRadius={"1rem"} color='rgb(163, 128, 33)' bgcolor={"#f3ecd8"} flexDirection={"row"} alignItems={"center"} gap={".2rem"}>
                                        <Typography><LockIcon sx={{ fontSize: "" }} /></Typography>
                                        {(hideSpecification2 && !hideSpecification) && (
                                            <Typography fontSize={"12px"}>{item.specification}</Typography>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid>
                                    {
                                        Object.entries(item?.details).map(([key, value], i) => (
                                            <Stack sx={{ flexDirection: "row", gap: ".5rem", alignItems: "center", color: '#989b9f' }}>
                                                <Typography fontSize={"14px"}>{key}</Typography>
                                                <Typography fontSize={"14px"}>{value}</Typography>
                                            </Stack>
                                        ))
                                    }
                                </Grid>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )

}

export default DepositMethodsVerificationRequired;