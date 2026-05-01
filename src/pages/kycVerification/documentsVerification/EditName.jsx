import { Box, Stack, TextField, Typography, InputLabel, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EditName({ onClick }) {
    return (
        <Stack mt={"1rem"}>
            <Stack
                onClick={onClick}
                sx={{
                    flexDirection: "row",
                    gap: "5px",
                    alignItems: "center",
                    cursor: "pointer"
                }}
            >
                <ArrowBackIcon />
                <Typography fontWeight={500} fontSize={"1.2rem"}>Back</Typography>
            </Stack>
            <Stack
                sx={{
                    mt: "2rem",
                    gap: "2rem"
                }}
            >
                <Box>
                    <InputLabel sx={{ fontSize: "14px" }}>First name</InputLabel>
                    <TextField
                        sx={{
                            border: "none",
                            p: "0",
                            borderBottom: "1px solid black",
                            borderRadius: 0,
                            "& fieldset": { border: "none" },
                        }}
                        size='small'
                        placeholder={"Aditya Kumar"}
                        fullWidth
                    />
                </Box>
                <Box>
                    <InputLabel sx={{ fontSize: "14px" }}>Last name</InputLabel>
                    <TextField
                        sx={{
                            border: "none",
                            p: "0",
                            borderBottom: "1px solid black",
                            borderRadius: 0,
                            "& fieldset": { border: "none" },
                        }}
                        size='small'
                        placeholder={"Aditya Kumar"}
                        fullWidth
                    />
                </Box>
                <Button
                    variant='contained'
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        mt: '1.5rem',
                        alignSelf: "self-end",
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >Save</Button>
            </Stack>
        </Stack>
    )
}

export default EditName;