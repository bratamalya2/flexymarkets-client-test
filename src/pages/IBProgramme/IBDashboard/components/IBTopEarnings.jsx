import { Stack, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";
import { useSelector } from 'react-redux';

const MOCK_TOP_EARNERS = [
    // Uncomment to test UI
    // { id: 1, name: "John Doe", login: "1001", amount: "$5,000", type: "Commission" },
    // { id: 2, name: "Jane Smith", login: "1002", amount: "$3,200", type: "Commission" },
];

function IBTopEarnings() {
    const { selectedTheme } = useSelector((state) => state.themeMode);
    const isDark = selectedTheme === 'dark';

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: isDark ? '#fff' : 'inherit' }}>
                Top Five Earnings Of Sub IBs
            </Typography>

            <TableContainer component={Paper} sx={{
                borderRadius: "16px",
                bgcolor: isDark ? "#1E1E2E" : "#ffffff",
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.08)',
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e0e0e0",
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" }}>
                        <TableRow>
                            <TableCell sx={{ color: isDark ? "#999" : "#666", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>User ID</TableCell>
                            <TableCell sx={{ color: isDark ? "#999" : "#666", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>Name</TableCell>
                            <TableCell sx={{ color: isDark ? "#999" : "#666", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>MT5 Login</TableCell>
                            <TableCell sx={{ color: isDark ? "#999" : "#666", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>Amount</TableCell>
                            <TableCell sx={{ color: isDark ? "#999" : "#666", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {MOCK_TOP_EARNERS.length > 0 ? (
                            MOCK_TOP_EARNERS.map((row) => (
                                <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f5f5f5" } }}>
                                    <TableCell sx={{ color: isDark ? "#fff" : "inherit", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>{row.id}</TableCell>
                                    <TableCell sx={{ color: isDark ? "#fff" : "inherit", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>{row.name}</TableCell>
                                    <TableCell sx={{ color: isDark ? "#fff" : "inherit", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>{row.login}</TableCell>
                                    <TableCell sx={{ color: "#00E396", fontWeight: "bold", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>{row.amount}</TableCell>
                                    <TableCell sx={{ color: isDark ? "#fff" : "inherit", borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>{row.type}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6, borderColor: isDark ? "rgba(255,255,255,0.05)" : "#eee" }}>
                                    <Typography color="text.secondary">No records to display</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default IBTopEarnings;