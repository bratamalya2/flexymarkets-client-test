import { Stack, Typography, Skeleton } from '@mui/material'
import Grid from "@mui/material/Grid2"
import { useSelector } from 'react-redux'
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { useLiveAccountQuery } from '../../../../globalState/ibState/ibStateApis';


function ActiveTradersAndIBs() {

    const { selectedTheme } = useSelector((state) => state.themeMode)

    const { data: liveAccount, isLoading: liveAccountLoading } = useLiveAccountQuery()

    const totalAccount = !liveAccountLoading && liveAccount?.data

    const totalActiveTraders = totalAccount?.activeTraders?.length || 0

    const statusOverviewData = [
        {
            name: "Active Traders",
            icon: GroupIcon,
            iconColor: "blue",
            total: totalActiveTraders,
            isLoading: liveAccountLoading
        },
        {
            name: "Active IB",
            icon: PersonIcon,
            iconColor: "green"
        },
    ]

    return (
        <Stack sx={{ mt: '2rem' }}>
            <Typography fontSize={"1.2rem"} mb={"1.2rem"}>Active Trader</Typography>
            <Grid container size={12} spacing={2}>
                {
                    statusOverviewData.map((item) => (
                        <Grid
                            variant={"section"}
                            key={item?.name}
                            size={{ xs: 12, sm: 6 }}
                            sx={{ height: "100px", borderRadius: "10px", bgcolor: selectedTheme !== "dark" && "#f5f5f5", p: "1rem", display: "flex", flexDirection: "column" }}
                        >
                            <Stack sx={{ flexDirection: "row", gap: "5px" }}>
                                <item.icon sx={{ color: item.iconColor }} />
                                {item.name}
                            </Stack>
                            <Stack sx={{ alignItems: "center" }}>
                                {item.isLoading ? <Skeleton width={"100%"} /> : <Typography color='green' fontSize={"1.5rem"}>{item.total}</Typography>}
                            </Stack>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default ActiveTradersAndIBs;