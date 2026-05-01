import { Box, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

function SelectedPlanTypeAndDetails() {


    const { state } = useLocation()

    const data = {
        heading: state?.title || "-----",
        "Spread from": +state?.features?.spread?.replace(/From\s*/i, "") ? state?.features?.spread?.replace(/From\s*/i, "") : "No spread" || "-----",
        commision: +state?.features?.commission ? state?.features?.commission : "No commission" || "-----"
    }

    return (
        <Stack>
            {
                Object.entries(data).map(([keys, values], i) => (
                    <Box key={i} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        {keys !== "heading" && <Typography>{keys}</Typography>}
                        <Typography>{values}</Typography>
                    </Box>
                ))
            }
        </Stack>
    )
}

export default SelectedPlanTypeAndDetails;