import { Skeleton, Stack, Typography } from "@mui/material";
import { Fragment } from "react";
import { useSelector } from "react-redux";

// const data = {
//     Equity: "600.60 USD",
//     "Free Margin": "600.60 USD",
//     Balance: "600.60 USD",
//     Margin: "0.00 USD",
//     "Margin level": "-"
// }

function TerminalFooter() {

    const { activeMT5AccountDetails } = useSelector(state => state.mt5)

    const data = {
        Equity: activeMT5AccountDetails?.Equity || "0 USD",
        "Free Margin": activeMT5AccountDetails?.MarginFree || "0 USD",
        Balance: activeMT5AccountDetails?.Balance || "0 USD",
        Margin: activeMT5AccountDetails?.Margin || "0 USD",
        "Margin level": activeMT5AccountDetails?.MarginLevel || "-"
    }

    return (
        <Stack
            sx={{
                px: "20px",
                height: "50px",
                flexDirection: "row",
                alignItems: "center",
                gap: "15px",
                borderTop: theme => `3px solid ${theme.palette.custom.brandLight}`
            }}
        >
            {
                Object.entries(data).map(([key, value]) => (
                    <Fragment key={key}>
                        <Typography fontSize="12px" color="gray">{key}:</Typography>
                        {
                            !activeMT5AccountDetails
                                ?
                                <Skeleton width={"25%"} />
                                :
                                <Typography fontSize="12px" >{value}</Typography>
                        }
                    </Fragment>
                ))
            }
        </Stack>
    )
}

export default TerminalFooter;