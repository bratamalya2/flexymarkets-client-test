import { Stack, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';


const data = [
    // { month: "Jan", Complete: 1250, Pending: 3500 },
    // { month: "Feb", Complete: 7000, Pending: 4500 },
    // { month: "Mar", Complete: 1200, Pending: 5000 },
    // { month: "Apr", Complete: 1100, Pending: 1500 },
];

function FTD() {

    return (
        <Stack variant={"section"} sx={{ borderRadius: "1.2rem", py: "1.2rem" }}>
            <Typography fontWeight={"bold"} variant="h6" ml={"2rem"}>FTD</Typography>
            <ResponsiveContainer width="100%" height={150}>
                <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 10 }} data={data}>
                    <CartesianGrid stroke="#999999" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#999999" }}
                        stroke="#999999"
                    />
                    <YAxis
                        // domain={[0, 1]}
                        padding={{ top: 20, bottom: 20 }}
                        tick={{ fontSize: 12, fill: "#999999" }}
                        stroke="#999999"
                    />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Complete" stroke={theme => theme.palette.custom.brandDark} strokeWidth={2} />
                    <Line type="monotone" dataKey="Pending" stroke={theme => theme.palette.custom.brandLight} strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </Stack>
    );
}

export default FTD;