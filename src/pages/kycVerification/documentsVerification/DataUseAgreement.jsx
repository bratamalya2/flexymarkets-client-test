import { Stack, Typography, FormControlLabel, Checkbox, Button } from "@mui/material";
import { useState } from "react";
import { setKycStep } from "../../../globalState/kycState/kycStateSlice";
import { useDispatch } from "react-redux";

function DataUseAgreement() {

    const dispatch = useDispatch()

    const [checked, setChecked] = useState(false)

    return (
        <Stack>
            <Typography fontWeight={700} fontSize={"1.8rem"} my={".5rem"}>Data use agreement</Typography>
            <Typography>To continue, we need your consent to process your personal data, including biometrics.</Typography>
            <FormControlLabel
                sx={{
                    my: "2rem"
                }}
                control={<Checkbox
                    checked={checked}
                    onClick={(e) => setChecked(e.target.checked)} />}
                label={
                    "I confirm that I have read the Privacy Notice  and give my consent to the processing of my personal data, including biometrics, as described in this Notification to Processing of Personal Data"
                }
            />
            {checked && <Button
                variant='contained'
                onClick={() => dispatch(setKycStep("verifyIdentity"))}
                sx={{
                    textTransform: "none",
                    boxShadow: "none",
                    color: "white",
                    mt: '1.5rem',
                    alignSelf: "self-end",
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Submit documents</Button>}
        </Stack>
    )
}

export default DataUseAgreement;