import { Stack, Typography } from '@mui/material'
import Grid from "@mui/material/Grid2"
import MenuComponent from '../../../components/MenuComponent';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useSelector } from 'react-redux';


function AccountDetailsCard({ accountDetailsData, accountTypeAndNumber, actionButtons, menuData }) {

    const { selectedTheme } = useSelector((state) => state.themeMode)

    return (
        <Grid container size={12}>
            <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                sx={{
                    border: "1px solid #afb5b9",
                    borderRadius: '.4rem',
                    mt: "2rem",
                    bgcolor: selectedTheme === "dark" && "#292929"
                }}
            >
                <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem", px: 2.5, py: 1.5, borderBottom: "1px solid #afb5b9" }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            borderRadius: ".2rem",
                            bgcolor: accountTypeAndNumber.type === "Real" ? "#fffceb" : "#e8f6ee",
                            px: ".5rem",
                            py: ".1rem",
                            color: accountTypeAndNumber.type === "Real" ? "black" : "#29834d"
                        }}>{accountTypeAndNumber.type}</Typography>
                    <Typography fontSize={"14px"} fontWeight={"700"}>{accountTypeAndNumber.number}</Typography>

                    <MenuComponent
                        btnContent={<MoreVertOutlinedIcon />}
                        menuData={menuData}
                        otherMenuData={actionButtons}
                        modalComponentData={{ login: accountTypeAndNumber.number }}
                        btnSx={{
                            bgcolor: "#f3f5f7",
                            color: "black",
                            boxShadow: "none !important",
                            minWidth: "2.5rem",
                            p: "6px"
                        }}
                    />
                </Stack>
                {
                    Object.entries(accountDetailsData).map(([keys, values], i) => (
                        <Stack key={i} sx={{ flexDirection: "row", px: 2.5, my: ".7rem", justifyContent: "space-between", color: selectedTheme === "dark" ? "white" : "#4b5256" }}>
                            <Typography sx={{ fontSize: ".9rem" }}>{keys}:</Typography>
                            <Typography sx={{ fontSize: ".9rem" }}>{values}</Typography>
                        </Stack>
                    ))
                }
            </Grid>
        </Grid>
    )

}

export default AccountDetailsCard