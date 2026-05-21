import { Stack, Typography, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useSelector } from 'react-redux';

const data = [
    { month: "Jan", deposit: 4000, withdrawal: 2400 },
    { month: "Feb", deposit: 3000, withdrawal: 1398 },
    { month: "Mar", deposit: 2000, withdrawal: 9800 },
    { month: "Apr", deposit: 2780, withdrawal: 3908 },
    { month: "May", deposit: 1890, withdrawal: 4800 },
    { month: "Jun", deposit: 2390, withdrawal: 3800 },
    { month: "Jul", deposit: 3490, withdrawal: 4300 },
    { month: "Aug", deposit: 2000, withdrawal: 9800 },
    { month: "Sep", deposit: 2780, withdrawal: 3908 },
    { month: "Oct", deposit: 1890, withdrawal: 4800 },
    { month: "Nov", deposit: 2390, withdrawal: 3800 },
    { month: "Dec", deposit: 3490, withdrawal: 4300 }
];

function IBClientTransactionChart() {
    const { selectedTheme } = useSelector((state) => state.themeMode);

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
                    bgcolor: "rgba(0, 143, 251, 0.1)",
                    borderRadius: "8px",
                    p: 1,
                    display: 'flex',
                    color: '#008FFB'
                }}>
                    <PermIdentityOutlinedIcon fontSize="small" />
                </Box>
                <Typography fontWeight={"bold"} variant="h6">My Client Transaction</Typography>
            </Stack>

            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={selectedTheme === 'dark' ? "rgba(255,255,255,0.05)" : "#e0e0e0"}
                        />
                        <XAxis
                            dataKey="month"
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
                            contentStyle={{
                                backgroundColor: selectedTheme === 'dark' ? '#1E1E2E' : '#fff',
                                borderColor: selectedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#eee',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            name="Total Deposit"
                            type="monotone"
                            dataKey="deposit"
                            stroke="#00E396"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 0, fill: "#00E396" }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            name="Total Withdraw"
                            type="monotone"
                            dataKey="withdrawal"
                            stroke="#008FFB"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 0, fill: "#008FFB" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Stack>
    );
}

export default IBClientTransactionChart;
