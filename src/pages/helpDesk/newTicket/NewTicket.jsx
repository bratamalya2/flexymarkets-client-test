import { Button, Stack, Typography, TextField, InputLabel, Container, Box } from '@mui/material'
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useCreateSupportTicketMutation } from '../../../globalState/supportState/supportStateApis';
import { newTicketSchema } from './newTicketSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Selector from "../../../components/Selector"
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice"


function NewTicket() {

    const dispatch = useDispatch();

    const defaultValues = {
        subject: "",
        priority: "",
        message: ""
    };

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(newTicketSchema),
        defaultValues,
    });

    const [createSupportTicket, { isLoading }] = useCreateSupportTicketMutation();

    const onSubmit = async (data) => {
        try {
            const response = await createSupportTicket(data).unwrap();
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
                <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>Create New Ticket</Typography>
                <Stack
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2}
                >
                    <Box>
                        <InputLabel sx={{ mb: ".5rem" }}>Title *</InputLabel>
                        <TextField {...register("subject", { required: true })} size='small' fullWidth placeholder="Enter Title" variant="outlined" />
                        {errors.subject && <Typography color="error" fontSize={"14px"}>{errors.subject.message}</Typography>}
                    </Box>
                    <Box>
                        <InputLabel sx={{ mb: ".5rem" }}>Priority *</InputLabel>
                        <Selector
                            items={["LOW", "MEDIUM", "HIGH"]}
                            value={watch("priority")}
                            onChange={(e) => setValue("priority", e.target.value, { shouldValidate: true })}
                            shouldBeFullWidth={true}
                        />
                        {errors.priority && <Typography color="error" fontSize={"14px"}>{errors.priority.message}</Typography>}
                    </Box>
                    <Box>
                        <InputLabel sx={{ mb: ".5rem" }}>Describe your problem *</InputLabel>
                        <TextField {...register("message", { required: true })} size='small' multiline fullWidth placeholder="Describe your problem" variant="outlined" />
                        {errors.message && <Typography color="error" fontSize={"14px"}>{errors.message.message}</Typography>}
                    </Box>
                    <Button
                        variant='contained'
                        type='submit'
                        disabled={isLoading}
                        sx={{
                            textTransform: "capitalize",
                            width: "5rem",
                            boxShadow: "none",
                            color: "white",
                            "&:hover": {
                                boxShadow: "none"
                            }
                        }}
                    >Submit</Button>
                </Stack>
            </Container>
        </Stack >
    )
}

export default NewTicket;