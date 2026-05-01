import { Card, Stack, Typography } from "@mui/material"
import EastIcon from '@mui/icons-material/East'
import { useSelector } from "react-redux"

const data = {
    image: "/metatrader-5.png",
    heading: "MetaTrader 5",
    text: "Download and install the MT5 platform"
}

function MetaTrader5Card() {

    const { selectedTheme } = useSelector((state) => state.themeMode);

    const navigateToMT5Download = () => {
        window.open("https://www.metatrader5.com/en/download", "_blank");
    }

    return (
        <Card
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "10px",
                p: "20px",
                boxShadow: "none",
                bgcolor: selectedTheme !== "dark" && "#f3f5f7"
            }}
            onClick={navigateToMT5Download}
        >
            <Stack sx={{ flexDirection: "row", gap: "1.2rem" }}>
                <Stack sx={{ width: "48px", height: "48px", bgcolor: "#09332f", borderRadius: "10px" }}>
                    <img src={data.image} alt="error" style={{ width: "48px", height: "48px", borderRadius: "5px" }} />
                </Stack>
                <Stack>
                    <Typography fontWeight={"bold"} variant="body2">{data.heading}</Typography>
                    <Typography color="text.secondary">{data.text}</Typography>
                </Stack>
            </Stack>
            <EastIcon />
        </Card>
    )
}

export default MetaTrader5Card;