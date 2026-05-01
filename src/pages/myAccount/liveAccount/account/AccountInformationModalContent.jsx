import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

function AccountInformationModalContent({ data }) {

    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const accountInfo = data?.accountInfo

    const accountDetails = {
        ...accountInfo?.accountDetailsData,
        ...accountInfo?.accountTypeDetails,
    }

    const customizeData = {
        "Type": accountDetails["type"],
        "Actual leverage": accountDetails["Actual leverage"],
        "Free margin": accountDetails["Free margin"],
        "Unrealized P&L": accountDetails["Unrealized P&L"],
        "Server": accountInfo?.accountDetailsID[0]?.id,
        "MT5 login": accountInfo?.accountDetailsID[1]?.id
    }

    return (
        <Stack spacing={2} sx={{ px: { xs: 1, sm: 2 } }}>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>Account information</Typography>
            {Object.entries(customizeData).map(([key, value], index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {key}
                    </Typography>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                        <Typography variant="body2" color="text.primary">
                            {value}
                        </Typography>
                        {(key == "Server" || key == "MT5 login") && <Tooltip title={copied ? "Copied!" : "Copy"}>
                            <IconButton sx={{ p: 0 }} onClick={() => handleCopy(value)}>
                                <ContentCopyIcon sx={{ width: "16px", cursor: "pointer" }} />
                            </IconButton>
                        </Tooltip>}
                    </Box>
                </Box>
            ))}
        </Stack>
    );
}

export default AccountInformationModalContent;