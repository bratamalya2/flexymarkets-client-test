import { Stack, useTheme, Typography, Box } from "@mui/material";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';
import { useSelector } from 'react-redux';

const data = [
    { name: "Jan", uv: 4000, pv: 2400 },
    { name: "Feb", uv: 3000, pv: 1398 },
    { name: "Mar", uv: 2000, pv: 9800 },
    { name: "Apr", uv: 2780, pv: 3908 },
    { name: "May", uv: 1890, pv: 4800 },
    { name: "Jun", uv: 2390, pv: 3800 },
    { name: "Jul", uv: 3490, pv: 4300 },
    { name: "Aug", uv: 2000, pv: 9800 },
    { name: "Sep", uv: 2780, pv: 3908 },
    { name: "Oct", uv: 1890, pv: 4800 },
    { name: "Nov", uv: 2390, pv: 3800 },
    { name: "Dec", uv: 3490, pv: 4300 }
];

function IBMonthlyCommissionChart() {
    const { selectedTheme } = useSelector((state) => state.themeMode);
    const theme = useTheme();

    return (
        <Stack
            sx={{
                height: '100%',
                borderRadius: "16px",
                p: 3,
                bgcolor: selectedTheme === 'dark' ? "#1E1E2E" : "#ffffff",
                boxShadow: selectedTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.08)',
                border: selectedTheme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e0e0e0"
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Box sx={{
                    bgcolor: "rgba(0, 227, 150, 0.1)",
                    borderRadius: "8px",
                    p: 1,
                    display: 'flex',
                    color: '#00E396'
                }}>
                    <DonutSmallOutlinedIcon fontSize="small" />
                </Box>
                <Typography fontWeight={"bold"} variant="h6">Monthly Commission</Typography>
            </Stack>

            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={12}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00E396" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#00E396" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#008FFB" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#008FFB" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={selectedTheme === 'dark' ? "rgba(255,255,255,0.05)" : "#e0e0e0"}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: selectedTheme === 'dark' ? "#999" : "#666", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: selectedTheme === 'dark' ? "#999" : "#666", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: selectedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            contentStyle={{
                                backgroundColor: selectedTheme === 'dark' ? '#1E1E2E' : '#fff',
                                borderColor: selectedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#eee',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            name="Direct Commission"
                            dataKey="pv"
                            fill="url(#colorPv)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            name="Sub-IB Commission"
                            dataKey="uv"
                            fill="url(#colorUv)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Stack>
    );
}

export default IBMonthlyCommissionChart;
