import { Stack, Button, Box, Typography, Tooltip, IconButton, Skeleton } from "@mui/material";
import { authenticationAppData } from "./authenticationAppData";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OTPInput from "../../../../../components/OTPInput"
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMfaSetUpMutation } from "../../../../../globalState/auth/authApis";
import { setNotification } from "../../../../../globalState/notificationState/notificationStateSlice";
import { setMFAData } from "../../../../../globalState/auth/authSlice";
import { useGetUserDataQuery } from "../../../../../globalState/userState/userStateApis";

function AuthenticationApp({ onClose }) {

    const dispatch = useDispatch()

    const { mfaData } = useSelector(state => state.auth)
    const { token } = useSelector((state) => state.auth);
    const { refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const hasSubmitted = useRef(false)

    const { handleSubmit, setValue, watch } = useForm({
        defaultValues: { otp: "" }
    });

    const [mfaSetUp] = useMfaSetUpMutation()

    const onSubmit = async (data) => {

        try {

            const response = await mfaSetUp(data).unwrap();

            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                dispatch(setMFAData(null))
                refetch()
                // onSetValue()
                onClose()
            }

        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        } finally {
            hasSubmitted.current = false;
        }

    };

    const handleClose = () => {
        dispatch(setMFAData(null))
        onClose()
    }

    return (
        <Stack width={"100%"}>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>Authentication app</Typography>
            {
                authenticationAppData.map((item, i) => (
                    <Box
                        key={i}
                        sx={{
                            mt: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem"
                        }}
                    >
                        <Typography fontWeight={500} fontSize={"16px"} alignSelf={"flex-start"}>{item.stepNo}</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem"
                            }}
                        >
                            {
                                (item.instruction).map(instruc => <Typography key={instruc} fontSize={"14px"} color="textSecondary">{instruc}</Typography>)
                            }
                        </Box>
                        {
                            mfaData?.qr
                                ?
                                <Stack alignItems={"center"}>
                                    <Box
                                        component={"img"}
                                        alt="error"
                                        src={mfaData?.qr}
                                        sx={{
                                            height: "150px",
                                            width: "150px"
                                        }}
                                    />
                                </Stack>
                                :
                                <Stack alignItems={"center"}>
                                    <Skeleton height={"150px"} width={"150px"} />
                                </Stack>
                        }
                        {
                            mfaData?.secret
                                ?
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: '1rem'
                                    }}
                                >
                                    <Stack
                                        sx={{
                                            flexDirection: "row",
                                            justifyContent: 'space-between',
                                            alignItems: "self-end"
                                        }}
                                    >
                                        <Box key={i}>
                                            <Typography fontWeight={500} sx={{ wordBreak: "break-all" }}>{mfaData?.secret}</Typography>
                                        </Box>
                                        <Tooltip title={copied ? "Copied!" : "Copy"}>
                                            <IconButton sx={{ p: 0 }} onClick={() => handleCopy(mfaData?.secret)}>
                                                <ContentCopyOutlinedIcon sx={{ fontSize: "20px", color: "primary.main" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                                :
                                <Skeleton />
                        }
                        {
                            item.content
                            &&
                            <Box
                                sx={{
                                    mt: 4,
                                    bgcolor: "#e8f1f0cf",
                                    border: ".1px solid #000000fc",
                                    p: "20px",
                                    borderRadius: "1rem",
                                    display: "flex",
                                    justifyContent: 'center',
                                    gap: '.5rem'
                                }}
                            >
                                <InfoOutlinedIcon />
                                <Typography fontSize={"14px"}>
                                    {item.content}
                                </Typography>
                            </Box>
                        }
                        {
                            item.OtpComponent &&
                            <OTPInput
                                value={watch("otp")}
                                onComplete={(value) => {
                                    setValue("otp", value);
                                    if (!hasSubmitted.current) {
                                        hasSubmitted.current = true;
                                        handleSubmit(onSubmit)();
                                    }
                                }}
                            />
                        }
                    </Box>
                ))
            }
            <Button
                variant="contained"
                sx={{
                    textTransform: "none",
                    boxShadow: "none",
                    bgcolor: "#f3f5f7",
                    mt: "3rem",
                    color: "black",
                    "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                }}
                onClick={handleClose}
            >
                Cancel
            </Button>
        </Stack>
    )
}

export default AuthenticationApp;