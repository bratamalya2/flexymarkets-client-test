import {
    Box, CircularProgress, Alert, Select as MuiSelect,
    MenuItem, FormControl, Typography as MuiTypography
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
import {
    useGetMyMasterTraderProfileQuery,
    useUpdateMyMasterTraderProfileMutation,
} from '../../../globalState/socialTradingState/socialTradingApis';
import { cn } from '../../../lib/utils';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Separator } from '../../../components/ui/separator';

const schema = z.object({
    displayName: z.string().min(1, 'Display name is required'),
    description: z.string().optional(),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    tradingStyle: z.enum(['SCALPING', 'SWING', 'DAY', 'POSITION']).optional().nullable(),
    instruments: z.array(z.enum(['FOREX', 'INDICES', 'COMMODITIES', 'CRYPTO', 'STOCKS'])).optional().default([]),
    avgTradeDuration: z.enum(['MINUTES', 'HOURS', 'DAYS', 'WEEKS']).optional().nullable(),
    minimumCopyBalance: z.coerce.number().min(0, 'Must be 0 or greater'),
    maxCopiers: z.coerce.number().int().min(1, 'Must be at least 1'),
});

const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
];
const traderGradient = (id) => AVATAR_GRADIENTS[(Number(id) || 0) % AVATAR_GRADIENTS.length];

const RISK_OPTIONS = [
    {
        value: 'LOW',
        label: 'Low Risk',
        description: 'Conservative, stable returns',
        color: 'emerald',
        border: 'border-emerald-500',
        bg: 'bg-emerald-50',
        dot: 'bg-emerald-500',
        selectedText: 'text-emerald-700',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
    },
    {
        value: 'MEDIUM',
        label: 'Medium Risk',
        description: 'Balanced growth & safety',
        color: 'amber',
        border: 'border-amber-500',
        bg: 'bg-amber-50',
        dot: 'bg-amber-500',
        selectedText: 'text-amber-700',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
    },
    {
        value: 'HIGH',
        label: 'High Risk',
        description: 'Aggressive, high potential',
        color: 'red',
        border: 'border-red-500',
        bg: 'bg-red-50',
        dot: 'bg-red-500',
        selectedText: 'text-red-700',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
    },
];

const STYLE_OPTIONS = [
    { value: '', label: 'Not specified' },
    { value: 'SCALPING', label: 'Scalping' },
    { value: 'SWING', label: 'Swing' },
    { value: 'DAY', label: 'Day Trading' },
    { value: 'POSITION', label: 'Position' },
];
const DURATION_OPTIONS = [
    { value: '', label: 'Not specified' },
    { value: 'MINUTES', label: 'Minutes' },
    { value: 'HOURS', label: 'Hours' },
    { value: 'DAYS', label: 'Days' },
    { value: 'WEEKS', label: 'Weeks' },
];
const INSTRUMENT_OPTIONS = ['FOREX', 'INDICES', 'COMMODITIES', 'CRYPTO', 'STOCKS'];

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export default function MyMasterTraderProfile() {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useGetMyMasterTraderProfileQuery();
    const [updateProfile, { isLoading: isSaving }] = useUpdateMyMasterTraderProfileMutation();

    const trader = data?.data;
    const grad = traderGradient(trader?.id);

    const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            displayName: '', description: '', riskLevel: 'MEDIUM',
            tradingStyle: null, instruments: [], avgTradeDuration: null,
            minimumCopyBalance: 0, maxCopiers: 500,
        },
    });

    useEffect(() => {
        if (trader) {
            reset({
                displayName: trader.displayName || '',
                description: trader.description || '',
                riskLevel: trader.riskLevel || 'MEDIUM',
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
                description: formData.description || '',
                riskLevel: formData.riskLevel,
                tradingStyle: formData.tradingStyle || null,
                instruments: formData.instruments || [],
                avgTradeDuration: formData.avgTradeDuration || null,
                minimumCopyBalance: Number(formData.minimumCopyBalance),
                maxCopiers: Number(formData.maxCopiers),
            }).unwrap();
            dispatch(setNotification({ open: true, message: res?.message || 'Profile updated!', severity: 'success' }));
        } catch (err) {
            dispatch(setNotification({ open: true, message: err?.data?.message || 'Failed to update profile.', severity: 'error' }));
        }
    };

    const riskLevel = watch('riskLevel');
    const instruments = watch('instruments') || [];

    return (
        <Box>
            {/* ── Hero ── */}
            <Box sx={{
                background: `linear-gradient(rgba(7,12,42,0.88), rgba(10,22,74,0.78)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
                py: { xs: 5, md: 8 },
                textAlign: 'center',
                color: 'white',
            }}>
                <TrendingUpIcon sx={{ fontSize: 42, mb: 1.5, opacity: 0.9 }} />
                <MuiTypography variant="h4" fontWeight={800} mb={1}>My Trader Profile</MuiTypography>
                <MuiTypography variant="body1" sx={{ opacity: 0.65, maxWidth: 480, mx: 'auto' }}>
                    Craft your public identity to attract the right copiers.
                </MuiTypography>
            </Box>

            <div className="bg-gray-50 min-h-screen py-8 px-4">
                <div className="max-w-5xl mx-auto">

                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <CircularProgress sx={{ color: '#6366f1' }} />
                        </div>
                    )}
                    {isError && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>Failed to load your master trader profile.</Alert>
                    )}

                    {!isLoading && !isError && !trader && (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            You do not have a master trader profile. Please contact support or your account manager to get set up as a master trader.
                        </Alert>
                    )}

                    {!isLoading && !isError && trader && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                {/* ── Left column: form fields ── */}
                                <div className="lg:col-span-7 space-y-6">

                                    {/* Basic info card */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                                        <div>
                                            <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">Your public display name and description</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                                                Display Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="displayName"
                                                placeholder="e.g. AlphaTrader Pro"
                                                {...register('displayName')}
                                                className="h-10 border-gray-200 focus-visible:ring-indigo-500"
                                            />
                                            <FieldError message={errors.displayName?.message} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                rows={4}
                                                placeholder="Describe your trading strategy, experience, and what copiers can expect…"
                                                {...register('description')}
                                                className="resize-none border-gray-200 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Risk level card */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                                        <div>
                                            <h2 className="text-base font-semibold text-gray-900">Risk Level <span className="text-red-500">*</span></h2>
                                            <p className="text-sm text-gray-500 mt-0.5">How would you characterise your trading style?</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {RISK_OPTIONS.map((opt) => {
                                                const selected = riskLevel === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setValue('riskLevel', opt.value, { shouldValidate: true })}
                                                        className={cn(
                                                            "relative rounded-xl border-2 p-4 text-left transition-all duration-200 cursor-pointer",
                                                            selected ? `${opt.border} ${opt.bg}` : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        <div className={cn("h-2 w-2 rounded-full mb-2.5", selected ? opt.dot : "bg-gray-300")} />
                                                        <p className={cn("text-sm font-semibold leading-tight", selected ? opt.selectedText : "text-gray-700")}>
                                                            {opt.label}
                                                        </p>
                                                        <p className={cn("text-[11px] mt-0.5 leading-tight", selected ? opt.selectedText + '/80' : "text-gray-400")}>
                                                            {opt.description}
                                                        </p>
                                                        {selected && (
                                                            <div className={cn("absolute top-2.5 right-2.5 h-4 w-4 rounded-full flex items-center justify-center", opt.dot)}>
                                                                <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                                                                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Strategy card */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                                        <div>
                                            <h2 className="text-base font-semibold text-gray-900">Strategy Details</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">Help copiers understand how you trade</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-gray-700">Trading Style</Label>
                                                <Controller name="tradingStyle" control={control} render={({ field }) => (
                                                    <FormControl fullWidth size="small">
                                                        <MuiSelect
                                                            {...field}
                                                            value={field.value || ''}
                                                            onChange={(e) => field.onChange(e.target.value || null)}
                                                            sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
                                                        >
                                                            {STYLE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                                                        </MuiSelect>
                                                    </FormControl>
                                                )} />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-gray-700">Avg Trade Duration</Label>
                                                <Controller name="avgTradeDuration" control={control} render={({ field }) => (
                                                    <FormControl fullWidth size="small">
                                                        <MuiSelect
                                                            {...field}
                                                            value={field.value || ''}
                                                            onChange={(e) => field.onChange(e.target.value || null)}
                                                            sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
                                                        >
                                                            {DURATION_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                                                        </MuiSelect>
                                                    </FormControl>
                                                )} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">Instruments Traded</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {INSTRUMENT_OPTIONS.map((inst) => {
                                                    const active = instruments.includes(inst);
                                                    return (
                                                        <button
                                                            key={inst}
                                                            type="button"
                                                            onClick={() => {
                                                                const next = active
                                                                    ? instruments.filter((i) => i !== inst)
                                                                    : [...instruments, inst];
                                                                setValue('instruments', next, { shouldValidate: true });
                                                            }}
                                                            className={cn(
                                                                "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150",
                                                                active
                                                                    ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                                                                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                                                            )}
                                                        >
                                                            {inst.charAt(0) + inst.slice(1).toLowerCase()}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Copy settings card */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                                        <div>
                                            <h2 className="text-base font-semibold text-gray-900">Copy Settings</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">Set limits for copiers joining your strategy</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="minimumCopyBalance" className="text-sm font-medium text-gray-700">
                                                    Min Copy Balance ($) <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="minimumCopyBalance"
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    {...register('minimumCopyBalance', { valueAsNumber: true })}
                                                    className="h-10 border-gray-200 focus-visible:ring-indigo-500"
                                                />
                                                <FieldError message={errors.minimumCopyBalance?.message} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="maxCopiers" className="text-sm font-medium text-gray-700">
                                                    Max Copiers <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="maxCopiers"
                                                    type="number"
                                                    min="1"
                                                    placeholder="500"
                                                    {...register('maxCopiers', { valueAsNumber: true })}
                                                    className="h-10 border-gray-200 focus-visible:ring-indigo-500"
                                                />
                                                <FieldError message={errors.maxCopiers?.message} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Right column: profile summary + info ── */}
                                <div className="lg:col-span-5 space-y-5">

                                    {/* Profile preview card */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-4">
                                        {/* Gradient cover */}
                                        <div className="h-24 relative overflow-hidden" style={{ background: grad }}>
                                            <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full bg-white/10" />
                                            <div className="absolute bottom-[-30px] left-[-10px] w-20 h-20 rounded-full bg-white/[0.07]" />
                                            {trader.status === 'ACTIVE' && (
                                                <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <div className="px-5 pb-5">
                                            <div className="-mt-7 mb-3 flex items-end justify-between">
                                                <div className="h-14 w-14 rounded-full flex items-center justify-center text-white font-black text-xl border-[3px] border-white shadow-md" style={{ background: grad }}>
                                                    {(trader.displayName || 'T')[0].toUpperCase()}
                                                </div>
                                            </div>
                                            <p className="font-bold text-gray-900 text-base">{trader.displayName}</p>
                                            <p className="text-xs text-gray-400 mb-4">MT5 Login: {trader.mt5Login}</p>

                                            <div className="grid grid-cols-3 gap-3 text-center">
                                                {[
                                                    { icon: <PeopleOutlineIcon sx={{ fontSize: 16, color: '#6366f1' }} />, value: trader.activeCopiers ?? 0, label: 'Copiers' },
                                                    { icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16, color: '#6366f1' }} />, value: `$${trader.minimumCopyBalance}`, label: 'Min Balance' },
                                                    { icon: <ShowChartIcon sx={{ fontSize: 16, color: '#6366f1' }} />, value: trader.maxCopiers, label: 'Max Copiers' },
                                                ].map((s) => (
                                                    <div key={s.label} className="rounded-xl bg-gray-50 p-2.5">
                                                        <div className="flex justify-center mb-1">{s.icon}</div>
                                                        <p className="text-sm font-bold text-gray-800">{s.value}</p>
                                                        <p className="text-[10px] text-gray-400">{s.label}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info card */}
                                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white space-y-4 shadow-lg shadow-indigo-200">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                                <TrendingUpIcon sx={{ fontSize: 22, color: 'white' }} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base leading-tight">Build your trading reputation</p>
                                                <p className="text-xs text-white/70 mt-0.5">Attract more copiers with a complete profile</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            {[
                                                { icon: <VerifiedIcon sx={{ fontSize: 15 }} />, text: "A detailed strategy description increases copy rate by up to 3×" },
                                                { icon: <PeopleOutlineIcon sx={{ fontSize: 15 }} />, text: "Set a competitive minimum balance to widen your copier pool" },
                                                { icon: <ShowChartIcon sx={{ fontSize: 15 }} />, text: "Accurate risk level helps copiers self-select the right fit" },
                                            ].map(({ icon, text }) => (
                                                <div key={text} className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 text-white/70 flex-shrink-0">{icon}</div>
                                                    <p className="text-xs text-white/80 leading-relaxed">{text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Separator + actions ── */}
                            <div className="mt-8">
                                <Separator className="bg-gray-200 mb-6" />
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="px-5 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    >
                                        {isSaving ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Box>
    );
}
