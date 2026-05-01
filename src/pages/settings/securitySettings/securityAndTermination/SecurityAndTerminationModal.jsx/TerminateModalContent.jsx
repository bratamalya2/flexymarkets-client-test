import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Stack, useMediaQuery } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

const data = [
    {
        key: "This email will be blocked (adi....ya@gmail.com)",
        value: "New accounts require a new email",
        icon: AccountCircleOutlinedIcon
    },
    {
        key: "All data will be deleted",
        value: "This cannot be reversed",
        icon: DescriptionOutlinedIcon
    },
    {
        key: "Programs will be canceled",
        value: "All benefits will be lost",
        icon: PeopleAltOutlinedIcon
    }
]


function TerminateModalContent() {

    const matches = useMediaQuery('(max-width:850px)');

    return (
        <Box sx={{ width: matches ? '100%' : 'auto' }}>
            <Typography
                id="modal-modal-title"
                sx={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    lineHeight: "2rem"
                }}>
                Terminate your {SHORT_BRAND_NAME} Personal Area?
            </Typography>
            <Typography
                id="modal-modal-description"
                sx={{
                    mt: 4,
                    bgcolor: "#e8f1f0cf",
                    border: ".1px solid #000000fc",
                    p: "20px",
                    borderRadius: "1rem",
                    fontSize: "14px"
                }}
            >
                This action cannot be undone. For full terms and conditions, click here.
            </Typography>
            <Box
                sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: "column",
                    gap: "1rem"
                }}
            >
                {
                    data.map((item, i) => (
                        <Box
                            key={i}
                            sx={{ display: 'flex', alignItems: "center", gap: '.5rem' }}
                        >
                            <item.icon sx={{ fontSize: '20px' }} />
                            <Box>
                                <Typography fontSize={"14px"}>{item.key}</Typography>
                                <Typography fontSize={"12px"} color="textSecondary">{item.value}</Typography>
                            </Box>
                        </Box>
                    ))
                }
            </Box>
            <Stack sx={{ flexDirection: "row", gap: "1rem", alignItems: 'center', justifyContent: "flex-end", mt: 4 }}>
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        bgcolor: "#f3f5f7",
                        color: "black",
                        "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        color: "white",
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >
                    Continue
                </Button>
            </Stack>
        </Box>
    );
}

export default TerminateModalContent;