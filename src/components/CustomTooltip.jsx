import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material";

const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.mode === "dark" ? "#2E2E2E" : theme.palette.common.white,
        color: theme.palette.mode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.87)",
        boxShadow: theme.shadows[3],
        fontSize: 13,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.mode === "dark" ? "#2E2E2E" : theme.palette.common.white,
    },
}));

export default CustomTooltip;