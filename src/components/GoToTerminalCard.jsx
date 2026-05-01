import { Card, Stack, Typography } from "@mui/material"
import EastIcon from '@mui/icons-material/East'
import { useSelector } from "react-redux"

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

const data = {
    image: "/logoForTerminal.jpg",
    heading: `${SHORT_BRAND_NAME} Markets terminal`,
    text: "Trade directly from your browser"
}

function GoToTerminalCard() {

    const { selectedTheme } = useSelector((state) => state.themeMode);

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
        >
            <Stack sx={{ flexDirection: "row", gap: "1.2rem" }}>
                <img src={data.image} alt="error" style={{ width: "48px", height: "48px", borderRadius: "5px" }} />
                <Stack>
                    <Typography fontWeight={"bold"} variant="body2">{data.heading}</Typography>
                    <Typography color="text.secondary">{data.text}</Typography>
                </Stack>
            </Stack>
            <EastIcon />
        </Card>
    )
}

export default GoToTerminalCard