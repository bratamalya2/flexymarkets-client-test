import { Box, Card, Typography, Tooltip, IconButton, useMediaQuery, Stack } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const IB_REFERAAL_LINK = import.meta.env.VITE_IB_REFERAAL_LINK;

function ReferralLinkCard() {

    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const { selectedTheme } = useSelector((state) => state.themeMode);

    const matches = useMediaQuery('(min-width:400px)');

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userName = data?.data?.userData?.userName

    return (
        <Card
            sx={{
                width: matches ? "350px" : "100%",
                borderRadius: "10px",
                bgcolor: selectedTheme !== "dark" && "#f5f5f5",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                py: ".5rem",
                px: "1rem"
            }}
        >
            <Stack sx={{ bgcolor: "primary.main", borderRadius: "50%", p: ".3rem" }}><LinkOutlinedIcon sx={{ lineHeight: "0", color: "white" }} /></Stack>
            <Typography fontWeight={"bold"} color={"primary.main"}>Copy your Referral Link!</Typography>
            {/* <Tooltip sx={{ border: theme => `1px solid ${theme.palette.primary.main}`, borderRadius: "10px", my: "0" }}> */}
            {/* <IconButton>
                    <ContentCopyIcon />
                </IconButton> */}
            <Tooltip title={copied ? "Copied!" : "Copy"}>
                <IconButton sx={{ p: 0 }} onClick={() => handleCopy(`${IB_REFERAAL_LINK}?referralCode=${userName}`)}>
                    <ContentCopyIcon />
                </IconButton>
            </Tooltip>
            {/* </Tooltip> */}
        </Card>
    )
}

export default ReferralLinkCard