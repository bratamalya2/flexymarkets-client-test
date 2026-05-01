import Grid from '@mui/material/Grid2'
import { footerData, footerLinkData } from './footerData';
import { Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const FULL_BRAND_NAME = import.meta.env.VITE_FULL_BRAND_NAME;

function Footer() {

    return (
        <Stack mt={8}>
            <Container>
                <Grid container size={12} spacing={{ xs: 4, sm: 8 }} display="flex" flexWrap="wrap">
                    <Grid size={{ sm: 8 }}>
                        {
                            footerData.map((items, i) => (
                                <Typography key={i} fontSize={"12px"} color="textSecondary" mb={".4rem"}>{items}</Typography>
                            ))
                        }
                    </Grid>
                    <Grid size={{ sm: 4 }} sx={{ display: "flex", flexDirection: "column" }}>
                        {
                            footerLinkData.map((linkItems, i) => (
                                <Typography
                                    key={i}
                                    sx={{ textDecoration: "none" }}
                                    component={Link}
                                    to={linkItems.link}
                                    target='_blank'
                                    fontSize={"13px"}
                                    color={"primary.main"}
                                    mb={".3rem"}
                                >
                                    {linkItems.name}
                                </Typography>
                            ))
                        }
                    </Grid>
                </Grid>
                <Stack my={"2rem"} flexDirection={"row"} justifyContent={"center"}>
                    {/* <Typography fontSize={"13px"}>2.7.6-5-g10504d530</Typography> */}
                    <Typography fontSize={"13px"}>© {new Date().getFullYear()}. {FULL_BRAND_NAME}</Typography>
                </Stack>
            </Container>
        </Stack>
    )
}

export default Footer;