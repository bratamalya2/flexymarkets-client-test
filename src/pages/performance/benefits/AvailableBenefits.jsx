import { Box, Stack, Typography, Fade } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CustomTooltip from "../../../components/CustomTooltip";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";


const data = [
    {
        title: "Negative Balance Protection",
        content: "You can never lose more money than you put in your account. If your balance goes into the negative, we'll restore it back to 0.",
        icon: InfoOutlinedIcon,
        info: {
            title: "Negative Balance Protection",
            content: "This feature ensures you never lose more money than you put into your account. If a stop out closes all your positions in a negative balance, we will restore it to 0. This screen shows how many times your balance was restored to 0, and the total amount of dollars credited to your account to do so."
        }
    },
    {
        title: "Swap-Free",
        content: "No more overnight charges. Trade popular instruments without paying swaps.",
        icon: InfoOutlinedIcon,
        info: {
            title: "Swap-Free",
            content: "We've removed overnight charges, known as swaps, on our most popular instruments. This screen shows how much our swap-free feature has saved you on your trading costs."
        }
    }
]


function AvailableBenefits() {

    const { selectedTheme } = useSelector((state) => state.themeMode);

    return (
        <Stack>
            <Typography
                variant='h6'
                fontWeight={"700"}
                fontSize={"1.2rem"}
                my="1rem"
            >Available benefits</Typography>
            <Grid container size={12} spacing={4}>
                {
                    data.map((item, i) => (
                        <Grid
                            variant={"section"}
                            key={i}
                            size={{ xs: 12, sm: 6 }}
                            sx={{
                                p: ".5rem",
                                border: theme => `1px solid ${theme.palette.primary.main}`,
                                borderLeft: theme => `5px solid ${theme.palette.primary.main}`,
                                display: "flex",
                                gap: "50px",
                                flexDirection: "column",
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: ".2rem" }}>
                                <Typography fontWeight={"bold"} fontSize={"14px"}>{item.title}</Typography>
                                <CustomTooltip
                                    title={
                                        <Box>
                                            <Typography fontWeight={"bold"} fontSize={"13px"}>{item.info.title}</Typography>
                                            <Typography fontSize={"12px"}>{item.info.content}</Typography>
                                        </Box>
                                    }
                                    arrow
                                    placement='top'
                                    slots={{
                                        transition: Fade,
                                    }}
                                >
                                    <item.icon sx={{ fontSize: "20px" }} />
                                </CustomTooltip>
                            </Box>
                            <Typography fontSize={"12px"}>{item.content}</Typography>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default AvailableBenefits;