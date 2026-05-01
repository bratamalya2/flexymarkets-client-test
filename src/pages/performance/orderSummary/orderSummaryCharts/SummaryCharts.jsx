import { Stack, useMediaQuery } from "@mui/material";
import { BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

const data = [
    { month: "Mar", Profit: 0, Loss: 0 },
    { month: "Apr", Profit: 0, Loss: 0 },
    { month: "May", Profit: 0, Loss: 0 },
    { month: "Jun", Profit: 0, Loss: 0 },
    { month: "Jul", Profit: 0, Loss: 0 },
    { month: "Aug", Profit: 0, Loss: 0 },
    { month: "Sep", Profit: 0, Loss: 0 },
    { month: "Oct", Profit: 0, Loss: 0 },
    { month: "Nov", Profit: 0, Loss: 0 },
    { month: "Dec", Profit: 0, Loss: 0 },
    { month: "Jan", Profit: 0, Loss: 0 },
    { month: "Feb", Profit: 0, Loss: 0 },
    { month: "Mar", Profit: 0, Loss: 0 },
];

function SummaryCharts() {
    const { selectedTheme } = useSelector((state) => state.themeMode);
    const matches = useMediaQuery("(min-width:600px)");

    return (
        <Stack
            variant={"section"}
            sx={{
                borderRadius: "1.2rem",
                mt: "1.2rem",
                py: selectedTheme === "dark" ? "1.2rem" : "0",
                height: { xs: "250px", sm: "400px", md: "500px", lg: "650px" },
                minHeight: "250px",
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: matches ? 30 : 0, left: -20, bottom: 40 }}
                >
                    <CartesianGrid stroke="#DADADA" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: matches ? 12 : 10, fill: "#999999" }}
                        stroke="transparent"
                        angle={matches ? 0 : -55}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis
                        domain={[0, 4]}
                        tickCount={matches ? 5 : 4}
                        tick={{ fontSize: 12, fill: "#999999" }}
                        stroke="transparent"
                        tickFormatter={(tick) => tick}
                    />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
                    <Legend />
                    <Bar dataKey="Profit" fill={theme => theme.palette.custom.brandDark} strokeWidth={2} />
                    <Bar dataKey="Loss" fill={theme => theme.palette.custom.brandLight} strokeWidth={2} />
                </BarChart>
            </ResponsiveContainer>
        </Stack>
    );
}

export default SummaryCharts;