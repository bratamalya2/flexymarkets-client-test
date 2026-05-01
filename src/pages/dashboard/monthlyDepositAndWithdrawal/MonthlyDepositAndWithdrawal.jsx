import { Stack, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';


const data = [
  { month: "Jan", deposit: 0, withdrawal: 0 },
  { month: "Feb", deposit: 0, withdrawal: 0 },
  { month: "Mar", deposit: 0, withdrawal: 0 },
  { month: "Apr", deposit: 0, withdrawal: 0 },
  { month: "May", deposit: 0, withdrawal: 0 },
  { month: "Jun", deposit: 0, withdrawal: 0 },
  { month: "Jul", deposit: 0, withdrawal: 0 },
  { month: "Aug", deposit: 0, withdrawal: 0 },
  { month: "sep", deposit: 0, withdrawal: 0 },
  { month: "Oct", deposit: 0, withdrawal: 0 },
  { month: "Nov", deposit: 0, withdrawal: 0 },
  { month: "Dec", deposit: 0, withdrawal: 0 }
];

function MonthlyDepositAndWithdrawal() {

  return (
    <Stack variant={"section"} sx={{ borderRadius: "1.2rem", py: "1.2rem" }}>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem", ml: "2rem" }}>
        <Stack sx={{ bgcolor: "primary.main", borderRadius: "50%", p: ".3rem" }}><DonutSmallOutlinedIcon sx={{ lineHeight: "0", color: "black" }} /></Stack>
        <Typography fontWeight={"bold"} variant="h6">Monthly Deposit/Withdrawal</Typography>
      </Stack>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="#999999" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#999999" }}
            stroke="#999999"
          />
          <YAxis
            domain={[-1, 1]}
            padding={{ top: 20, bottom: 20 }}
            tick={{ fontSize: 12, fill: "#999999" }}
            stroke="#999999"
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="deposit" stroke="custom.brandColors.brandDark" strokeWidth={2} />
          <Line type="monotone" dataKey="withdrawal" stroke="custom.brandColors.brandLight" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Stack>
  );
}

export default MonthlyDepositAndWithdrawal;