import { Skeleton, Stack, Typography } from '@mui/material'
import Grid from "@mui/material/Grid2"
import { useSelector } from 'react-redux'
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PersonIcon from '@mui/icons-material/Person';
import { useFtdReportQuery, useIbKycReportQuery, useLiveAccountQuery } from '../../../../globalState/ibState/ibStateApis';


function StatusOverviewSection() {

    const { selectedTheme } = useSelector((state) => state.themeMode)

    // const { data: completedIbKycData, isLoading: completedIBKycLoading } = useIbKycReportQuery({ kycStatus: true })
    const { data: IbKycData, isLoading: IBKycLoading } = useIbKycReportQuery()
    const { data: liveAccount, isLoading: liveAccountLoading } = useLiveAccountQuery()
    // const { } = useFtdReportQuery()

    // activeTrader, liveAccount

    // const { totalPendingKyc = 0 } = !IBKycLoading && IbKycData?.data
    // const { totalCompletedKyc = 0 } = !IBKycLoading && IbKycData?.data

    const totalPendingKyc = IBKycLoading || !IbKycData?.status ? 0 : IbKycData.data.totalPendingKyc || 0;
    const totalCompletedKyc = IBKycLoading || !IbKycData?.status ? 0 : IbKycData.data.totalCompletedKyc || 0;


    const statusOverviewData = [
        {
            name: "KYC",
            icon: FindInPageIcon,
            pending: IbKycData?.status ? totalPendingKyc || 0 : 0,
            complete: IbKycData?.status ? totalCompletedKyc || 0 : 0,
            isLoading: IBKycLoading || false,
            iconColor: "blue"
        },
        {
            name: "Live Account",
            icon: AutoAwesomeMotionIcon,
            pending: "",
            complete: "",
            isLoading: false,
            iconColor: "green"
        },
        {
            name: "FTD",
            icon: MoneyOffIcon,
            pending: "",
            complete: "",
            isLoading: false,
            iconColor: "red"
        },
        {
            name: "IB Status",
            icon: PersonIcon,
            pending: "",
            complete: "",
            isLoading: false,
            iconColor: "orange"
        }
    ]

    return (
        <Stack sx={{ mt: '2rem' }}>
            <Typography fontSize={"1.2rem"} mb={"1.2rem"}>IB Status</Typography>
            <Grid container size={12} spacing={2}>
                {
                    statusOverviewData.map((item) => (
                        <Grid
                            variant={"section"}
                            key={item.name}
                            size={{ xs: 12, sm: 6, md: 3 }}
                            sx={{ height: "100px", borderRadius: "10px", bgcolor: selectedTheme !== "dark" && "#f5f5f5", p: "1rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                        >
                            <Stack sx={{ flexDirection: "row", gap: "5px" }}>
                                <item.icon sx={{ color: item.iconColor }} />
                                {item.name}
                            </Stack>
                            <Stack sx={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <Stack sx={{ alignItems: "center" }}>
                                    {item.isLoading ? <Skeleton width={"100%"} /> : <Typography color='green' fontSize={"1rem"}>{item.complete}</Typography>}
                                    <Typography fontSize={"12px"}>Complete</Typography>
                                </Stack>
                                <Stack sx={{ alignItems: "center" }}>
                                    {item.isLoading ? <Skeleton width={"100%"} /> : <Typography color='red' fontSize={"1rem"}>{item.pending}</Typography>}
                                    <Typography fontSize={"12px"}>Pending</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default StatusOverviewSection;