import { Box, Stack, OutlinedInput, InputAdornment, Typography, Button, Skeleton } from "@mui/material";
import DocumentVerificationSvg from "./DocumentVerificationSvg";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { setKycStep } from "../../../globalState/kycState/kycStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis"

function UploadDocument({ onClick }) {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userName = data?.data?.userData?.name
    const userCountry = data?.data?.userData?.country

    const dispatch = useDispatch()

    return (
        <Stack>
            <DocumentVerificationSvg />
            <Typography
                sx={{
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    my: "1rem"
                }}
            >Document verification</Typography>
            <Typography>On the next screen we will ask you to upload one or two documents that can prove your name and country / region of residence. Your current place of residence is</Typography>
            <Typography my={".5rem"}>{isLoading ? <Skeleton width={"250px"} /> : userCountry}</Typography>
            <Box>
                <Typography sx={{ fontWeight: "500", fontSize: "1rem", mb: ".5rem" }}>Check your name:</Typography>
                <OutlinedInput
                    sx={{
                        border: "none",
                        p: "0",
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        "& fieldset": { border: "none" },
                    }}
                    size='small'
                    placeholder={isLoading ? "" : userName}
                    fullWidth
                    endAdornment={
                        <InputAdornment position="end">
                            {/* <Button
                                onClick={onClick}
                                size='small'
                                variant="outlined"
                                startIcon={<EditOutlinedIcon />}
                                edge="end"
                                sx={{
                                    height: "100%",
                                    boxShadow: "none",
                                    border: "none",
                                    color: "black",
                                    textTransform: "capitalize",
                                    "&:hover": { boxShadow: "none" }
                                }}
                            >
                                Edit
                            </Button> */}
                        </InputAdornment>
                    }
                />
            </Box>
            <Button
                variant='contained'
                onClick={() => dispatch(setKycStep("dataUseAgreement"))}
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
            >Upload documents</Button>
        </Stack>
    )

}

export default UploadDocument;