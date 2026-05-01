import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2"
import { data } from "./news"
import NewsModalBox from "../../components/NewsModalBox";


function News() {

    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>News</Typography>
            <Grid container size={12} spacing={2}>
                {
                    data.map((items) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ borderRadius: "1.2rem" }}>
                            <Card key={items.id} sx={{ boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)", borderRadius: "1.2rem" }}>
                                <CardContent>
                                    <Box>
                                        <img src={items.image} alt="error" width={"100%"} height={"190px"} />
                                    </Box>
                                    <Typography fontSize={".9rem"} fontWeight={"bold"} color={"primary.main"}>{items.heading}</Typography>
                                    <Typography>{items.date}</Typography>
                                    <Typography
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block",
                                            fontSize: ".9rem",
                                            mt: ".7rem"
                                        }}
                                    >
                                        {items.note}
                                    </Typography>
                                    <NewsModalBox buttonName={"view more"} data={items} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )
}

export default News;