import { Button, Stack, Typography, TextField, InputLabel, Container, Box } from '@mui/material'
import FileUploadTextArea from "../../../../components/FileUploadTextArea"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useBankDepositMutation } from '../../../../globalState/userState/userStateApis';
import { bankDepositFormschema } from './bankDepositFormschema';


function BankDepositForm() {

    const dispatch = useDispatch();

    const defaultValues = {
        transactionReference: "",
        amount: "",
        remark: "",
        image: null,
    };

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(bankDepositFormschema),
        defaultValues,
    });

    const [bankDeposit, { isLoading }] = useBankDepositMutation();

    const onSubmit = async (data) => {
        try {
            const response = await bankDeposit(data).unwrap();
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
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            spacing={2}
        >
            <Box>
                <InputLabel sx={{ mb: ".5rem" }}>Amount *</InputLabel>
                <TextField {...register("amount")}
                    size='small' fullWidth placeholder="Enter Amount" variant="outlined" />
                {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
            </Box>
            <Box>
                <InputLabel sx={{ mb: ".5rem" }}>Upload Deposit Proof *</InputLabel>
                <FileUploadTextArea
                    onChange={(fileData) => setValue("image", fileData, { shouldValidate: true })}
                    extentionType={['image/jpeg', 'image/png']}
                    acceptType={"image/jpeg,image/png,application/pdf"}
                />
                {errors.image && <Typography color="error" fontSize={"14px"}>{errors.image.message}</Typography>}
            </Box>
            <Box>
                <InputLabel sx={{ mb: ".5rem" }}>Transaction Reference *</InputLabel>
                <TextField {...register("transactionReference")} size='small' fullWidth placeholder="Enter Transaction Reference" variant="outlined" />
                {errors.transactionReference && <Typography color="error" fontSize={"14px"}>{errors.transactionReference.message}</Typography>}
            </Box>
            <Box>
                <InputLabel sx={{ mb: ".5rem" }}>Remark *</InputLabel>
                <TextField
                    {...register("remark")}
                    size='small' multiline fullWidth placeholder="Enter remark" variant="outlined" />
                {errors.remark && <Typography color="error" fontSize={"14px"}>{errors.remark.message}</Typography>}
            </Box>
            <Stack sx={{ p: "1rem", my: "2rem", bgcolor: "#f8f9f9", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Typography color='black'>To be deposited</Typography>
                <Typography fontWeight={"bold"} fontSize={"2rem"} color='black'>{watch("amount") || "0"}<Typography fontWeight={"bold"} component={"span"} fontSize={"1.2rem"}>.00 USD</Typography></Typography>
            </Stack>
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
    );
}

export default BankDepositForm;