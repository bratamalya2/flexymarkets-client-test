import { Accordion, AccordionSummary, AccordionDetails, Typography, Divider, Stack, Box, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function MT5InstallDetailsAccordian() {
    return (
        <Accordion disableGutters sx={{ mt: ".8rem", boxShadow: "none", bgcolor: "transparent", borderRadius: "10px", "&:before": { display: "none" } }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ bgcolor: "transparent" }}
            >
                <Typography component="span">Other options</Typography>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    gap: "1.5rem",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                <Typography fontWeight={"700"} variant="body2">Get the {SHORT_BRAND_NAME} markets Trade app</Typography>
                <img src="/QRToInstallMT5.png" style={{ width: "90px", height: "90px" }} />

                <Stack direction="row" alignItems="center" justifyContent="center" width="100%">
                    <Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.2)", height: "1px", width: '20%' }} />
                    <Box px={1}>
                        <Typography variant="body1" color="text.secondary">Or trade on</Typography>
                    </Box>
                    <Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.2)", height: "1px", width: '20%' }} />
                </Stack>

                <Button
                    sx={{
                        bgcolor: "#f3f5f7",
                        width: "100%",
                        textTransform: "capitalize",
                        color: "black"
                    }}
                >MT5 Web Terminal</Button>
            </AccordionDetails>
        </Accordion>
    );
}

export default MT5InstallDetailsAccordian;