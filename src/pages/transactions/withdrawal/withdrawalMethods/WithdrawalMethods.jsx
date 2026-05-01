import { Stack, Typography, Card, useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { withdrawalMethodsData } from './withdrawalMethodsData'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import LockIcon from '@mui/icons-material/Lock';


function WithdrawalMethods() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified

    const matcheForCardSize = useMediaQuery('(min-width:675px)');
    const hideSpecification = useMediaQuery('(min-width:675px) and (max-width:760px)')
    const hideSpecification2 = useMediaQuery('(min-width:400px)')

    return (
        <Stack gap={"1rem"}>
            <Typography variant='h6' fontWeight={"700"} fontSize={"1.5rem"}>
                {!(!isLoading && isKycVerified) && "Verification required"}
            </Typography>
            <Grid container size={12} spacing={4}>
                {
                    withdrawalMethodsData.map((item, i) => (
                        <Grid
                            variant={"section"}
                            key={i}
                            size={matcheForCardSize ? 6 : 12}
                            component={Link}
                            to={item.to}
                            sx={{
                                border: "1px solid #c3c5c7",
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
                                textDecoration: "none",
                                color: "inherit"
                            }}
                        >
                            {/* <Grid sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                                <img src={item.img} alt='error' height={"30px"} width={"30px"} />
                                <Typography fontWeight={"700"}>{item.methodName}</Typography>
                            </Grid> */}
                            <Grid
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: ".5rem",
                                    alignItems: "center"
                                }}
                            >
                                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
                                    <img src={item.img} alt='error' height={"30px"} width={"30px"} />
                                    <Typography fontWeight={"700"}
                                    // color='#72777a'
                                    >{item.methodName}</Typography>
                                </Stack>
                                {item.specification && <Stack px={"8px"} py={"2px"} borderRadius={"1rem"} color='rgb(163, 128, 33)' bgcolor={"#f3ecd8"} flexDirection={"row"} alignItems={"center"} gap={".2rem"}>
                                    <Typography><LockIcon sx={{ fontSize: "" }} /></Typography>
                                    {(hideSpecification2 && !hideSpecification) && (
                                        <Typography fontSize={"12px"}>{item.specification}</Typography>
                                    )}
                                </Stack>}
                            </Grid>
                            <Grid>
                                {
                                    Object.entries(item?.details).map(([key, value], i) => (
                                        <Stack key={i} sx={{ flexDirection: "row", gap: ".5rem", alignItems: "center" }}>
                                            <Typography color='#989b9f' fontSize={"14px"}>{key}</Typography>
                                            <Typography fontSize={"14px"}>{value}</Typography>
                                        </Stack>
                                    ))
                                }
                            </Grid>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default WithdrawalMethods;