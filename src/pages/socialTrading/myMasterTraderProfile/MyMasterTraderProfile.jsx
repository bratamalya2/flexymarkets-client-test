import {
    Container, Typography, Box, Card, CardContent, Stack, Button,
    TextField, InputLabel, Grid, Switch, FormControlLabel, Divider,
    CircularProgress, Alert, Chip, Select, MenuItem, OutlinedInput,
    Checkbox, ListItemText, FormControl
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
import {
    useGetMyMasterTraderProfileQuery,
    useUpdateMyMasterTraderProfileMutation,
} from '../../../globalState/socialTradingState/socialTradingApis';
import Selector from '../../../components/Selector';

const schema = z.object({
    displayName: z.string().min(1, "Display name is required"),
    description: z.string().optional(),
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
    tradingStyle: z.enum(["SCALPING", "SWING", "DAY", "POSITION"]).optional().nullable(),
    instruments: z.array(z.enum(["FOREX", "INDICES", "COMMODITIES", "CRYPTO", "STOCKS"])).optional().default([]),
    avgTradeDuration: z.enum(["MINUTES", "HOURS", "DAYS", "WEEKS"]).optional().nullable(),
    minimumCopyBalance: z.coerce.number().min(0, "Must be 0 or greater"),
    maxCopiers: z.coerce.number().int().min(1, "Must be at least 1"),
});

const riskColor = (level) => {
    if (level === 'LOW') return 'success';
    if (level === 'HIGH') return 'error';
    return 'warning';
};

function ProfileSummary({ trader }) {
    return (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>{trader.displayName}</Typography>
                        <Typography variant="caption" color="text.secondary">MT5 Login: {trader.mt5Login}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} ml="auto" flexWrap="wrap">
                        <Chip label={trader.riskLevel} color={riskColor(trader.riskLevel)} size="small" variant="outlined" />
                        <Chip label={trader.status} color={trader.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                    </Stack>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={3}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Min Balance</Typography>
                        <Typography variant="body2" fontWeight={600}>${trader.minimumCopyBalance}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Max Copiers</Typography>
                        <Typography variant="body2" fontWeight={600}>{trader.maxCopiers}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Active Copiers</Typography>
                        <Typography variant="body2" fontWeight={600}>{trader.activeCopiers}</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function MyMasterTraderProfile() {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useGetMyMasterTraderProfileQuery();
    const [updateProfile, { isLoading: isSaving }] = useUpdateMyMasterTraderProfileMutation();

    const trader = data?.data;

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            displayName: "",
            description: "",
            riskLevel: "MEDIUM",
            tradingStyle: null,
            instruments: [],
            avgTradeDuration: null,
            minimumCopyBalance: 0,
            maxCopiers: 500,
        },
    });

    useEffect(() => {
        if (trader) {
            reset({
                displayName: trader.displayName || "",
                description: trader.description || "",
                riskLevel: trader.riskLevel || "MEDIUM",
                tradingStyle: trader.tradingStyle || null,
                instruments: trader.instruments || [],
                avgTradeDuration: trader.avgTradeDuration || null,
                minimumCopyBalance: parseFloat(trader.minimumCopyBalance) || 0,
                maxCopiers: trader.maxCopiers || 500,
            });
        }
    }, [trader, reset]);

    const onSubmit = async (formData) => {
        try {
            const res = await updateProfile({
                displayName: formData.displayName,
                description: formData.description || "",
                riskLevel: formData.riskLevel,
                tradingStyle: formData.tradingStyle || null,
                instruments: formData.instruments || [],
                avgTradeDuration: formData.avgTradeDuration || null,
                minimumCopyBalance: Number(formData.minimumCopyBalance),
                maxCopiers: Number(formData.maxCopiers),
            }).unwrap();

            dispatch(setNotification({
                open: true,
                message: res?.message || "Profile updated successfully!",
                severity: "success",
            }));
        } catch (err) {
            dispatch(setNotification({
                open: true,
                message: err?.data?.message || "Failed to update profile.",
                severity: "error",
            }));
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>My Master Trader Profile</Typography>
            </Stack>

            {isLoading && (
                <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Alert severity="error">Failed to load your master trader profile.</Alert>
            )}

            {!isLoading && !isError && !trader && (
                <Alert severity="info">
                    You do not have a master trader profile. Please contact support or your account manager to get set up as a master trader.
                </Alert>
            )}

            {!isLoading && !isError && trader && (
                <>
                    <ProfileSummary trader={trader} />

                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <EditOutlinedIcon fontSize="small" color="primary" />
                                <Typography variant="subtitle1" fontWeight={600}>Edit Profile</Typography>
                            </Stack>
                            <Divider sx={{ mb: 3 }} />

                            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={3}>

                                    {/* Display Name */}
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Display Name *</InputLabel>
                                        <TextField
                                            {...register("displayName")}
                                            size="small"
                                            fullWidth
                                            placeholder="Enter display name"
                                        />
                                        {errors.displayName && <Typography color="error" fontSize="14px">{errors.displayName.message}</Typography>}
                                    </Grid>

                                    {/* Risk Level */}
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Risk Level *</InputLabel>
                                        <Selector
                                            items={[
                                                { value: "LOW", name: "Low" },
                                                { value: "MEDIUM", name: "Medium" },
                                                { value: "HIGH", name: "High" },
                                            ]}
                                            placeholder="Select Risk Level"
                                            value={watch("riskLevel")}
                                            onChange={(e) => setValue("riskLevel", e.target.value, { shouldValidate: true })}
                                            shouldBeFullWidth={true}
                                        />
                                        {errors.riskLevel && <Typography color="error" fontSize="14px">{errors.riskLevel.message}</Typography>}
                                    </Grid>

                                    {/* Trading Style */}
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Trading Style</InputLabel>
                                        <Selector
                                            items={[
                                                { value: "", name: "Not specified" },
                                                { value: "SCALPING", name: "Scalping" },
                                                { value: "SWING", name: "Swing" },
                                                { value: "DAY", name: "Day Trading" },
                                                { value: "POSITION", name: "Position" },
                                            ]}
                                            placeholder="Select Trading Style"
                                            value={watch("tradingStyle") || ""}
                                            onChange={(e) => setValue("tradingStyle", e.target.value || null, { shouldValidate: true })}
                                            shouldBeFullWidth={true}
                                        />
                                    </Grid>

                                    {/* Avg Trade Duration */}
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Avg Trade Duration</InputLabel>
                                        <Selector
                                            items={[
                                                { value: "", name: "Not specified" },
                                                { value: "MINUTES", name: "Minutes" },
                                                { value: "HOURS", name: "Hours" },
                                                { value: "DAYS", name: "Days" },
                                                { value: "WEEKS", name: "Weeks" },
                                            ]}
                                            placeholder="Select Duration"
                                            value={watch("avgTradeDuration") || ""}
                                            onChange={(e) => setValue("avgTradeDuration", e.target.value || null, { shouldValidate: true })}
                                            shouldBeFullWidth={true}
                                        />
                                    </Grid>

                                    {/* Instruments */}
                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Instruments Traded</InputLabel>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                multiple
                                                value={watch("instruments") || []}
                                                onChange={(e) => setValue("instruments", e.target.value, { shouldValidate: true })}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => selected.length ? selected.join(", ") : "None"}
                                            >
                                                {["FOREX", "INDICES", "COMMODITIES", "CRYPTO", "STOCKS"].map((inst) => (
                                                    <MenuItem key={inst} value={inst}>
                                                        <Checkbox checked={(watch("instruments") || []).includes(inst)} />
                                                        <ListItemText primary={inst.charAt(0) + inst.slice(1).toLowerCase()} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Min Copy Balance */}
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Minimum Copy Balance *</InputLabel>
                                        <TextField
                                            type="number"
                                            {...register("minimumCopyBalance", { valueAsNumber: true })}
                                            size="small"
                                            fullWidth
                                            placeholder="0"
                                        />
                                        {errors.minimumCopyBalance && <Typography color="error" fontSize="14px">{errors.minimumCopyBalance.message}</Typography>}
                                    </Grid>

                                    {/* Max Copiers */}
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Max Copiers *</InputLabel>
                                        <TextField
                                            type="number"
                                            {...register("maxCopiers", { valueAsNumber: true })}
                                            size="small"
                                            fullWidth
                                            placeholder="500"
                                        />
                                        {errors.maxCopiers && <Typography color="error" fontSize="14px">{errors.maxCopiers.message}</Typography>}
                                    </Grid>

                                    {/* Description */}
                                    <Grid item xs={12}>
                                        <InputLabel sx={{ mb: ".5rem" }}>Description</InputLabel>
                                        <TextField
                                            {...register("description")}
                                            size="small"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Describe your trading approach..."
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSaving}
                                    sx={{
                                        mt: 3,
                                        textTransform: "capitalize",
                                        boxShadow: "none",
                                        color: "white",
                                        "&:hover": { boxShadow: "none" },
                                    }}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
}
