import { Button, Stack, Typography, TextField, InputLabel } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setNotification } from '../../../../../globalState/notificationState/notificationStateSlice';
import { setIBCommissionSchema } from './setIBCommissionSchema';
import { useSetIBCommissionMutation } from '../../../../../globalState/ibState/ibStateApis';

function SetIBCommission({ data, loading, setDataToEdit }) {

    const dispatch = useDispatch()

    const { selectedTheme } = useSelector((state) => state.themeMode);

    const defaultValues = {
        planId: null,
        level1Commission: "",
        level2Commission: "",
        level3Commission: "",
        level4Commission: "",
        level5Commission: "",
        level6Commission: "",
        level7Commission: "",
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(setIBCommissionSchema),
        defaultValues
    });

    useEffect(() => {
        if (data) {
            reset({
                planId: Number(data?.id) || null,
                level1Commission: String(data.level1Commission) || "",
                level2Commission: String(data.level2Commission) || "",
                level3Commission: String(data.level3Commission) || "",
                level4Commission: String(data.level4Commission) || "",
                level5Commission: String(data.level5Commission) || "",
                level6Commission: String(data.level6Commission) || "",
                level7Commission: String(data.level7Commission) || "",
            });
        }
    }, [data, reset]);

    const [setIBCommission, { isLoading }] = useSetIBCommissionMutation()

    const onSubmit = async (data) => {

        try {
            const response = await setIBCommission(data).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                setDataToEdit(null)
            }

        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }

    };

    return (
        <>
            <Typography sx={{ my: "1.2rem" }}>Total Granted Commission -: {loading ? "-----" : data?.ibComission}</Typography>
            <Stack
                variant="section"
                sx={{
                    border: `1px solid ${selectedTheme == "dark" ? "white" : "black"}`,
                    borderRadius: "1.2rem",
                    padding: { xs: "1rem", md: "2rem" }
                }}
                component={"form"}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Grid container size={12} spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Level1 Commission</InputLabel>
                        <TextField {...register("level1Commission", { required: true })} size='small' fullWidth variant="outlined" placeholder="Enter Level1 commission" />
                        {errors.level1Commission && <Typography color="error" fontSize={"14px"}>{errors.level1Commission.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Level2 Commission</InputLabel>
                        <TextField {...register("level2Commission", { required: true })} size='small' fullWidth variant="outlined" placeholder="Enter Level2 commission" />
                        {errors.level2Commission && <Typography color="error" fontSize={"14px"}>{errors.level2Commission.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Level3 Commission</InputLabel>
                        <TextField  {...register("level3Commission", { required: true })} size='small' fullWidth variant="outlined" placeholder="Enter Level3 commission" />
                        {errors.level3Commission && <Typography color="error" fontSize={"14px"}>{errors.level3Commission.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Level4 Commission</InputLabel>
                        <TextField  {...register("level4Commission", { required: true })} size='small' fullWidth variant="outlined" placeholder="Enter Level4 commission" />
                        {errors.level4Commission && <Typography color="error" fontSize={"14px"}>{errors.level4Commission.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Level5 Commission</InputLabel>
                        <TextField  {...register("level5Commission", { required: true })} size='small' fullWidth variant="outlined" placeholder="Enter Level5 commission" />
                        {errors.level5Commission && <Typography color="error" fontSize={"14px"}>{errors.level5Commission.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Level6 Commission</InputLabel>
                        <TextField  {...register("level6Commission", { required: true })} size='small' fullWidth variant="outlined" placeholder="Enter Level6 commission" />
                        {errors.level6Commission && <Typography color="error" fontSize={"14px"}>{errors.level6Commission.message}</Typography>}
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <InputLabel sx={{ mb: ".5rem" }}>Level7 Commission</InputLabel>
                        <TextField  {...register("level7Commission", { required: true })} size='small' fullWidth variant="outlined" placeholder="Enter Level7 commission" />
                        {errors.level7Commission && <Typography color="error" fontSize={"14px"}>{errors.level7Commission.message}</Typography>}
                    </Grid>
                </Grid>
                <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                    <Button
                        variant='contained'
                        type='submit'
                        disabled={isLoading}
                        sx={{
                            textTransform: "capitalize",
                            boxShadow: "none",
                            color: "white",
                            mt: '1.5rem',
                            alignSelf: "self-start",
                            "&:hover": {
                                boxShadow: "none"
                            }
                        }}
                    >Submit</Button>
                    <Button
                        onClick={() => setDataToEdit(null)}
                        sx={{
                            textTransform: "capitalize",
                            boxShadow: "none",
                            mt: '1.5rem',
                            alignSelf: "self-start",
                            "&:hover": {
                                boxShadow: "none"
                            }
                        }}
                    >Cancel</Button>
                </Stack>
            </Stack>
        </>
    )
}

export default SetIBCommission;