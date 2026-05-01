import { Icon } from "@iconify/react";
import { Box, Typography } from "@mui/material";

function DocumentSubmitted() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                py:"5rem"
            }}
        >
            <Icon icon="ic:baseline-pending-actions" fontSize={"5rem"} color="#e3e33d" />
        </Box>
    )
}

export default DocumentSubmitted