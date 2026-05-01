import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Divider, Stack } from '@mui/material';
import { marketNewsListData } from './marketNewsListData';

function MarketNewsList() {
    return (
        <Stack>
            {marketNewsListData.map((data, i) => (
                <Box key={i}>
                    <Accordion sx={{ boxShadow: "none" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={{ p: 0 }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "row", gap: "1.2rem" }}>
                                <Box sx={{ minWidth: "70px", height: "70px", overflow: "hidden" }}>
                                    <img
                                        src={data.image}
                                        alt="error"
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                </Box>
                                <Stack sx={{ gap: '.5rem' }}>
                                    <Typography component="span" sx={{ fontSize: '18px', fontWeight: "bold" }}>
                                        {data.title}
                                    </Typography>
                                    <Box>
                                        <Typography sx={{ fontSize: '14px', fontWeight: "bold" }} component={"span"}>{data.source}</Typography>
                                        <Typography component={"span"} mx={".5rem"}>|</Typography>
                                        <Typography fontSize={"14px"} color="textSecondary" component={"span"}>{data.date}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: ".8rem", mt: "2rem" }}>
                                        {
                                            data.tags.map((tag, i) => (
                                                <Typography key={i} p={".2rem"} fontSize={"10px"} bgcolor={"#f3f5f7"}>{tag}</Typography>
                                            ))
                                        }
                                    </Box>
                                </Stack>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <Box>
                                <Typography fontSize={"14px"} color="textSecondary">{data.content}</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Divider sx={{ my: '1rem' }} />
                </Box>
            ))}
        </Stack>
    );
}

export default MarketNewsList;