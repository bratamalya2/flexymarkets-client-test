import { Stack, Typography, Box, List, ListItem, Button } from "@mui/material";
import { Link } from "react-router-dom";

const demoBenefit = [
    "Virtual money",
    "Full access to the terminal",
    "No withdrawals"
]

const realBenefit = [
    "Full access to the terminal",
    "Instant, automated withdrawals"
]

function TerminalDepositModal() {
    return (
        <Stack>
            <Typography sx={{ fontSize: "1.5rem", pb: "1rem" }}>Make a deposit</Typography>
            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Box>
                    <Typography mb={"5px"}>Demo</Typography>
                    <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
                        {
                            demoBenefit.map((item, i) => (
                                <ListItem key={item} sx={{ display: "list-item", p: 0, color: i == 2 && "red" }}>
                                    <Typography
                                        sx={{ fontSize: "1rem", mt: "3px" }}
                                    >
                                        {item}
                                    </Typography>
                                </ListItem>
                            ))
                        }
                    </List>
                </Box>
                <Box>
                    <Typography mb={"5px"}>Real</Typography>
                    <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
                        {
                            realBenefit.map((item, i) => (
                                <ListItem key={item} sx={{ display: "list-item", p: 0, color: i == 1 && "green" }}>
                                    <Typography
                                        sx={{ fontSize: "1rem", mt: "3px" }}
                                    >
                                        {item}
                                    </Typography>
                                </ListItem>
                            ))
                        }
                    </List>
                </Box>
            </Stack>
            <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mt: "1rem", gap: "20px" }}>
                <Button
                    component={Link}
                    to={"/client/myAccount"}
                    target="_blank"
                    variant="contained"
                    fullWidth
                    sx={{
                        py: "12px",
                        fontSize: "1rem",
                        bgcolor: theme => theme.palette.custom.activeNavigation,
                        boxShadow: "none",
                        "&:hover": {
                            bgcolor: theme => theme.palette.custom.activeNavigation,
                            boxShadow: "none",
                        }
                    }}
                >Top up demo account</Button>
                <Button
                    component={Link}
                    to={"/client/transactions/deposit"}
                    target="_blank"
                    variant="contained"
                    fullWidth
                    sx={{
                        py: "12px",
                        fontSize: "1rem"
                    }}
                >Deposit on real account</Button>
            </Stack>
        </Stack>
    )
}

export default TerminalDepositModal;