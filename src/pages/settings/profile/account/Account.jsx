import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { Box, Stack, Typography, Fade } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CustomTooltip from '../../../../components/CustomTooltip';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import StepCircle from '../../../../components/StepCircle';


function Account() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified

    const isEmailVerified = !isLoading && data?.data?.userData?.isEmailVerified
    const userName = !isLoading && data?.data?.userData?.name

    const stepsCompleted = [isEmailVerified, userName, isKycVerified].filter(Boolean)

    const accountData = [
        {
            icon: AccountCircleOutlinedIcon,
            title: "Status",
            result: isKycVerified ? "Verified" : "Not verified",
            content: `${stepsCompleted.length || 0}/3 steps complete`,
        },
        {
            icon: AttachMoneyOutlinedIcon,
            title: "Deposit limit",
            amount: isKycVerified ? "50,000" : "0",
            content: isKycVerified ? "Verified" : "Verify your account to unlock limits",
            tooltipIcon: InfoOutlinedIcon,
            tooltip: "This is the maximum amount you can currently deposit. Once you reach the limit, you will not be able to deposit or receive internal transfers. Withdrawals will remain available",
            // amount: true
        }
    ]

    return (
        <Stack>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "700", mb: "1rem" }}>Accounts</Typography>
            <Grid container size={12} spacing={4}>
                {
                    accountData.map((data, i) => (
                        <Grid
                            variant={"section"}
                            key={i}
                            size={{ xs: 12, sm: 6 }}
                            sx={{
                                p: "1.5rem",
                                border: theme => `1px solid ${theme.palette.primary.main}`,
                                borderLeft: theme => `5px solid ${theme.palette.primary.main}`,
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem"
                            }}
                        >
                            <StepCircle IconComponent={data.icon} />
                            <Stack>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: 'center',
                                        gap: "5px"
                                    }}
                                >
                                    <Typography fontSize={"12px"}>{data.title}</Typography>
                                    {data.tooltipIcon &&
                                        <CustomTooltip
                                            title={<Typography fontSize={"13px"}>{data.tooltip}</Typography>}
                                            arrow
                                            placement='top'
                                            slots={{
                                                transition: Fade,
                                            }}
                                        >
                                            <InfoOutlinedIcon fontSize='20px' />
                                        </CustomTooltip>
                                    }
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: 'center',
                                        gap: "5px"
                                    }}
                                >
                                    <Typography fontWeight={"bold"} fontSize={"1.5rem"} color={isKycVerified ? "success" : "error"}>{data.result}</Typography>
                                    {data.amount && <Typography fontWeight={"bold"} fontSize={"1.5rem"}>{data?.amount} USD</Typography>}
                                </Box>
                                <Typography fontSize={"12px"} color="textSecondary">{data.content}</Typography>
                            </Stack>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default Account;