import { Stack, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Box, Button } from "@mui/material";

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

const data = [`${SHORT_BRAND_NAME} Terminal`, "MetaTrader 5", "MT5 WebTerminal"]

function SetTradingTerminal({ onClickCancelBtn }) {

    return (
        <Stack width={"100%"}>
            <Typography fontWeight={500} fontSize="1rem">Set trading terminal</Typography>
            <FormControl sx={{ mt: '1.5rem' }}>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={(e) => setValue(e.target.value)}
                >
                    {data.map((item, i) => (
                        <FormControlLabel
                            key={i}
                            value={item}
                            control={
                                <Radio
                                    sx={{
                                        color: "primary.main",
                                        '&.Mui-checked': {
                                            color: "primary.main"
                                        },
                                        transform: "scale(.9)"
                                    }}
                                />
                            }
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography fontSize={"14px"}>{item}</Typography>
                                </Box>
                            }
                        />
                    ))}
                </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", mt: "2rem" }}>
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        fontSize: "16px",
                        px: "2rem",
                        color: "white",
                        "&:hover": { boxShadow: "none" }
                    }}
                    onClick={() => setShowComponent(true)}
                >
                    Set terminal
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        fontSize: "16px",
                        px: "2rem",
                        bgcolor: "#f3f5f7",
                        color: "black",
                        "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                    }}
                    onClick={() => onClickCancelBtn(false)}
                >
                    Cancel
                </Button>
            </Box>
        </Stack>
    );
}

export default SetTradingTerminal;