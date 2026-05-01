import { Button, Stack, Typography, TextField, InputLabel, Container } from '@mui/material'
import Grid from "@mui/material/Grid2"
import FileUploadTextArea from '../../../components/FileUploadTextArea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addBankSchema } from './addBankSchema';
import { useDispatch } from 'react-redux';
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice"
import { useAddBankMutation } from '../../../globalState/complianceState/complianceStateApis';


function AddBank() {

    const dispatch = useDispatch();

    const defaultValues = {
        holderName: "",
        accountNo: "",
        ifscCode: "",
        ibanNo: "",
        bankName: "",
        bankAddress: "",
        country: "",
        image: null,
    };

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(addBankSchema),
        defaultValues,
    });

    const [addBank, { isLoading }] = useAddBankMutation();

    const onSubmit = async (data) => {
        try {
            const response = await addBank(data).unwrap();
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
        <Stack>
            <Container>
                <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Add Bank Details</Typography>
                <Stack
                    variant={"section"}
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        p: "2rem",
                        border: "1px solid #afb5b9",
                        borderRadius: '.8rem !important'
                    }}
                >
                    <Grid container size={12} spacing={3}>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
                            <TextField {...register("holderName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
                            {errors.holderName && <Typography color="error" fontSize={"14px"}>{errors.holderName.message}</Typography>}
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Account No. *</InputLabel>
                            <TextField {...register("accountNo")} size='small' fullWidth placeholder="Enter account No." variant="outlined" />
                            {errors.accountNo && <Typography color="error" fontSize={"14px"}>{errors.accountNo.message}</Typography>}
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>IFSC/Swift Code *</InputLabel>
                            <TextField {...register("ifscCode")} size='small' fullWidth placeholder="Enter IFSC/Swift Code" variant="outlined" />
                            {errors.ifscCode && <Typography color="error" fontSize={"14px"}>{errors.ifscCode.message}</Typography>}
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>IBAN No.</InputLabel>
                            <TextField {...register("ibanNo")} size='small' fullWidth placeholder="Enter IBAN No." variant="outlined" />
                            {errors.ibanNo && <Typography color="error" fontSize={"14px"}>{errors.ibanNo.message}</Typography>}
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Bank Name *</InputLabel>
                            <TextField {...register("bankName")} size='small' fullWidth placeholder="Enter bank name" variant="outlined" />
                            {errors.bankName && <Typography color="error" fontSize={"14px"}>{errors.bankName.message}</Typography>}
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Bank address *</InputLabel>
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
                        </Grid>
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
                </Stack>
            </Container>
        </Stack>
    );
}

export default AddBank;