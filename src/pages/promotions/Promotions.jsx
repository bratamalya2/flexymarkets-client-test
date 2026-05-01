import { Container, Stack, Typography, Box } from "@mui/material";
import { promotionsCard } from "./promotionsCard";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";


function Promotions() {
    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>
                Promotions
            </Typography>
            <Grid container size={12} spacing={4} sx={{ mt: "20px" }}>
                {
                    promotionsCard.map((item) => (
                        <Grid
                            variant={"section"}
                            component={Link}
                            to={item?.segment}
                            key={item?.heading}
                            size={6}
                            sx={{ p: "15px", borderRadius: ".7rem", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
                        >
                            <Box
                                component={"img"}
                                src={item?.image}
                                height={"120px"}
                                borderRadius={".7rem"}
                            />
                            <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>{item?.heading}</Typography>
                            <Typography sx={{ fontSize: "15px" }}>{item?.time}</Typography>
                            <Stack sx={{ flexDirection: "row", gap: "5px" }}>
                                {
                                    item?.label?.map(label => <Typography sx={{ fontSize: "12px", color: label?.color, bgcolor: label?.bgColor, px: "5px", py: "1.2px", borderRadius: "5rem" }}>{label?.name}</Typography>)
                                }
                            </Stack>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )
}

export default Promotions;