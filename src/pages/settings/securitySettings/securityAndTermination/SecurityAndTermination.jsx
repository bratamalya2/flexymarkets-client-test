import { Stack, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import LogOutModalContent from "./SecurityAndTerminationModal.jsx/LogOutModalContent";
import TerminateModalContent from "./SecurityAndTerminationModal.jsx/TerminateModalContent";
import ModalComponent from "../../../../components/ModalComponent"
import { useSelector } from "react-redux";

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

const data = [
    {
        type: "Log out from all other devices except this one to secure your account.",
        icon: LogoutOutlinedIcon,
        button: true,
        btnName: "Log out from other devices",
        modal: LogOutModalContent
    },
    {
        type: "This action cannot be reversed.",
        icon: DeleteForeverOutlinedIcon,
        button: true,
        btnName: `Terminate ${SHORT_BRAND_NAME} Personal Area`,
        modal: TerminateModalContent
    }
]

function SecurityAndTermination() {

    const matches = useMediaQuery('(max-width:850px)');
    const { selectedTheme } = useSelector((state) => state.themeMode);

    return (
        <Stack>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "700", mb: ".5rem" }}>Account security and termination</Typography>
            <Stack
                variant={"section"}
                sx={{
                    border: "1px solid #e2e4e4",
                    mt: "2rem"
                }}
            >
                {
                    data.map((item, i) => (
                        <Grid
                            container
                            size={12}
                            spacing={2}
                            key={i}
                            sx={{ p: "32px 24px", border: "1px solid  #e2e4e4" }}
                        >
                            <Grid
                                size={matches ? 12 : 6}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Typography color="textSecondary" fontWeight={"500"}>{item.type}</Typography>
                            </Grid>
                            <Grid
                                size={matches ? 12 : 6}
                                sx={{ display: "flex", justifyContent: "flex-end" }}
                            >
                                <ModalComponent
                                    btnName={item.btnName}
                                    Content={item.modal}
                                    startIcon={<item.icon />}
                                    btnSx={{
                                        textTransform: "none",
                                        boxShadow: "none",
                                        fontWeight: "400",
                                        fontSize: "14px",
                                        px: "1rem",
                                        bgcolor: "#f8e1e0",
                                        color: "#c4453e",
                                        alignSelf: "self-end",
                                        "&:hover": { boxShadow: "none" }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    ))
                }
            </Stack>
        </Stack>
    )
}

export default SecurityAndTermination;