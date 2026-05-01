import { Card, CardContent, Container, Stack, Typography } from "@mui/material"
import { clientsAccountSummaryCardData } from "./clientsAccountSummaryCardData";
import Grid from "@mui/material/Grid2"
import { useSelector } from "react-redux";


function ClientsAccountSummaryCard() {

    const { selectedTheme } = useSelector((state) => state.themeMode)

    return (
        <Container sx={{ mt: "1rem" }}>
            <Grid container size={12} spacing={2}>
                {
                    clientsAccountSummaryCardData.map((data, i) => (
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card sx={{ boxShadow: "none", borderRadius: "1.2rem", bgcolor: selectedTheme !== "dark" && "#f5f5f5" }} key={i}>
                                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Typography fontSize={"1.5rem"}>{data.type && "$"}{data.total}</Typography>
                                    <Typography fontSize={".8rem"} fontWeight={"bold"} color="#999999" textAlign={"center"}>{data.cardName}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )
}

export default ClientsAccountSummaryCard;