import { Button, Card, Divider, Stack, Typography, TextField, InputLabel } from '@mui/material'
import Grid from "@mui/material/Grid2"
import FileUploadTextArea from '../../../components/FileUploadTextArea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from './updateProfileSchema';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice"
import { useAddBankMutation } from '../../../globalState/complianceState/complianceStateApis';
import { useEffect } from 'react';
import { useUpdateProfileMutation } from '../../../globalState/userState/userStateApis';


function UpdateProfile() {

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.auth)

    const defaultValues = {
        fullName: "",
        email: "",
        mobile: "",
        country: ""
    };

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(updateProfileSchema),
        defaultValues,
    });

    useEffect(() => {
        reset({
            fullName: userData?.name || "",
            email: userData?.email || "",
            mobile: userData?.mobile || "",
            country: userData?.country || ""
        })
    }, [userData, reset])

    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const onSubmit = async (data) => {
        try {
            const response = await updateProfile(data).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues);
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    };

    return (
        <Stack mt={"2rem"}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: "700", mb: "1.5rem" }}>Update profile</Typography>
            <Card
                sx={{
                    boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
                    borderRadius: "1.2rem",
                    padding: { xs: "1rem", md: "2rem" },
                }}
                component={"form"}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Typography mx={{ xs: "1rem", md: "0" }}>Fill Details</Typography>
                <Divider sx={{ my: "1.2rem" }} />
                <Grid container size={12} spacing={2}>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Name *</InputLabel>
                        <TextField {...register("fullName")} size='small' fullWidth placeholder="Enter your name" variant="outlined" />
                        {errors.fullName && <Typography color="error" fontSize={"14px"}>{errors.fullName.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Email *</InputLabel>
                        <TextField {...register("email")} size='small' fullWidth placeholder="Enter your email" variant="outlined" />
                        {errors.email && <Typography color="error" fontSize={"14px"}>{errors.email.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Mobile *</InputLabel>
                        <TextField {...register("mobile")} size='small' fullWidth placeholder="Enter your mobile no." variant="outlined" />
                        {errors.mobile && <Typography color="error" fontSize={"14px"}>{errors.mobile.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Country *</InputLabel>
                        <TextField {...register("country")} size='small' fullWidth placeholder="Enter your country name" variant="outlined" />
                        {errors.country && <Typography color="error" fontSize={"14px"}>{errors.country.message}</Typography>}
                    </Grid>
                    {/* <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Bank Name *</InputLabel>
                        <TextField {...register("bankName")} size='small' fullWidth placeholder="Enter bank name" variant="outlined" />
                        {errors.bankName && <Typography color="error" fontSize={"14px"}>{errors.bankName.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Bank address</InputLabel>
                        <TextField {...register("bankAddress")} size='small' fullWidth placeholder="Enter bank address" variant="outlined" />
                        {errors.bankAddress && <Typography color="error" fontSize={"14px"}>{errors.bankAddress.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Country *</InputLabel>
                        <TextField {...register("country")} size='small' fullWidth placeholder="Enter your country name" variant="outlined" />
                        {errors.country && <Typography color="error" fontSize={"14px"}>{errors.country.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Book Bank *</InputLabel>
                        <FileUploadTextArea
                            onChange={(fileData) => setValue("image", fileData, { shouldValidate: true })}
                            extentionType={['image/jpeg', 'image/png']}
                            acceptType={"image/jpeg,image/png,application/pdf"}
                        />
                        {errors.image && <Typography color="error" fontSize={"14px"}>{errors.image.message}</Typography>}
                    </Grid> */}
                </Grid>
                <Button
                    type='submit'
                    variant='contained'
                    disabled={isLoading}
                    sx={{
                        textTransform: "capitalize",
                        boxShadow: "none",
                        color: "white",
                        mt: '1.5rem',
                        alignSelf: "self-start",
                        "&:hover": {
                            boxShadow: "none",
                        },
                    }}
                >
                    Submit
                </Button>
            </Card>
        </Stack>
    );
}

export default UpdateProfile;