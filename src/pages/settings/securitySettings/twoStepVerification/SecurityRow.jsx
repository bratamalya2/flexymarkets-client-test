import { Typography, Button } from '@mui/material';
import { Suspense, lazy } from 'react';
import Grid from '@mui/material/Grid2';


const ChangeTwoStepVerification = lazy(() => import("./ChangeTwoStepVerification"));

function SecurityRow({ item, index, change, handleToggleChange, matches }) {

    return (
        <Grid
            container
            spacing={2}
            size={12}
            sx={{ p: "32px 24px", border: "1px solid  #e2e4e4" }}
        >
            <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", alignItems: "center" }}>
                <Typography color="textSecondary" fontWeight={"500"}>{item.type}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", alignItems: "center" }}>
                {change ? (
                    <Suspense fallback={<Typography>Loading...</Typography>}>
                        <ChangeTwoStepVerification onClickCancelBtn={() => handleToggleChange(index)} />
                    </Suspense>
                ) : (
                    <Typography fontWeight={"500"}>{item.value}</Typography>
                )}
            </Grid>
            {!change && (
                <Grid
                    size={{ xs: 12, md: 4 }}
                    sx={{ display: "flex", flexDirection: matches ? "column" : "row", gap: "1rem", alignItems: matches ? "flex-start" : "center", justifyContent: "flex-end" }}
                >
                    {item.securityVolume && (
                        <Typography sx={{ fontSize: "14px", color: "#c4453e", p: "4px 10px", borderRadius: "5rem", bgcolor: "#f8e1e0" }}>
                            {item.securityVolume}
                        </Typography>
                    )}
                    {item.button && (
                        <Button
                            onClick={() => handleToggleChange(index)}
                            variant="contained"
                            fullWidth={matches}
                            sx={{ textTransform: "none", boxShadow: "none", fontWeight: "400", fontSize: "16px", px: "2rem", bgcolor: "#f3f5f7", color: "black", "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" } }}
                        >
                            Change
                        </Button>
                    )}
                </Grid>
            )}
        </Grid>
    );
}

export default SecurityRow;