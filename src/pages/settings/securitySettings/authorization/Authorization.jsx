import { Button, Stack, Typography, useMediaQuery } from "@mui/material"
import Grid from "@mui/material/Grid2"
import ChangePassword from "./ChangePassword";
import { useState } from "react";
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis";
import { useSelector } from "react-redux";

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function Authorization() {

    const [change, setChange] = useState(false)
    const { selectedTheme } = useSelector((state) => state.themeMode);

    const matches = useMediaQuery('(max-width:850px)');

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userEmail = !isLoading && userData?.data?.userData?.email

    const data = [
        {
            type: "Login",
            value: userEmail || null,
            button: false
        },
        {
            type: "Password",
            value: "........",
            button: true
        }
    ]

    return (
        <Stack>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "700", mb: ".5rem" }}>Authorization</Typography>
            <Typography color="textSecondary">Information for logging in to {SHORT_BRAND_NAME}.</Typography>
            <Typography color="textSecondary">Change your password whenever you think it might have been compromised.</Typography>
            <Stack variant={"section"} sx={{ border: "1px solid #e2e4e4", mt: "2rem" }}>
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
                                size={matches ? 12 : 4}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Typography color="textSecondary" fontWeight={"500"}>{item.type}</Typography>
                            </Grid>
                            <Grid
                                size={change === true ? (matches ? 12 : 6) : 4}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                {
                                    (change === true && item.button === true)
                                        ?
                                        <ChangePassword onClickCancelBtn={() => setChange()} />
                                        :
                                        <Typography fontWeight={"500"}>{item.value}</Typography>
                                }
                            </Grid>
                            {
                                change === true
                                    ?
                                    null
                                    :
                                    <Grid
                                        size={matches ? 12 : 4}
                                        sx={{ display: "flex", justifyContent: "flex-end" }}
                                    >
                                        {item.button && <Button
                                            onClick={() => setChange(true)}
                                            variant="contained"
                                            fullWidth={matches}
                                            sx={{
                                                textTransform: "none",
                                                boxShadow: "none",
                                                fontWeight: "400",
                                                fontSize: "16px",
                                                px: "2rem",
                                                bgcolor: "#f3f5f7",
                                                color: "black",
                                                alignSelf: "self-end",
                                                "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                                            }}
                                        >
                                            Change
                                        </Button>}
                                    </Grid>
                            }
                        </Grid>
                    ))
                }
            </Stack>
        </Stack>
    )
}

export default Authorization;